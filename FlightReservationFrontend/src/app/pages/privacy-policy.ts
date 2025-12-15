import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="policy-container">
      <div class="policy-content">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last updated: December 5, 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            FlightReserve ("we," "us," "our," or "Company") operates the Flight Reservation website and mobile application.
            This Privacy Policy explains how we collect, use, disclose, and otherwise handle your information when you use
            our services.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways, including:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number, and mailing address</li>
            <li><strong>Payment Information:</strong> Credit card details and billing information</li>
            <li><strong>Travel Information:</strong> Flight preferences and booking history</li>
            <li><strong>Device Information:</strong> IP address, browser type, and usage data</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process flight reservations and bookings</li>
            <li>Send booking confirmations and flight updates</li>
            <li>Provide customer support</li>
            <li>Improve our services and website functionality</li>
            <li>Comply with legal requirements</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet
            is 100% secure.
          </p>
        </section>

        <section>
          <h2>5. Third-Party Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties without your consent, except as required
            by law or to service providers who assist us in operating our website and conducting our business.
          </p>
        </section>

        <section>
          <h2>6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at support@flightreserve.com
          </p>
        </section>

        <div class="back-link">
          <a routerLink="/">← Back to Home</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .policy-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 120px 20px 40px;
      min-height: 100vh;
      background: #f9fafb;
    }

    .policy-content {
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

    .last-updated {
      text-align: center;
      color: #6b7280;
      font-size: 0.95rem;
      margin-bottom: 30px;
    }

    section {
      margin-bottom: 30px;
    }

    h2 {
      color: #0066cc;
      font-size: 1.5rem;
      margin-bottom: 15px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }

    p {
      color: #374151;
      line-height: 1.8;
      margin-bottom: 15px;
    }

    ul {
      color: #374151;
      margin-left: 20px;
      line-height: 1.8;
    }

    li {
      margin-bottom: 10px;
    }

    .back-link {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
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
  `]
})
export class PrivacyPolicyComponent { }
