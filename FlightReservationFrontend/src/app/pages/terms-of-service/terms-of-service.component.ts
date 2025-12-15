import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-terms-of-service',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="page-container glass-panel">
      <h1>Terms of Service</h1>
      <p class="last-updated">Last Updated: December 7, 2025</p>

      <section>
        <h2>1. Agreement to Terms</h2>
        <p>By accessing our website at FlightReserve, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
      </section>

      <section>
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on FlightReserve's website for personal, non-commercial transitory viewing only.</p>
      </section>

      <section>
        <h2>3. Disclaimer</h2>
        <p>The materials on FlightReserve's website are provided on an 'as is' basis. FlightReserve makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
      </section>

      <section>
        <h2>4. Limitations</h2>
        <p>In no event shall FlightReserve or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FlightReserve's website.</p>
      </section>
    </div>
  `,
    styles: [`
    .page-container {
      max-width: 800px;
      margin: 120px auto 40px; /* Top margin to clear fixed navbar */
      padding: 40px;
    }
    
    h1 {
      color: var(--primary);
      margin-bottom: 2rem;
    }

    h2 {
      font-size: 1.5rem;
      color: var(--text-primary);
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    p {
      line-height: 1.8;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .last-updated {
      font-style: italic;
      color: var(--text-tertiary);
      border-bottom: 1px solid var(--border);
      padding-bottom: 1rem;
    }
  `]
})
export class TermsOfServiceComponent { }
