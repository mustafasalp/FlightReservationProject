import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="policy-container">
      <div class="policy-content">
        <h1>Terms of Service</h1>
        <p class="last-updated">Last updated: December 5, 2025</p>

        <section>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and using the FlightReserve website and mobile application, you accept and agree to be bound by
            and comply with these Terms of Service. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on FlightReserve
            for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and
            under this license you may not:
          </p>
          <ul>
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software contained on the website</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
            <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
          </ul>
        </section>

        <section>
          <h2>3. Disclaimer</h2>
          <p>
            The materials on FlightReserve's website and mobile application are provided on an 'as is' basis. FlightReserve
            makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without
            limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement
            of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2>4. Limitations</h2>
          <p>
            In no event shall FlightReserve or its suppliers be liable for any damages (including, without limitation, damages
            for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials
            on FlightReserve's website or mobile application.
          </p>
        </section>

        <section>
          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on FlightReserve's website and mobile application could include technical, typographical, or
            photographic errors. FlightReserve does not warrant that any of the materials on its website or mobile application
            are accurate, complete, or current.
          </p>
        </section>

        <section>
          <h2>6. Modifications</h2>
          <p>
            FlightReserve may revise these terms of service for its website and mobile application at any time without notice.
            By using this website and mobile application, you are agreeing to be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2>7. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of Turkey, and you irrevocably
            submit to the exclusive jurisdiction of the courts in that location.
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
export class TermsOfServiceComponent { }
