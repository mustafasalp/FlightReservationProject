using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminFlightsController : ControllerBase
    {
        private readonly FlightReservationDbContext _context;

        public AdminFlightsController(FlightReservationDbContext context)
        {
            _context = context;
        }

        // GET: api/AdminFlights
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Flight>>> GetAll()
        {
            var flights = await _context.Flights
                .OrderBy(f => f.DepartureTime)
                .ToListAsync();

            return Ok(flights);
        }

        // GET: api/AdminFlights/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Flight>> GetById(int id)
        {
            var flight = await _context.Flights.FindAsync(id);

            if (flight == null)
                return NotFound();

            return Ok(flight);
        }

        // POST: api/AdminFlights
        [HttpPost]
        public async Task<ActionResult<Flight>> Create([FromBody] FlightDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Airline adından otomatik logo yolu üret
                var logoFileName = dto.Airline.Replace(" ", "").ToLower() + ".jpeg";

                var flight = new Flight
                {
                    FlightNumber = dto.FlightNumber,
                    Airline = dto.Airline,
                    LogoUrl = $"/assets/{logoFileName}",
                    Origin = dto.Origin,
                    Destination = dto.Destination,
                    DepartureTime = dto.DepartureTime,
                    ArrivalTime = dto.ArrivalTime,
                    BasePrice = dto.BasePrice,
                    BusinessPrice = dto.BusinessPrice,
                    TotalCapacity = dto.TotalCapacity,
                    Duration = dto.Duration
                };

                _context.Flights.Add(flight);
                await _context.SaveChangesAsync();

                // Koltuk üretimi
                var seats = new List<Seat>();
                int rows = dto.TotalCapacity / 6;   // her sırada 6 koltuk A–F
                char[] letters = { 'A', 'B', 'C', 'D', 'E', 'F' };

                for (int r = 1; r <= rows; r++)
                {
                    foreach (var letter in letters)
                    {
                        seats.Add(new Seat
                        {
                            FlightId = flight.Id,
                            SeatNumber = $"{r}{letter}",               // örn: 12C
                            Class = r <= 3 ? "Business" : "Economy",   // ilk 3 sıra business
                            IsReserved = false
                        });
                    }
                }

                _context.Seats.AddRange(seats);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = flight.Id }, flight);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { title = "Internal Server Error", message = ex.Message, details = ex.InnerException?.Message ?? ex.ToString() });
            }
        }

        // PUT: api/AdminFlights/5
        [HttpPut("{id:int}")]
        public async Task<ActionResult<Flight>> Update(int id, [FromBody] FlightDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var flight = await _context.Flights.FindAsync(id);
                if (flight == null)
                    return NotFound(new { message = "Flight not found" });

                // Update flight properties
                flight.FlightNumber = dto.FlightNumber;
                flight.Airline = dto.Airline;
                flight.LogoUrl = $"/assets/{dto.Airline.Replace(" ", "").ToLower()}.jpeg";
                flight.Origin = dto.Origin;
                flight.Destination = dto.Destination;
                flight.DepartureTime = dto.DepartureTime;
                flight.ArrivalTime = dto.ArrivalTime;
                flight.BasePrice = dto.BasePrice;
                flight.BusinessPrice = dto.BusinessPrice;
                flight.TotalCapacity = dto.TotalCapacity;
                flight.Duration = dto.Duration;

                await _context.SaveChangesAsync();

                return Ok(flight);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { title = "Internal Server Error", message = ex.Message, details = ex.InnerException?.Message ?? ex.ToString() });
            }
        }

        // DELETE: api/AdminFlights/5
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var flight = await _context.Flights
                    .Include(f => f.Seats)
                    .Include(f => f.Reservations)
                    .FirstOrDefaultAsync(f => f.Id == id);

                if (flight == null)
                    return NotFound(new { message = "Flight not found" });

                // Check if there are any reservations
                if (flight.Reservations.Any())
                {
                    return BadRequest(new { message = "Cannot delete flight with existing reservations" });
                }

                // Delete associated seats
                _context.Seats.RemoveRange(flight.Seats);
                
                // Delete the flight
                _context.Flights.Remove(flight);
                
                await _context.SaveChangesAsync();

                return Ok(new { message = "Flight deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { title = "Internal Server Error", message = ex.Message, details = ex.InnerException?.Message ?? ex.ToString() });
            }
        }
    }
}
