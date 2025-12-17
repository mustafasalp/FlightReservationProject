using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly FlightReservationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;

        public ReservationsController(FlightReservationDbContext context, UserManager<ApplicationUser> userManager, IEmailService emailService)
        {
            _context = context;
            _userManager = userManager;
            _emailService = emailService;
        }

        // POST api/reservations
        [HttpPost]
        public async Task<IActionResult> BookSeat([FromBody] Backend.Models.DTOs.BookReservationDto request)
        {
            if (request == null)
                return BadRequest("Invalid booking request.");

            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var seat = await _context.Seats
                .Include(s => s.Flight)
                .FirstOrDefaultAsync(s => s.Id == request.SeatId && s.FlightId == request.FlightId);

            if (seat == null)
                return BadRequest("Seat not found.");

            if (seat.IsReserved)
                return BadRequest("Seat already reserved.");

            // Fiyat hesaplama
            decimal price = seat.Class == "Business"
                ? seat.Flight.BusinessPrice
                : seat.Flight.BasePrice;

            // Rezervasyon kodu üretimi
            string reservationCode = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();

            var reservation = new Reservation
            {
                FlightId = request.FlightId,
                SeatId = request.SeatId,
                UserId = userId,
                TotalPrice = price,
                ReservationCode = reservationCode
            };

            seat.IsReserved = true;

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            // Send Email Confirmation
            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    string subject = "Flight Reservation Confirmed!";
                    string body = $@"
                        <h1>Reservation Confirmed</h1>
                        <p>Dear {user.FirstName},</p>
                        <p>Your flight has been successfully booked.</p>
                        <ul>
                            <li><strong>Flight:</strong> {seat.Flight.Origin} -> {seat.Flight.Destination}</li>
                            <li><strong>Date:</strong> {seat.Flight.DepartureTime}</li>
                            <li><strong>Seat:</strong> {seat.SeatNumber} ({seat.Class})</li>
                            <li><strong>Price:</strong> ${price}</li>
                            <li><strong>Reservation Code:</strong> {reservationCode}</li>
                        </ul>
                        <p>Thank you for flying with us!</p>";

                    await _emailService.SendEmailAsync(user.Email, subject, body);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                // We proceed even if email fails
            }

            return Ok(new
            {
                message = "Reservation completed!",
                reservationCode,
                seat = seat.SeatNumber,
                price
            });
        }

        // GET api/reservations/my
        [HttpGet("my")]
        public async Task<IActionResult> MyReservations()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var list = await _context.Reservations
                .Where(r => r.UserId == userId)
                .Include(r => r.Flight)
                .Include(r => r.Seat)
                .ToListAsync();

            return Ok(list);
        }
        // DELETE api/reservations/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelReservation(int id)
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var reservation = await _context.Reservations
                .Include(r => r.Flight)
                .Include(r => r.Seat)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
                return NotFound("Reservation not found.");

            if (reservation.UserId != userId)
                return Unauthorized("You are not authorized to cancel this reservation.");

            // 3 Gun Kurali (3 Day Rule)
            var timeUntilFlight = reservation.Flight.DepartureTime - DateTime.Now;
            if (timeUntilFlight.TotalDays <= 3)
            {
                return BadRequest("Reservations cannot be cancelled within 3 days of the flight.");
            }

            // Koltugu bosa cikar (Release the seat)
            if (reservation.Seat != null)
            {
                reservation.Seat.IsReserved = false;
            }

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Reservation cancelled successfully." });
        }
    }
}
