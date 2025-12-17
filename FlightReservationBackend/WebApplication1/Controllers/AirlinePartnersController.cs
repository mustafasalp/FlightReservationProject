using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AirlinePartnersController : ControllerBase
    {
        private readonly FlightReservationDbContext _context;

        public AirlinePartnersController(FlightReservationDbContext context)
        {
            _context = context;
        }

        // GET: api/AirlinePartners
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AirlinePartner>>> GetAirlinePartners()
        {
            return await _context.AirlinePartners.ToListAsync();
        }

        // GET: api/AirlinePartners/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AirlinePartner>> GetAirlinePartner(int id)
        {
            var airlinePartner = await _context.AirlinePartners.FindAsync(id);

            if (airlinePartner == null)
            {
                return NotFound();
            }

            return airlinePartner;
        }

        // POST: api/AirlinePartners
        [HttpPost]
        public async Task<ActionResult<AirlinePartner>> PostAirlinePartner(AirlinePartner airlinePartner)
        {
            _context.AirlinePartners.Add(airlinePartner);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAirlinePartner", new { id = airlinePartner.Id }, airlinePartner);
        }

        // DELETE: api/AirlinePartners/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAirlinePartner(int id)
        {
            var airlinePartner = await _context.AirlinePartners.FindAsync(id);
            if (airlinePartner == null)
            {
                return NotFound();
            }

            _context.AirlinePartners.Remove(airlinePartner);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
