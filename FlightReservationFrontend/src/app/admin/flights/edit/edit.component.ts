import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminFlightsService } from '../../../core/services/admin-flights.service';

@Component({
  selector: 'app-edit-flight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditFlightComponent implements OnInit {
  form: FormGroup;
  loading = false;
  flightId!: number;

  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private adminFlightsService: AdminFlightsService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      flightNumber: ['', Validators.required],
      airline: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      departureTime: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      totalCapacity: [180, [Validators.required, Validators.min(1), Validators.max(500)]],
      basePrice: [1000, [Validators.required, Validators.min(0)]],
      businessPrice: [2000, [Validators.required, Validators.min(0)]],
      duration: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Check if ID exists
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage = 'No flight ID provided in URL.';
      return;
    }

    this.flightId = Number(idParam);
    if (isNaN(this.flightId)) {
      this.errorMessage = 'Invalid Flight ID.';
      return;
    }

    this.loadFlight();
  }

  loadFlight() {
    this.loading = true;
    this.errorMessage = '';
    console.log('Loading flight...', this.flightId);

    // Safety timeout
    const timeoutId = setTimeout(() => {
      if (this.loading) {
        console.warn('Load flight timed out');
        this.loading = false;
        this.errorMessage = 'Request timed out. Please check console/network.';
        this.cdr.detectChanges();
      }
    }, 5000);

    this.adminFlightsService.getFlightById(this.flightId).subscribe({
      next: (flight) => {
        clearTimeout(timeoutId);
        console.log('Flight loaded:', flight);
        try {
          // Convert datetime strings to the format required by datetime-local input
          const departureTime = this.formatDateTimeForInput(flight.departureTime);
          const arrivalTime = this.formatDateTimeForInput(flight.arrivalTime);

          this.form.patchValue({
            flightNumber: flight.flightNumber,
            airline: flight.airline,
            origin: flight.origin,
            destination: flight.destination,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            totalCapacity: flight.totalCapacity,
            basePrice: flight.basePrice,
            businessPrice: flight.businessPrice,
            duration: flight.duration
          });
        } catch (e: any) {
          console.error('Error processing flight data', e);
          this.errorMessage = 'Data processing error: ' + e.message;
        } finally {
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        clearTimeout(timeoutId);
        console.error('Error loading flight (subscription error)', err);
        this.loading = false;
        this.errorMessage = `Failed to load flight: ${err.statusText || err.message}`;
        if (err.status === 404) this.errorMessage = 'Flight not found.';
        if (err.status === 401) this.errorMessage = 'Unauthorized. Please login again.';
        if (err.status === 0) this.errorMessage = 'Connection refused. Check API URL/CORS.';
        this.cdr.detectChanges();
      }
    });
  }

  formatDateTimeForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  successMessage: string = '';

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminFlightsService.updateFlight(this.flightId, this.form.value).subscribe({
      next: () => {
        this.successMessage = 'Flight updated successfully! Redirecting...';
        this.cdr.detectChanges();

        // Wait 1.5 seconds then navigate back
        setTimeout(() => {
          this.router.navigate(['/admin/flights']);
        }, 1500);
      },
      error: (err) => {
        console.error('Update flight error', err);
        const msg = err.error?.title || err.message || 'Failed to update flight.';
        this.errorMessage = `Error: ${msg}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancel() {
    this.router.navigate(['/admin/flights']);
  }
}
