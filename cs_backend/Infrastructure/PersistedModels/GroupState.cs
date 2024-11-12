using System.Collections.ObjectModel;

namespace cs_backend.Infrastructure.PersistedModels
{
    public class GroupState
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public UserState User { get; set; }
        public string UserName { get; set; }
    }
}
