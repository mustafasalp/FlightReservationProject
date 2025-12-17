using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class FlightReservationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
    {
        public FlightReservationDbContext(DbContextOptions<FlightReservationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Flight> Flights { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<AirlinePartner> AirlinePartners { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Each Seat must have unique SeatNumber per Flight
            builder.Entity<Seat>()
                .HasIndex(s => new { s.FlightId, s.SeatNumber })
                .IsUnique();
        }
    }
}