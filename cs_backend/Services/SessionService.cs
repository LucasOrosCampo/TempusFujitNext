using cs_backend.Infrastructure;
using cs_backend.Infrastructure.PersistedModels;
using cs_backend.Infrastructure.ViewModels;
using Microsoft.EntityFrameworkCore;
using static cs_backend.Controllers.SessionController;

namespace cs_backend.Services
{
    public class SessionService(IDbContextFactory<MyDbContext> dbContextFactory)
    {
        public async Task<SessionDto[]> GetAll(string user, string group)
        {
            using var db = dbContextFactory.CreateDbContext();
            var groupState = db.Groups.FirstOrDefault(x => x.Name == group && x.UserName == user);
            if (groupState == null) return [];
            return db.Sessions.Where(x => x.GroupId == groupState!.Id)
                .OrderByDescending(x => x.Start)
                .Select(SessionDto.FromState).ToArray();
        }

        public async Task<GroupDto> Get(string user, string groupName)
        {
            using var db = dbContextFactory.CreateDbContext();
            var group = db.Groups.FirstOrDefault(x => x.User.UserName == user && x.Name == groupName);
            var group_dto = group != null ? GroupDto.FromState(group) : null;

            return group_dto;
            
        }


        public async Task<bool> Start(string user, StartSession startSession)
        {
            using var db = dbContextFactory.CreateDbContext(); 
            var groupId = db.Groups.FirstOrDefault(x => x.Id == startSession.Group)?.Id;

            if (groupId == null) return false;
            
            db.Add(new SessionState { Start= startSession.Start, End = null, GroupId = groupId.Value });
            db.SaveChanges();
            return true;
        }
        public async Task<bool> End(string user, EndSession endSession)
        {
            using var db = dbContextFactory.CreateDbContext(); 
            var groupId = db.Groups.FirstOrDefault(x => x.Id == endSession.Group)?.Id;

            if (groupId == null) return false;
            
            var runningSession = db.Sessions.FirstOrDefault(x => x.GroupId == groupId.Value && x.Start == endSession.Start && x.End == null);

            if (runningSession == null || runningSession?.Start >= endSession.End) return false;

            runningSession.End = endSession.End; 

            db.SaveChanges();
            return true;
        }
    }
}
