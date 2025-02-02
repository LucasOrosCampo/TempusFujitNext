using cs_backend.Infrastructure;
using cs_backend.Infrastructure.ViewModels;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using System.Runtime.InteropServices.JavaScript;
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
            await using var db = await dbContextFactory.CreateDbContextAsync();
            return db.Groups.Where(x => x.User.UserName == user).Select(GroupDto.FromState).ToArray();
        }

        public async Task<GroupDto?> Get(string user, int id)
        {
            await using var db = await dbContextFactory.CreateDbContextAsync();
            var group = db.Groups.FirstOrDefault(x => x.User.UserName == user && x.Id == id);
            var groupDto = group != null ? GroupDto.FromState(group) : null;
            
            return groupDto;
        }


        public Task<bool> CreateGroup(GroupRequest createGroup, string user)
        {
            using var db = dbContextFactory.CreateDbContext(); 
            if (db.Groups.Any(x => x.Name == createGroup.Name && x.User.UserName == user)) return Task.FromResult(false);
            
            db.Add(new GroupState { Name = createGroup.Name, Description = createGroup.Description, UserName = user });
            db.SaveChanges();
            return Task.FromResult(true);
        }
        
        public Task<bool> Delete(string user, int id)
        {
            using var db = dbContextFactory.CreateDbContext();
            var group = db.Groups.FirstOrDefault(x => x.Id == id && user == x.UserName);
            if (group == null) return Task.FromResult(false);
            var groupId = db.Groups.Remove(group);
            db.SaveChanges();
            return Task.FromResult(true);
        }

        public record GroupsExport(GroupExport[] GroupExports);
        
        public record YearlySummary(int Year, Dictionary<int, decimal> hoursByMonth);
        public record GroupExport(string GroupName, SessionDto[] Sessions, YearlySummary? YearlySummary); 
        
        public Task<GroupsExport> GetExport(string user, DateTime? date = null)
        {
            using var db = dbContextFactory.CreateDbContext();
            var groupExports = (from g in db.Groups.Where(x => x.UserName == user)
                      join s in db.Sessions
                      on g.Id equals s.GroupId
                      select new { Group = g, Session = s })
                      .GroupBy(x => x.Group.Id)
                      .AsEnumerable()
                      .Select(x =>
                      {
                          var sessions = x.Select(s => SessionDto.FromState(s.Session)).ToArray();
                          return new GroupExport(FormatGroupname(x.First().Group), sessions,
                              date.HasValue ? GetYearlySummary(date.Value.Year, sessions): null);
                      })
                      .ToArray();
            return Task.FromResult(new GroupsExport(groupExports));
            
            string FormatGroupname(GroupState group) => $"{group.Name}-{group.Description}";
        }

        private YearlySummary GetYearlySummary(int targetYear, SessionDto[] sessions)
        {
            var summaries = new Dictionary<int, decimal>();
            for (int month = 1; month <= 12; month++)
            {
                var hours = sessions
                    .Where(s => s.Start.Year == targetYear && s.Start.Month == month)
                    .Sum(s => s.Duration);
                summaries[month] = hours;
            }
            
            return new YearlySummary(targetYear, summaries);
        }
    }
}

