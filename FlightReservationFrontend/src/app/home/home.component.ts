import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AuthService } from '../services/auth.service';
import { FlightsService } from '../services/flights.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  searchModel = {
    from: null as string | null,
    to: null as string | null,
    date: null as Date | null,
  };

  origins: string[] = [];
  destinations: string[] = [];


  logoutMessage = '';
  flights: any[] = [];
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthService,
    private flightsService: FlightsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['logout'] === 'true') {
        this.logoutMessage = 'Logged out successfully.';
        setTimeout(() => (this.logoutMessage = ''), 3000);
      }
    });

    // Load flights initially
    this.loadAllFlights();
    this.loadLocations();
    this.loadPartners();
  }

  loadLocations() {
    this.flightsService.getLocations().subscribe({
      next: (res) => {
        this.origins = res.origins;
        this.destinations = res.destinations;
      },
      error: (err) => console.error('Error loading locations', err)
    });
  }

  loadAllFlights() {
    this.loading = true;
    console.log('Loading all flights...');
    this.flightsService.getAllFlights().subscribe({
      next: (res: any) => {
        console.log('Flights loaded:', res);
        this.flights = res;
        this.loading = false;
        this.cdr.detectChanges(); // Force update
      },
      error: (err: any) => {
        console.error('Error loading flights:', err);
        this.loading = false;
        this.cdr.detectChanges(); // Force update even on error
      }
    });
  }

  // SEARCH
  onSearch() {
    this.loading = true;

    // Fix date to local YYYY-MM-DD string
    let dateStr = null;
    if (this.searchModel.date) {
      const d = new Date(this.searchModel.date);
      // Use local time components to avoid timezone shift
      dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    const params = {
      origin: this.searchModel.from ? this.searchModel.from.trim() : null,
      destination: this.searchModel.to ? this.searchModel.to.trim() : null,
      date: dateStr
    };

    console.log('Search Params:', params);

    this.flightsService.searchFlights(params).subscribe({
      next: (res: any) => {
        console.log('Search results:', res);
        this.flights = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.flights = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onBook(flightId: number) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/flights', flightId, 'book']);
  }

  getAirportCode(city: any): string {
    if (!city || typeof city !== 'string') return 'AAA';
    return city.substring(0, 3).toUpperCase();
  }

  // NAVIGATION SHORTCUTS
  goToLogin() { this.router.navigate(['/login']); }
  goToRegister() { this.router.navigate(['/register']); }
  goToMyReservations() { this.router.navigate(['/my-reservations']); }
  goToAdmin() { this.router.navigate(['/admin/flights/create']); }

  loadPartners() {
    this.flightsService.getPartners().subscribe({
      next: (res) => {
        this.airlines = res;
      },
      error: (err) => console.error('Error loading partners', err)
    });
  }

  airlines: any[] = [];

  isPast(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }
}