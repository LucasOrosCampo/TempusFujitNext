using cs_backend.Infrastructure;
using cs_backend.Infrastructure.PersistedModels;
using cs_backend.Infrastructure.ViewModels;
using Microsoft.EntityFrameworkCore;
using static cs_backend.Controllers.SessionController;

namespace cs_backend.Services
{
    public class SessionService(IDbContextFactory<MyDbContext> dbContextFactory)
    {
        public async Task<SessionDto[]> Search(string user, string group, DateTime? start, DateTime? end)
        {
            await using var db = await dbContextFactory.CreateDbContextAsync();
            var groupId = db.Groups.FirstOrDefault(x => x.Name == group && x.UserName == user)?.Id;
            if (groupId == null) return [];

            start = start?.Date;
            end = end?.Date;

            return db.Sessions
                .Where(x => x.GroupId == groupId 
                && (!start.HasValue || start <= x.Start.Date )
                && (!end.HasValue || !x.End.HasValue  || x.End.Value.Date <= end)
                )
                .OrderByDescending(x => x.Start)
                .Select(SessionDto.FromState).ToArray();
        }

        public Task<GroupDto?> Get(string user, string groupName)
        {
            using var db = dbContextFactory.CreateDbContext();
            var group = db.Groups.FirstOrDefault(x => x.User.UserName == user && x.Name == groupName);
            var groupDto = group != null ? GroupDto.FromState(group) : null;

            return Task.FromResult(groupDto);
            
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
            var groupId = db.Groups.FirstOrDefault(x => x.Id == endSession.Group && x.UserName == user)?.Id;

            if (groupId == null) return false;
            
            var runningSession = db.Sessions.FirstOrDefault(x => x.GroupId == groupId.Value && x.Start == endSession.Start && x.End == null);

            if (runningSession == null || runningSession?.Start >= endSession.End) return false;

            runningSession.End = endSession.End;
            runningSession.Note = endSession.Note;

            db.SaveChanges();
            return true;
        }
        
        public async Task<double> GetDuration(string user, string group, DateTime? start, DateTime? end)
        {

            var sessions = await Search(user, group, start, end);

            return sessions.Sum(x => x.End != null ? (x.End - x.Start).Value.TotalHours : 0);
                
        }

        public async Task<bool> Add(string user, AddSession addSession)
        {
            using var db = dbContextFactory.CreateDbContext(); 
            var groupId = db.Groups.FirstOrDefault(x => x.Id == addSession.Group && x.UserName == user)?.Id;

            if (groupId == null) return false;
            
            if (addSession.Start >= addSession.End) return false;
                
            db.Add(new SessionState { Start= addSession.Start, End = addSession.End, GroupId = groupId.Value, Note = addSession.Note });
            
            return db.SaveChanges() == 1;
        }
    }
}
