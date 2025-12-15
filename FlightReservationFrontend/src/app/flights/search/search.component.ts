import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FlightsService } from '../../services/flights.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  origin: string = '';
  destination = '';
  date: string = '';
  classes: string[] = [];

  flights: any[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private flightsService: FlightsService,
    private router: Router
  ) { }

  ngOnInit() {
    // Query parametreleri değiştiğinde arama yap
    this.route.queryParams.subscribe(params => {
      this.origin = params['from'] || '';
      this.destination = params['to'] || '';
      this.date = params['date'] || '';
      this.classes = params['classes']?.split(',') || [];

      // Eğer herhangi bir parametre varsa arama yap
      if (this.origin || this.destination || this.date || this.classes.length > 0) {
        this.searchFlights();
      } else {
        // Parametre yoksa tüm uçuşları göster
        this.loadAllFlights();
      }
    });
  }

  loaderAllFlightsSub: any;

  // loadAllFlights is removed or modified to not run if search params exist
  loadAllFlights() {
    this.loading = true;
    this.loaderAllFlightsSub = this.flightsService.getAllFlights().subscribe({
      next: (res) => {
        this.flights = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // ...

  searchFlights() {
    this.loading = true;

    // Fix date to local YYYY-MM-DD string
    let dateStr = null;
    if (this.date) {
      const d = new Date(this.date);
      dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    const searchParams = {
      origin: this.origin,
      destination: this.destination,
      date: dateStr
    };

    this.flightsService.searchFlights(searchParams)
      .subscribe({
        next: (res) => {
          this.flights = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
  goToDetails(id: number) {
    this.router.navigate(['/flights/details', id]);
  }
}
