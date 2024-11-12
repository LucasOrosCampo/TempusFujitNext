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
