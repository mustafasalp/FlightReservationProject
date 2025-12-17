// create.component.ts
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminFlightsService } from '../../../core/services/admin-flights.service';
import { FlightsService } from '../../../services/flights.service';

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
    private flightsService: FlightsService,
    private router: Router,
    private cdr: ChangeDetectorRef
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

  partners: any[] = [];

  ngOnInit() {
    console.log('Loading partners for dropdown...');
    this.flightsService.getPartners().subscribe({
      next: (res) => {
        console.log('Partners loaded for dropdown:', res);
        this.partners = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load partners', err);
        this.cdr.detectChanges();
      }
    });
  }

  onAirlineChange(event: any) {
    const selectedName = event.target.value;
    const partner = this.partners.find(p => p.name === selectedName);

    // Automatically set logoUrl to flight table (via backend logic or we add it to form if needed)
    // The current form structure relies on backend to handle LogoUrl or we send it?
    // Wait, the create command sends the form value.
    // The Flight model has LogoUrl. The form currently DOES NOT have logoUrl control?
    // Let's check the FormBuilder group again.
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    // We need to ensure we send the LogoUrl. 
    // If the form doesn't have it, we might need to append it.
    const flightData = { ...this.form.value };

    // Find the selected partner to get the logo
    const selectedPartner = this.partners.find(p => p.name === flightData.airline);
    if (selectedPartner) {
      flightData.logoUrl = selectedPartner.logoUrl;
    }

    this.adminFlightsService.createFlight(flightData).subscribe({
      next: () => {
        alert('Flight created successfully!');
        // Small delay to ensure any potential backend race conditions or UI updates settle
        setTimeout(() => {
          this.router.navigate(['/admin/flights']);
        }, 100);
      },
      error: (err) => {
        console.error('Create flight error', err);
        const msg = err.error?.title || err.message || 'Failed to create flight.';
        alert(`Error: ${msg}`);
        this.loading = false;
      }
    });
  }
}