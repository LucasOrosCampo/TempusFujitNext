using System.Collections.ObjectModel;

namespace cs_backend.Infrastructure.PersistedModels
{
    public class UserState
    {
        public string UserName { get; set; }
        public string HashedPassword { get ; set; }
        public ICollection<GroupState> Groups { get; set; }
    }
}
