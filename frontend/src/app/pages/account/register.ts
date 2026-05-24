import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterPage {
  email = '';
  password = '';
  confirm = '';
  message = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.getToken()) {
      this.router.navigate(['/']);
    }
  }

  register() {
    this.message = '';
    if (this.password !== this.confirm) {
      this.message = 'Passwords do not match';
      return;
    }
    this.loading = true;
    this.auth.register(this.email, this.password).subscribe({
      next: () => {
        // after successful register, log the user in automatically
        this.auth.login(this.email, this.password).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.loading = false;
            this.message = 'Registered but auto-login failed. Please login manually.';
            this.router.navigate(['/account/login']);
          },
        });
      },
      error: (err) => {
        this.loading = false;
        this.message = err?.error?.message || 'Register failed';
      },
    });
  }
}
