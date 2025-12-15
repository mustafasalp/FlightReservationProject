import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-support',
    standalone: true,
    imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormsModule],
    template: `
    <div class="page-container glass-panel">
      <h1>Support Center</h1>
      <p class="subtitle">How can we help you today?</p>

      <div class="contact-grid">
        <div class="contact-card">
          <mat-icon class="icon">email</mat-icon>
          <h3>Email Us</h3>
          <p>support&#64;flightreserve.com</p>
          <p class="sub">We respond within 24 hours</p>
        </div>

        <div class="contact-card">
          <mat-icon class="icon">phone</mat-icon>
          <h3>Call Us</h3>
          <p>+1 (555) 123-4567</p>
          <p class="sub">Mon-Fri, 9am - 6pm EST</p>
        </div>

        <div class="contact-card">
          <mat-icon class="icon">chat</mat-icon>
          <h3>Live Chat</h3>
          <p>Available on dashboard</p>
          <p class="sub">For premium members</p>
        </div>
      </div>

      <section class="feedback-form">
        <h2>Send us a message</h2>
        <form (submit)="onSubmit()">
          <div class="form-row">
            <mat-form-field appearance="outline" class="half">
              <mat-label>Name</mat-label>
              <input matInput placeholder="John Doe">
            </mat-form-field>
            <mat-form-field appearance="outline" class="half">
              <mat-label>Email</mat-label>
              <input matInput placeholder="john&#64;example.com">
            </mat-form-field>
          </div>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Subject</mat-label>
            <input matInput placeholder="Booking Inquiry">
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Message</mat-label>
            <textarea matInput rows="5" placeholder="Tell us more about your issue..."></textarea>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit">
            <mat-icon>send</mat-icon>
            Send Message
          </button>
        </form>
      </section>
    </div>
  `,
    styles: [`
    .page-container {
      max-width: 900px;
      margin: 120px auto 40px;
      padding: 40px;
    }

    h1 {
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      text-align: center;
      font-size: 1.2rem;
      margin-bottom: 3rem;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .contact-card {
      text-align: center;
      padding: 2rem;
      background: rgba(255,255,255,0.5);
      border-radius: 12px;
      border: 1px solid var(--border);
      
      .icon {
        font-size: 48px;
        height: 48px;
        width: 48px;
        color: var(--primary);
        margin-bottom: 1rem;
      }
      
      h3 { margin-bottom: 0.5rem; }
      
      p { 
        margin-bottom: 0px; 
        font-weight: 500;
      }
      
      .sub {
        font-size: 0.9rem;
        color: var(--text-tertiary);
        font-weight: 400;
      }
    }

    .feedback-form {
      max-width: 600px;
      margin: 0 auto;
      
      h2 { margin-bottom: 1.5rem; }

      .form-row {
        display: flex;
        gap: 1rem;
        
        .half { flex: 1; }
      }

      .full-width { width: 100%; }

      button {
        width: 100%;
        padding: 1.5rem;
        font-size: 1.1rem;
      }
    }
  `]
})
export class SupportComponent {
    onSubmit() {
        alert('Message sent! (Simulation)');
    }
}
