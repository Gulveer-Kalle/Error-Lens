import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Event {
  id: number;
  application: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  environment: 'development' | 'staging' | 'production';
  created_at: string;
}

export interface Summary {
  total: number;
  critical: number;
  production: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }

  getEvents(severity?: string, env?: string): Observable<Event[]> {
    let params = new HttpParams();
    if (severity) params = params.set('severity', severity);
    if (env) params = params.set('environment', env);
    return this.http.get<Event[]>(`${environment!.apiUrl}/events`, { params });
  }

  getSummary(): Observable<Summary> {
    return this.http.get<Summary>(`${environment!.apiUrl}/events/summary`);
  }

  createEvent(event: Omit<Event, 'id' | 'created_at'>): Observable<Event> {
    return this.http.post<Event>(`${environment!.apiUrl}/events`, event);
  }
}