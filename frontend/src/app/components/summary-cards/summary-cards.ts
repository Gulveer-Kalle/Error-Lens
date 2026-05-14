import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsService, Summary } from '../../services/events.service';

@Component({
  standalone: true,
  selector: 'app-summary-cards',
  imports: [CommonModule],
  templateUrl: './summary-cards.html',
  styleUrls: ['./summary-cards.css'],
})
export class SummaryCards implements OnInit {
  summary: Summary = {
    total: 0,
    last24h: 0,
    severity: [],
    eventType: [],
    environment: []
  };
  loading = true;

  constructor(private eventsService: EventsService) {}

  ngOnInit() {
    this.loadSummary();
  }

  private loadSummary() {
    this.eventsService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Summary load error:', err);
        this.loading = false;
      }
    });
  }

  refreshSummary() {
    this.loadSummary();
  }
}
