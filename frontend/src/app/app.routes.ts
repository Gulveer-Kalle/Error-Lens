import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { SubmitEvent } from './pages/submit-event/submit-event';
import { ApiDocs } from './pages/api-docs/api-docs';
import { Settings } from './pages/settings/settings';
import { Account } from './pages/account/account';

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
  {
    path: 'settings',
    component: Settings,
  },
  {
    path: 'account',
    component: Account,
  },
];
