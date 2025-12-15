import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminFlightsService } from '../../../core/services/admin-flights.service';

@Component({
    selector: 'app-admin-flights-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListFlightsComponent implements OnInit, OnDestroy {
    flights: any[] = [];
    loading = true;

    constructor(
        private adminFlightsService: AdminFlightsService,
        private router: Router
    ) { }

    ngOnInit() {
        console.log('[ListFlightsComponent] ngOnInit called');
        this.loadFlights();
    }

    ngOnDestroy() {
        console.log('[ListFlightsComponent] ngOnDestroy called');
    }

    loadFlights() {
        this.loading = true;
        console.log('[ListFlightsComponent] loadFlights called, loading =', this.loading);

        this.adminFlightsService.getFlights().subscribe({
            next: (data) => {
                console.log('[ListFlightsComponent] Flights loaded successfully:', data);
                this.flights = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('[ListFlightsComponent] Error loading flights:', err);
                this.loading = false;
                if (err.status === 401) {
                    // Fail silently and redirect to login
                    this.router.navigate(['/login']);
                } else {
                    // Only show alert for non-auth errors if absolutely necessary, or use a better UI
                    console.warn('Failed to load flights:', err);
                }
            }
        });
    }

    editFlight(id: number) {
        this.router.navigate(['/admin/flights/edit', id]);
    }

    showDeleteModal = false;
    flightToDelete: any = null;
    successMessage = '';
    errorMessage = '';

    confirmDelete(id: number, flightNumber: string) {
        this.flightToDelete = { id, flightNumber };
        this.showDeleteModal = true;
        this.successMessage = '';
        this.errorMessage = '';
    }

    cancelDelete() {
        this.showDeleteModal = false;
        this.flightToDelete = null;
    }

    deleteFlight() {
        if (!this.flightToDelete) return;

        this.adminFlightsService.deleteFlight(this.flightToDelete.id).subscribe({
            next: () => {
                this.successMessage = `Flight ${this.flightToDelete.flightNumber} deleted successfully.`;
                this.showDeleteModal = false;
                this.flightToDelete = null;
                this.loadFlights();

                // Clear success message after 3 seconds
                setTimeout(() => this.successMessage = '', 3000);
            },
            error: (err) => {
                console.error('[ListFlightsComponent] Error loading flights:', err);
                this.loading = false;
                if (err.status === 401) {
                    // Fail silently and redirect to login
                    this.router.navigate(['/login']);
                } else {
                    this.errorMessage = 'Failed to load flights: ' + (err.error?.message || err.message || 'Unknown error');
                }
            }
        });
    }

    createFlight() {
        this.router.navigate(['/admin/flights/create']);
    }

    formatDate(date: string): string {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    isPast(dateStr: string): boolean {
        return new Date(dateStr) < new Date();
    }
}
