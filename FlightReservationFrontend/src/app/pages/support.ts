import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="support-container">
      <div class="support-content">
        <h1>Support Center</h1>
        <p class="subtitle">We're here to help! Find answers and assistance below.</p>

        <section>
          <h2>📞 Contact Information</h2>
          <div class="contact-info">
            <div class="contact-item">
              <strong>Email:</strong>
              <p>
                <a href="mailto:support@flightreserve.com">flightreservationsup@gmail.com</a><br>
                <span style="font-size: 0.85rem; color: #64748b; font-weight: normal; display: block; margin-top: 4px;">
                  Feel free to mail us for any questions or concerns.
                </span>
              </p>
            </div>
            <div class="contact-item">
              <strong>Phone:</strong>
              <p><a href="tel:+90212123456">+90 212 123 4567</a></p>
            </div>
            <div class="contact-item">
              <strong>Live Chat:</strong>
              <p>Available 24/7 on our website</p>
            </div>
          </div>
        </section>

        <section>
          <h2>❓ Frequently Asked Questions</h2>
          <div class="faq">
            <div class="faq-item">
              <h3>How do I book a flight?</h3>
              <p>
                To book a flight, navigate to the "Search Flights" section, enter your travel dates and destination,
                select a flight from the results, and complete the booking process with your payment information.
              </p>
            </div>
            <div class="faq-item">
              <h3>Can I modify my reservation?</h3>
              <p>
                Yes, you can modify your reservation by logging into your account and accessing "My Reservations".
                Depending on the airline's policy, you may be able to change dates or passenger information.
              </p>
            </div>
            <div class="faq-item">
              <h3>What payment methods do you accept?</h3>
              <p>
                We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and various
                digital payment methods.
              </p>
            </div>
            <div class="faq-item">
              <h3>How do I cancel my reservation?</h3>
              <p>
                You can cancel your reservation from "My Reservations" within your account, in 3 days before the flight date. Refund eligibility depends
                on the airline's cancellation policy.
              </p>
            </div>
            <div class="faq-item">
              <h3>Is my payment information secure?</h3>
              <p>
                Yes, we use industry-standard SSL encryption to protect your payment information. All transactions are
                processed securely through trusted payment gateways.
              </p>
            </div>
            <div class="faq-item">
              <h3>What if I forgot my password?</h3>
              <p>
                Click on "Forgot Password" on the login page and follow the instructions sent to your email address to
                reset your password.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>🕐 Business Hours</h2>
          <div class="business-hours">
            <p><strong>Monday - Friday:</strong> 09:00 - 18:00 (Turkey Time)</p>
            <p><strong>Saturday:</strong> 10:00 - 16:00 (Turkey Time)</p>
            <p><strong>Sunday:</strong> Closed</p>
            <p class="note"><em>Live chat support is available 24/7</em></p>
          </div>
        </section>

        <section>
          <h2>🐛 Report a Problem</h2>
          <p>
            If you encounter any issues with our website or mobile application, please email us at
            <a href="mailto:bugs@flightreserve.com">flightreservationsup@gmail.com</a> with details about the problem.
          </p>
        </section>

        <div class="back-link">
          <a routerLink="/">← Back to Home</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .support-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 120px 20px 40px;
      min-height: 100vh;
      background: #f9fafb;
    }

    .support-content {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #1f2937;
      font-size: 2.5rem;
      margin-bottom: 10px;
      text-align: center;
    }

    .subtitle {
      text-align: center;
      color: #6b7280;
      font-size: 1.1rem;
      margin-bottom: 30px;
    }

    section {
      margin-bottom: 40px;
    }

    h2 {
      color: #0066cc;
      font-size: 1.5rem;
      margin-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }

    h3 {
      color: #1f2937;
      font-size: 1.1rem;
      margin-top: 15px;
      margin-bottom: 10px;
    }

    p {
      color: #374151;
      line-height: 1.8;
      margin-bottom: 15px;
    }

    a {
      color: #0066cc;
      text-decoration: none;
      font-weight: 600;
      transition: 0.3s;
    }

    a:hover {
      color: #0052a3;
      text-decoration: underline;
    }

    .contact-info {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .contact-item {
      margin-bottom: 15px;
    }

    .contact-item strong {
      color: #1f2937;
      display: block;
      margin-bottom: 5px;
    }

    .faq {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #0066cc;
    }

    .faq-item {
      padding: 15px 0;
      border-bottom: 1px solid #e5e7eb;
    }

    .faq-item:last-child {
      border-bottom: none;
    }

    .business-hours {
      background: #dbeafe;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #0066cc;
    }

    .business-hours p {
      margin-bottom: 10px;
    }

    .note {
      font-style: italic;
      color: #0066cc;
      margin-top: 15px !important;
    }

    .back-link {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
    }
  `]
})
export class SupportComponent { }
