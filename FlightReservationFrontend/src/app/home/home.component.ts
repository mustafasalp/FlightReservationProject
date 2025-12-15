import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    private flightsService: FlightsService
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
    this.flightsService.getAllFlights().subscribe({
      next: (res: any) => {
        this.flights = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
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
        this.flights = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.flights = [];
        this.loading = false;
      }
    });
  }

  onBook(id: number) {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/flights', id, 'book']);
    } else {
      // Create url tree to navigate to login
      this.router.navigate(['/login']);
    }
  }

  // NAVIGATION SHORTCUTS
  goToLogin() { this.router.navigate(['/login']); }
  goToRegister() { this.router.navigate(['/register']); }
  goToMyReservations() { this.router.navigate(['/my-reservations']); }
  goToAdmin() { this.router.navigate(['/admin/flights/create']); }

  airlines = [
    { name: 'Turkish Airlines', logo: '/assets/turkishairlines.jpeg', url: 'https://www.turkishairlines.com' },
    { name: 'Pegasus Airlines', logo: '/assets/pegasusairlines.jpeg', url: 'https://www.flypgs.com' },
    { name: 'SunExpress', logo: '/assets/sunexpressairlines.jpeg', url: 'https://www.sunexpress.com' },
    { name: 'Emirates', logo: '/assets/emiratesairlines.jpeg', url: 'https://www.emirates.com' },
    { name: 'Qatar Airways', logo: '/assets/qatarairlines.jpeg', url: 'https://www.qatarairways.com' },
    { name: 'British Airways', logo: '/assets/britishairlines.jpeg', url: 'https://www.britishairways.com' },
    { name: 'Air France Airways', logo: '/assets/airfranceairlines.jpeg', url: 'https://wwws.airfrance.com.tr' },
    { name: 'American Airlines', logo: '/assets/americanairlines.jpeg', url: 'https://www.aa.com' },
    { name: 'Lufhansa Airlines', logo: '/assets/lufthansaairlines.jpeg', url: 'https://www.lufthansa.com' },
    { name: 'Easy Jet Airlines', logo: '/assets/easyjetairlines.jpeg', url: 'https://www.easyjet.com' },
    { name: 'Coreddon Airlines', logo: '/assets/coreddonairlines.jpeg', url: 'https://www.corendonairlines.com/' },
    { name: 'Freebird Airlines', logo: '/assets/freebirdairlines.jpeg', url: 'https://www.freebirdairlines.com/' },
    { name: 'Saudi Arabian Airlines', logo: '/assets/suudiarabianairlines.jpeg', url: 'https://www.saudia.com' },
    { name: 'Ural Airlines', logo: '/assets/uralairlines.jpeg', url: 'https://www.uralairlines.com' },
    { name: 'AnadoluJet Airlines', logo: '/assets/anadolujetairlines.jpeg', url: 'https://ajet.com/tr' },
  ];

  isPast(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }
}