using cs_backend.Infrastructure;
using cs_backend.Infrastructure.ViewModels;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using cs_backend.Controllers;
using static cs_backend.Controllers.GroupController;
using cs_backend.Infrastructure.PersistedModels;
using System.Xml.Linq;

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


        public async Task<bool> CreateGroup(GroupRequest createGroup, string user)
        {
            using var db = dbContextFactory.CreateDbContext(); 
            if (db.Groups.Any(x => x.Name == createGroup.Name && x.User.UserName == user)) return false;
            
            db.Add(new GroupState { Name = createGroup.Name, Description = createGroup.Description, UserName = user });
            db.SaveChanges();
            return true;
        }
    }
}
