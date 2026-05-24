import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
})
export class Settings {
  email: string | null = null;
  isAuthenticated = false;
  copyMessage = '';
  private token: string | null = null;

  constructor(private auth: AuthService) {
    this.token = this.auth.getToken();
    this.auth.isAuthenticated$.subscribe((value) => {
      this.isAuthenticated = value;
      this.token = this.auth.getToken();
    });
    this.auth.userEmail$.subscribe((email) => {
      this.email = email;
    });
  }

  copyToken() {
    if (!this.token) {
      return;
    }

    navigator.clipboard.writeText(this.token).then(() => {
      this.copyMessage = 'Token copied successfully';
      setTimeout(() => {
        this.copyMessage = '';
      }, 3000);
    });
  }
}
