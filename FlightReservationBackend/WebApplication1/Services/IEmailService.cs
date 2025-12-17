using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}