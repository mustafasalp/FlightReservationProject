namespace Backend.Models
{
    public class Seat
    {
        public int Id { get; set; }

        public int FlightId { get; set; } // Hangi Uçuşa ait olduğu.
        public Flight Flight { get; set; } // Uçuşu direkt.

        public string SeatNumber { get; set; } = string.Empty;   // örn: 1A, 10C
        public string Class { get; set; } = "Economy";           // Economy / Business
        public bool IsReserved { get; set; } = false; // Default olarak false.
        public string Status { get; set; } = "Available"; // Default olarak available.

        public Reservation? Reservation { get; set; } // Nullable, reservation(rezerve olmuş olabilir de olmayabilir de)
    }
}
