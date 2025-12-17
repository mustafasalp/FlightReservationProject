using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class AirlinePartner
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string LogoUrl { get; set; }

        [Required]
        public string WebsiteUrl { get; set; }
    }
}
