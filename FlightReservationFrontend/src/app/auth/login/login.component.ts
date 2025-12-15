import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ]
})
export class LoginComponent {
  model = {
    usernameOrEmail: '',
    password: ''
  };

  loading = false;
  hidePassword: boolean = true;
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    this.loading = true;
    this.errorMessage = '';

    this.auth.login(this.model).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);

        this.auth.saveUserData(res.firstName, res.role, res.userId);
        localStorage.setItem('role', res.role);
        localStorage.setItem('username', res.firstName);

        this.router.navigate(['/']);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        const isEmail = this.model.usernameOrEmail.includes('@');
        this.errorMessage = isEmail
          ? 'Email or password is incorrect. Please try again.'
          : 'Username or password is incorrect. Please try again.';
      }
    });
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/'], { queryParams: { logout: 'true' } });
  }

}