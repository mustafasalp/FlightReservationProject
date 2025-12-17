import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FlightsService } from '../../services/flights.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-seats',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.scss'],
})
export class Seats implements OnInit {

  flightId: number = 0;
  flight: any = null;
  allSeats: any[] = [];
  availableSeats: any[] = []; // Filtered by class

  groupedSeats: any[] = [];
  rows: number[] = [];

  // Columns for the grid
  seatColumns = ['A', 'B', 'C', 'D', 'E', 'F'];

  bookingForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private flightsService: FlightsService,
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.bookingForm = this.fb.group({
      seatClass: ['Economy', Validators.required],
      seatId: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      expiryDate: ['', [Validators.required, this.futureDateValidator]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]]
    });
  }

  futureDateValidator(control: any) {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    const now = new Date();
    // Reset inputs to start of month for comparison
    const inputMonth = new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return inputMonth < currentMonth ? { pastDate: true } : null;
  }

  ngOnInit(): void {
    this.flightId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadData();

    // Re-filter seats when class changes
    this.bookingForm.get('seatClass')?.valueChanges.subscribe(val => {
      this.filterSeats(val);
      this.bookingForm.patchValue({ seatId: '' });
    });
  }

  loadData() {
    console.log('=== LOAD DATA STARTED ===');
    this.loading = true;
    this.errorMessage = '';

    this.flightsService.getFlightById(this.flightId).subscribe({
      next: (flight) => {
        this.flight = flight;
        this.cdr.detectChanges();

        this.flightsService.getSeats(this.flightId).subscribe({
          next: (seats) => {
            this.allSeats = seats;
            this.processSeatsForMap();
            this.filterSeats('Economy');
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.warn('Using mock seats due to error:', err);
            this.allSeats = this.generateMockSeats();
            this.processSeatsForMap();
            this.filterSeats('Economy');
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Flight not found.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  processSeatsForMap() {
    // Group seats by Row Number for the visual map
    // Assuming SeatNumber is like "1A", "10C"
    const groups: { [key: number]: any[] } = {};

    this.allSeats.forEach(seat => {
      // Extract row number (remove non-digits)
      const rowNum = parseInt(seat.seatNumber.replace(/\D/g, ''));
      if (!groups[rowNum]) groups[rowNum] = [];
      groups[rowNum].push(seat);
    });

    this.rows = Object.keys(groups).map(Number).sort((a, b) => a - b);
    this.groupedSeats = groups as any;
  }

  getSeat(row: number, col: string) {
    // Find specific seat in the row
    return this.groupedSeats[row]?.find((s: any) => s.seatNumber.endsWith(col));
  }

  selectSeat(seat: any) {
    if (seat.isReserved) return;

    // Auto-switch class if needed
    if (seat.class !== this.bookingForm.get('seatClass')?.value) {
      this.bookingForm.patchValue({ seatClass: seat.class });
    }

    this.bookingForm.patchValue({ seatId: seat.id });
  }

  isSelected(seatId: number): boolean {
    return this.bookingForm.get('seatId')?.value === seatId;
  }

  generateMockSeats(): any[] {
    const mocks = [];
    let idCounter = 999;
    // Business: Rows 1-3
    for (let r = 1; r <= 3; r++) {
      for (let c of ['A', 'B', 'C', 'D', 'E', 'F']) {
        mocks.push({ id: ++idCounter, seatNumber: `${r}${c}`, class: 'Business', isReserved: false });
      }
    }
    // Economy: Rows 4-10
    for (let r = 4; r <= 10; r++) {
      for (let c of ['A', 'B', 'C', 'D', 'E', 'F']) {
        mocks.push({ id: ++idCounter, seatNumber: `${r}${c}`, class: 'Economy', isReserved: false });
      }
    }
    return mocks;
  }

  filterSeats(seatClass: string) {
    if (!this.allSeats) return;
    this.availableSeats = this.allSeats.filter(s =>
      s.class === seatClass && !s.isReserved
    );
  }

  getPrice(): number {
    // Dynamic price based on selected seat class (or dropdown fallback)
    const currentClass = this.bookingForm.get('seatClass')?.value;
    if (currentClass === 'Business') return this.flight?.businessPrice || 0;
    return this.flight?.basePrice || 0;
  }

  submitBooking() {
    if (this.bookingForm.invalid) return;

    const userId = this.auth.getUserId();
    if (!userId) {
      alert('You must be logged in to book a flight.');
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const payload = {
      flightId: this.flightId,
      seatId: Number(this.bookingForm.value.seatId),
      userId: Number(userId)
    };

    console.log('Booking Payload:', payload);

    this.flightsService.createReservation(payload).subscribe({
      next: (res) => {
        this.successMessage = 'Booking Confirmed! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/my-reservations']);
        }, 1500);
      },
      error: (err) => {
        console.error('Booking failed:', err);
        this.errorMessage = err.error?.message || 'Booking failed.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getAirportCode(city: any): string {
    if (!city) return '';
    return String(city).slice(0, 3).toUpperCase();
  }
}
