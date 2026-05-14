import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { SubmitEvent } from './pages/submit-event/submit-event';
import { ApiDocs } from './pages/api-docs/api-docs';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
  },
  {
    path: 'submit',
    component: SubmitEvent,
  },
  {
    path: 'api',
    component: ApiDocs,
  },
];
