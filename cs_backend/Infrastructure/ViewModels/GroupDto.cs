using cs_backend.Infrastructure.PersistedModels;

namespace cs_backend.Infrastructure.ViewModels
{
    public class GroupDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        public static GroupDto FromState(GroupState state) => new GroupDto
        {
            Id = state.Id,
            Name = state.Name,
            Description = state.Description,
        };
    }
}
