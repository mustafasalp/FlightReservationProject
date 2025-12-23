// flight.cs
namespace Backend.Models
{
    public class Flight
    {
        public int Id { get; set; }
        public string FlightNumber { get; set; } = string.Empty;
        public string Airline { get; set; } = string.Empty;
        public string LogoUrl { get; set; } = string.Empty;

        public string Origin { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty; // Duration might have calculated by DepartureTime - ArrivalTime

        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }

        public int TotalCapacity { get; set; }
        public decimal BasePrice { get; set; } // BasePrice = EconomyPrice
        public decimal BusinessPrice { get; set; }

        // Navigation properties
        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
        public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

        public string Status { get; set; } = "Scheduled";
    }
}