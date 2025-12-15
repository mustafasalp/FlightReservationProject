namespace Backend.Models
{
    public class Seat
    {
        public int Id { get; set; }

        public int FlightId { get; set; }
        public Flight Flight { get; set; }

        public string SeatNumber { get; set; } = string.Empty;   // örn: 1A, 10C
        public string Class { get; set; } = "Economy";           // Economy / Business
        public bool IsReserved { get; set; } = false;
        public string Status { get; set; } = "Available";

        public Reservation? Reservation { get; set; }
    }
}
