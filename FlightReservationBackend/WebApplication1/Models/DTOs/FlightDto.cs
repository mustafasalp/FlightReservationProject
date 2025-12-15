using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    public class FlightDto
    {
        [Required]
        [MaxLength(10)]
        public string FlightNumber { get; set; } = string.Empty;

        [Required]
        public string Airline { get; set; } = string.Empty;

        [Required]
        public string Origin { get; set; } = string.Empty;

        [Required]
        public string Destination { get; set; } = string.Empty;

        [Required]
        public DateTime DepartureTime { get; set; }

        [Required]
        public DateTime ArrivalTime { get; set; }

        [Required]
        public decimal BasePrice { get; set; }
        public decimal BusinessPrice { get; set; }

        [Required]
        [Range(1, 500)]
        public int TotalCapacity { get; set; }

        public string Duration { get; set; } = string.Empty;
    }
}
