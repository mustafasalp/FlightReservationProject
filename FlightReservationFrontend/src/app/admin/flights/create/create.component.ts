// create.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminFlightsService } from '../../../core/services/admin-flights.service';

@Component({
  selector: 'app-admin-create-flight',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateFlightComponent {

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private adminFlightsService: AdminFlightsService,
    private router: Router
  ) {
    this.form = this.fb.group({
      flightNumber: ['', Validators.required],
      airline: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      duration: ['', Validators.required],
      departureTime: ['', [Validators.required, this.futureDateValidator]],
      arrivalTime: ['', Validators.required],
      totalCapacity: [180, [Validators.required, Validators.min(1), Validators.max(500)]],
      basePrice: [1000, [Validators.required, Validators.min(0)]],
      businessPrice: [2000, [Validators.required, Validators.min(0)]]
    });
  }

  futureDateValidator(control: any) {
    if (!control.value) return null;
    const date = new Date(control.value);
    const now = new Date();
    if (date < now) {
      return { pastDate: true };
    }
    return null;
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.adminFlightsService.createFlight(this.form.value).subscribe({
      next: () => {
        alert('Flight created successfully!');
        this.router.navigate(['/admin/flights']);
      },
      error: (err) => {
        console.error('Create flight error', err);
        // Show a more descriptive error if available
        const msg = err.error?.title || err.message || 'Failed to create flight.';
        alert(`Error: ${msg}`);
        this.loading = false;
      }
    });
  }
}