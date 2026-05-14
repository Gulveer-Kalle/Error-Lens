import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService, Event } from '../../services/events.service';

@Component({
  standalone: true,
  selector: 'app-event-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-table.html',
  styleUrls: ['./event-table.css'],
})
export class EventTable implements OnInit {
  events: Event[] = [];
  loading = true;
  // These are bound to the filter dropdowns in the template.
  // Keep them aligned with the template's default option value="" (All).
  severityFilter: '' | 'low' | 'medium' | 'high' | 'critical' = '';
  environmentFilter: '' | 'development' | 'staging' | 'production' = '';


  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    // Ensure initial load uses current filter defaults bound from the template
    this.loadEvents();
  }


  loadEvents() {
    this.loading = true;
    this.eventsService.getEvents(this.severityFilter, this.environmentFilter).subscribe({
      next: (data) => {
        this.events = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.loadEvents();
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return '';
    }
  }

  getEventTypeClass(eventType: string): string {
    switch (eventType) {
      case 'error': return 'event-type-error';
      case 'warning': return 'event-type-warning';
      case 'info': return 'event-type-info';
      default: return '';
    }
  }
}
