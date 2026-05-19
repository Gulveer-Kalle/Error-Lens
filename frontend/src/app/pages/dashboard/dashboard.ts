import { Component } from '@angular/core';
import { SummaryCards } from '../../components/summary-cards/summary-cards';
import { EventTable } from '../../components/event-table/event-table';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [SummaryCards, EventTable],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {}

