// FlightsController.cs
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private readonly FlightReservationDbContext _context;

        public FlightsController(FlightReservationDbContext context)
        {
            _context = context;
        }

        // GET api/flights
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var flights = await _context.Flights
                .OrderBy(f => f.DepartureTime)
                .ToListAsync();

            return Ok(flights);
        }

        // GET api/flights/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var flight = await _context.Flights.FindAsync(id);

            if (flight == null)
                return NotFound();

            return Ok(flight);
        }

        // GET: api/flights/{flightId}/seats
        [HttpGet("{flightId}/seats")]
        public async Task<IActionResult> GetSeats(int flightId)
        {
            var seats = await _context.Seats
                .Where(s => s.FlightId == flightId)
                .OrderBy(s => s.SeatNumber)
                .ToListAsync();

            if (!seats.Any())
            {
                // Auto-generate seats if they don't exist
                var flight = await _context.Flights.FindAsync(flightId);
                if (flight == null)
                    return NotFound("Flight not found.");

                int rows = flight.TotalCapacity / 6;
                if (rows < 1) rows = 10; // Default fallback

                char[] letters = { 'A', 'B', 'C', 'D', 'E', 'F' };
                var newSeats = new List<Seat>();

                for (int r = 1; r <= rows; r++)
                {
                    foreach (var letter in letters)
                    {
                        newSeats.Add(new Seat
                        {
                            FlightId = flight.Id,
                            SeatNumber = $"{r}{letter}",
                            Class = r <= 3 ? "Business" : "Economy",
                            IsReserved = false
                        });
                    }
                }

                _context.Seats.AddRange(newSeats);
                await _context.SaveChangesAsync();
                
                return Ok(newSeats);
            }

            return Ok(seats);
        }

        // GET: api/flights/search
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string? origin, [FromQuery] string? destination, [FromQuery] string? date, [FromQuery] string[]? classes)
        {
            var query = _context.Flights.AsQueryable();

            // Origin filter (case-insensitive)
            if (!string.IsNullOrWhiteSpace(origin))
            {
                var originLower = origin.Trim().ToLowerInvariant(); 
                query = query.Where(f => f.Origin.ToLower().Contains(originLower));
                Console.WriteLine($"Filtering by Origin: {originLower}");
            }

            // Destination filter (case-insensitive)
            if (!string.IsNullOrWhiteSpace(destination))
            {
                var destLower = destination.Trim().ToLowerInvariant();
                query = query.Where(f => f.Destination.ToLower().Contains(destLower));
                Console.WriteLine($"Filtering by Destination: {destLower}");
            }

            // Date filter (string YYYY-MM-DD)
            // If date is empty/null, we simply skip this filter (returning all dates)
            if (!string.IsNullOrWhiteSpace(date) && DateTime.TryParse(date, out DateTime parsedDate))
            {
                // Filter for the whole day (00:00 to 23:59:59.999)
                var dayStart = parsedDate.Date;
                var dayEnd = dayStart.AddDays(1);

                query = query.Where(f => f.DepartureTime >= dayStart && f.DepartureTime < dayEnd);
            }

            var results = await query
                .OrderBy(f => f.DepartureTime)
                .ToListAsync();

            return Ok(results);
        }

        // GET: api/flights/locations
        [HttpGet("locations")]
        public async Task<IActionResult> GetLocations()
        {
            var origins = await _context.Flights
                .Select(f => f.Origin)
                .Distinct()
                .OrderBy(o => o)
                .ToListAsync();

            var destinations = await _context.Flights
                .Select(f => f.Destination)
                .Distinct()
                .OrderBy(d => d)
                .ToListAsync();

            return Ok(new { origins, destinations });
        }


    }
}
