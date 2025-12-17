import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  model = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  errorMessage: string = '';

  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  register() {
    this.errorMessage = '';

    if (this.model.password !== this.model.confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please check and try again.';
      return;
    }

    this.authService.register(this.model).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || err?.message || JSON.stringify(err) || 'Registration failed';
      }
    });
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPassword() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
