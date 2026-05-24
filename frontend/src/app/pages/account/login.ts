import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginPage {
  email = '';
  password = '';
  message = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.getToken()) {
      this.router.navigate(['/']);
    }
  }

  login() {
    this.message = '';
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.message = err?.error?.message || 'Login failed';
      },
    });
  }
}
