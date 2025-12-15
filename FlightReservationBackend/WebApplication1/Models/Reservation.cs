namespace Backend.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public string ReservationCode { get; set; } = string.Empty;

        public int FlightId { get; set; }
        public Flight Flight { get; set; }

        public int SeatId { get; set; }
        public Seat Seat { get; set; }

        public int UserId { get; set; }
        public ApplicationUser User { get; set; }

        public decimal TotalPrice { get; set; }
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;
    }
}
