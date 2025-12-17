import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  constructor(
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

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
        this.cdr.detectChanges();
      },
      error: () => {
        console.error('Login failed');
        this.loading = false;
        const isEmail = this.model.usernameOrEmail.includes('@');
        this.errorMessage = isEmail
          ? 'Email or password is incorrect. Please try again.'
          : 'Username or password is incorrect. Please try again.';
        this.cdr.detectChanges();
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