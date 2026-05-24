import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { SubmitEvent } from './pages/submit-event/submit-event';
import { ApiDocs } from './pages/api-docs/api-docs';
import { Settings } from './pages/settings/settings';
import { Account } from './pages/account/account';
import { LoginPage } from './pages/account/login';
import { RegisterPage } from './pages/account/register';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  // Public account routes
  {
    path: 'account',
    children: [
      { path: '', component: Account },
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage },
    ],
  },

  // Protected app routes (require auth)
  { path: '', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'submit', component: SubmitEvent, canActivate: [AuthGuard] },
  { path: 'api', component: ApiDocs, canActivate: [AuthGuard] },
  { path: 'settings', component: Settings, canActivate: [AuthGuard] },

  // fallback
  { path: '**', redirectTo: '' },
];
