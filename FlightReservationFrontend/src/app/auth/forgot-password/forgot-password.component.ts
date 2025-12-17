import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
    email: string = '';
    message: string = '';
    error: string = '';
    loading: boolean = false;

    constructor(private authService: AuthService) { }

    submit() {
        if (!this.email) return;

        this.loading = true;
        this.message = '';
        this.error = '';

        this.authService.forgotPassword(this.email).subscribe({
            next: (res) => {
                this.message = res.message;
                this.loading = false;
            },
            error: (err) => {
                this.error = err.error?.message || 'An error occurred.';
                this.loading = false;
            }
        });
    }
}
