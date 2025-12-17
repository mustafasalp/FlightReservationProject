import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightsService } from '../../services/flights.service';

@Component({
    selector: 'app-admin-partners',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './partners.component.html',
    styleUrls: ['./partners.component.scss']
})
export class AdminPartnersComponent implements OnInit {
    partners: any[] = [];
    model: any = {
        name: '',
        logoUrl: '',
        websiteUrl: ''
    };
    isLoading = false;

    constructor(
        private flightsService: FlightsService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadPartners();
    }

    loadPartners() {
        console.log('Loading partners...');
        this.flightsService.getPartners().subscribe({
            next: (res) => {
                console.log('Partners loaded:', res);
                this.partners = res;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error loading partners', err);
                this.cdr.detectChanges();
            }
        });
    }

    addPartner() {
        if (!this.model.name || !this.model.logoUrl) return;

        this.isLoading = true;
        this.flightsService.addPartner(this.model).subscribe({
            next: (res) => {
                this.partners.push(res);
                this.model = { name: '', logoUrl: '', websiteUrl: '' }; // Reset form
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    deletePartner(id: number) {
        if (!confirm('Are you sure you want to delete this partner?')) return;

        this.flightsService.deletePartner(id).subscribe({
            next: () => {
                this.partners = this.partners.filter(p => p.id !== id);
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(err);
                this.cdr.detectChanges();
            }
        });
    }
}
