using Microsoft.EntityFrameworkCore;
using cs_backend.Infrastructure.PersistedModels;

namespace cs_backend.Infrastructure
{
    public class MyDbContext: DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }
        public DbSet<UserState> Users {  get; set; } 
        public DbSet<GroupState> Groups {  get; set; } 

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserState>().HasMany(x => x.Groups);
            modelBuilder.Entity<UserState>().HasKey(x => x.UserName);

            modelBuilder.Entity<GroupState>().HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserName);
        }
    }

}
