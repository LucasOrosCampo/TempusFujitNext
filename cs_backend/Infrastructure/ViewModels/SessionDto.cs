using cs_backend.Infrastructure.PersistedModels;

namespace cs_backend.Infrastructure.ViewModels
{
    public class SessionDto
    {
        public int Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime? End { get; set; }
        public int GroupId { get; set; }
        public decimal Duration { get; set; }
        public string Note { get; set; }

    public static SessionDto FromState(SessionState sessionState) => 
        new SessionDto { Id = sessionState.Id, Start = sessionState.Start, End = sessionState.End, GroupId = sessionState.GroupId , Note = sessionState.Note,
            Duration = sessionState.End != null ?(decimal) (sessionState.End - sessionState.Start).Value.TotalHours : 0};
    }
}
