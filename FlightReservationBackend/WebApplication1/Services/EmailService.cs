using Microsoft.Extensions.Configuration;
using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;

namespace Backend.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            var senderEmail = emailSettings["SenderEmail"];
            var senderPassword = emailSettings["SenderPassword"];
            var smtpHost = emailSettings["SmtpHost"];
            var smtpPort = 587; // Try 587 with STARTTLS

            Console.WriteLine($"[EmailService] Preparing to send email to {to}...");

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(senderEmail));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;
            var builder = new BodyBuilder();
            builder.HtmlBody = body;
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            try 
            {
                Console.WriteLine($"[EmailService] Connecting to {smtpHost}:{smtpPort}...");
                await smtp.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
                
                Console.WriteLine("[EmailService] Authenticating...");
                await smtp.AuthenticateAsync(senderEmail, senderPassword);
                
                Console.WriteLine("[EmailService] Sending...");
                await smtp.SendAsync(email);
                
                Console.WriteLine("[EmailService] Disconnecting...");
                await smtp.DisconnectAsync(true);
                
                Console.WriteLine("[EmailService] Email sent successfully.");
            }
            catch (Exception ex)
            {
                 Console.WriteLine($"[EmailService] ERROR: {ex.Message}");
                 throw;
            }
        }
    }
}