namespace cs_backend.Infrastructure.PersistedModels
{
    public class SessionState
    {
        public int Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime? End { get; set; }
        public GroupState Group { get; set; }
        public int GroupId { get; set; }
        public string Note { get; set; } = String.Empty;
    }
}
