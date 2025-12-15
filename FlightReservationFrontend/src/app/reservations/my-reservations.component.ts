import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsService } from '../services/flights.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.scss'],
})
export class MyReservationsComponent implements OnInit {
  allReservations: any[] = [];
  currentReservations: any[] = [];
  pastReservations: any[] = [];

  activeTab: 'current' | 'past' = 'current';

  loading = true;
  error = '';

  constructor(private flightsService: FlightsService) { }

  airlines = [
    { name: 'Turkish Airlines', logo: '/assets/turkishairlines.jpeg' },
    { name: 'Pegasus Airlines', logo: '/assets/pegasus.jpeg' },
    { name: 'SunExpress', logo: '/assets/sunexpress.jpeg' },
    { name: 'Emirates', logo: '/assets/emirates.jpeg' },
    { name: 'Qatar Airways', logo: '/assets/qatarairlines.jpeg' },
    { name: 'British Airways', logo: '/assets/britishairlines.jpeg' },
    { name: 'Air France Airways', logo: '/assets/airfrance.jpeg' },
    { name: 'American Airlines', logo: '/assets/american.jpeg' },
    { name: 'Lufhansa Airlines', logo: '/assets/lufhansa.jpeg' },
    { name: 'Easy Jet Airlines', logo: '/assets/easyjet.jpeg' },
    { name: 'Coreddon Airlines', logo: '/assets/coreddon.jpeg' },
    { name: 'Freebird Airlines', logo: '/assets/freebird.jpeg' },
  ];

  getAirlineLogo(name: string): string {
    const airline = this.airlines.find(a => a.name === name);
    return airline ? airline.logo : '';
  }

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    this.flightsService.getMyReservations().subscribe({
      next: (data) => {
        this.allReservations = data;
        this.processReservations();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load reservations', err);
        this.error = 'Failed to load your reservations. Please try again.';
        this.loading = false;
      }
    });
  }

  processReservations() {
    const now = new Date();
    this.currentReservations = [];
    this.pastReservations = [];

    this.allReservations.forEach(res => {
      const flightDate = new Date(res.flight?.departureTime);
      if (flightDate < now) {
        this.pastReservations.push(res);
      } else {
        this.currentReservations.push(res);
      }
    });

    // Sort current: nearest first
    this.currentReservations.sort((a, b) => new Date(a.flight?.departureTime).getTime() - new Date(b.flight?.departureTime).getTime());

    // Sort past: most recent first
    this.pastReservations.sort((a, b) => new Date(b.flight?.departureTime).getTime() - new Date(a.flight?.departureTime).getTime());
  }

  switchTab(tab: 'current' | 'past') {
    this.activeTab = tab;
  }

  get displayedReservations() {
    return this.activeTab === 'current' ? this.currentReservations : this.pastReservations;
  }

  canCancel(dateStr: string | undefined): boolean {
    if (!dateStr) return false;
    const flightDate = new Date(dateStr);
    const now = new Date();
    // Fark hesapla (Calculate difference in milliseconds)
    const diffTime = flightDate.getTime() - now.getTime();
    // Gun cevir (Convert to days)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 3;
  }

  cancelReservation(id: number) {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    this.flightsService.cancelReservation(id).subscribe({
      next: () => {
        // Listeden cikar (Remove from list)
        this.allReservations = this.allReservations.filter(r => r.id !== id);
        this.processReservations();
        alert('Reservation cancelled successfully.');
      },
      error: (err) => {
        console.error('Cancellation Error:', err);
        let msg = 'Failed to cancel reservation.';

        if (err.status === 404) {
          msg = 'Cancellation endpoint not found (Backend might need restart) or Reservation missing.';
        } else if (err.status === 400) {
          // Backend sends plain text or JSON object
          msg = err.error?.message || err.error || msg;
        } else if (err.status === 401) {
          msg = 'Unauthorized. Please log in again.';
        }

        alert(`Error (${err.status}): ${msg}`);
      }
    });
  }
}
