import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  isAuthenticated = false;
  userEmail: string | null = null;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.isAuthenticated$.subscribe((v) => (this.isAuthenticated = v));
    this.auth.userEmail$.subscribe((e) => (this.userEmail = e));
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/account/login']);
  }
}
