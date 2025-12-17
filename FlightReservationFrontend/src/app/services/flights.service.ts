import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FlightsService {
  private apiUrl = 'https://localhost:7055/api';

  constructor(private http: HttpClient) { }

  searchFlights(search: {
    origin: string | null,
    destination: string | null,
    date: string | null
  }): Observable<any[]> {

    let params = new HttpParams();

    if (search.origin) params = params.set('origin', search.origin);
    if (search.destination) params = params.set('destination', search.destination);

    if (search.date) {
      params = params.set('date', search.date);
    }

    console.log('Calling search API with params:', params.toString());

    return this.http.get<any[]>(`${this.apiUrl}/flights/search`, { params });
  }

  getAllFlights(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/flights`);
  }

  getFlightById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/flights/${id}`);
  }

  createReservation(reservation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reservations`, reservation);
  }

  getSeats(flightId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/flights/${flightId}/seats`);
  }

  getLocations(): Observable<{ origins: string[], destinations: string[] }> {
    return this.http.get<{ origins: string[], destinations: string[] }>(`${this.apiUrl}/flights/locations`);
  }

  getMyReservations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservations/my`);
  }

  cancelReservation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reservations/${id}`);
  }

  // AIRLINE PARTNERS
  getPartners(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/airlinepartners`);
  }

  addPartner(partner: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/airlinepartners`, partner);
  }

  deletePartner(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/airlinepartners/${id}`);
  }
}
