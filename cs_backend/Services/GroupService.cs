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
    public class GroupService(IDbContextFactory<MyDbContext> dbContextFactory)
    {
        public async Task<GroupDto[]> GetAll(string user)
        {
            using var db = dbContextFactory.CreateDbContext();
            return db.Groups.Where(x => x.User.UserName == user).Select(GroupDto.FromState).ToArray();
        }

        public async Task<GroupDto> Get(string user, int id)
        {
            using var db = dbContextFactory.CreateDbContext();
            var group = db.Groups.FirstOrDefault(x => x.User.UserName == user && x.Id == id);
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
        
        public async Task<bool> Delete(string user, int id)
        {
            using var db = dbContextFactory.CreateDbContext();
            var group = db.Groups.FirstOrDefault(x => x.Id == id && user == x.UserName);
            if (group == null) return false;
            var groupId = db.Groups.Remove(group);
            db.SaveChanges();
            return true;
        }

    }
}
