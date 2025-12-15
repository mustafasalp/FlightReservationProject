import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminFlightsService {
    private apiUrl = 'https://localhost:7055/api/AdminFlights';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    getFlights(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    getFlightById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createFlight(flight: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, flight, { headers: this.getHeaders() });
    }

    updateFlight(id: number, flight: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, flight, { headers: this.getHeaders() });
    }

    deleteFlight(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
