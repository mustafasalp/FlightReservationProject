import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightsService } from '../../services/flights.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class Details implements OnInit {

  flight: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flightsService: FlightsService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.flightsService.getFlightById(id).subscribe({
      next: (res) => {
        this.flight = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goToSeats() {
    this.router.navigate([`/flights/details/${this.flight.id}/seats`]);
  }
}
