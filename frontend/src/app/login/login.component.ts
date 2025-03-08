import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.authService.setToken(response.access_token);
        this.router.navigate(['/posts']);
      },
      error: (err) => {
        this.error = err.error.message || 'Login failed.';
      },
    });
  }

  googleLogin(): void {
    window.location.href = 'http://localhost:3000/auth/google';
  }
}
