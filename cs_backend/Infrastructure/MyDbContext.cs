using Microsoft.EntityFrameworkCore;
using cs_backend.Infrastructure.PersistedModels;

namespace cs_backend.Infrastructure
{
    public class MyDbContext: DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }
        public DbSet<UserState> Users {  get; set; } 
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserState>().HasKey(x => x.UserName);
        }
    }

}
