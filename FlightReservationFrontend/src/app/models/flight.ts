export interface Flight {
  id: number;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  totalCapacity: number;
  basePrice: number;
  status?: string;
}
