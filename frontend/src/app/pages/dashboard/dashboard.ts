import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { SummaryCards } from '../../components/summary-cards/summary-cards';
import { EventTable } from '../../components/event-table/event-table';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [Navbar, SummaryCards, EventTable],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard {}
