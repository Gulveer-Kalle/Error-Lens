import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-account',
  imports: [CommonModule, RouterLink],
  templateUrl: './account.html',
  styleUrls: ['./account.css'],
})
export class Account {
  email: string | null = null;
  message = '';
  isAuthenticated = false;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.isAuthenticated$.subscribe((v) => (this.isAuthenticated = v));
    this.auth.userEmail$.subscribe((e) => (this.email = e));
  }

  logout() {
    this.auth.logout();
    this.message = 'Signed out';
    this.router.navigate(['/account/login']);
  }

  deleteAccount() {
    const ok = confirm('Delete your account? This will remove your data and cannot be undone.');
    if (!ok) return;

    this.auth.deleteAccount().subscribe({
      next: () => {
        this.auth.logout();
        this.message = 'Account deleted';
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Failed to delete account', err);
        this.message = 'Failed to delete account';
      }
    });
  }
}

