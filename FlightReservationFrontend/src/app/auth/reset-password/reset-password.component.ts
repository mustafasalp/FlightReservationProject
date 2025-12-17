import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    token: string = '';
    email: string = '';
    newPassword: string = '';
    confirmPassword: string = '';

    message: string = '';
    error: string = '';
    loading: boolean = false;
    success: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'] || '';
            this.email = params['email'] || '';
        });
    }

    submit() {
        if (!this.newPassword || !this.confirmPassword) {
            this.error = 'Please fill in all fields.';
            return;
        }

        if (this.newPassword !== this.confirmPassword) {
            this.error = 'Passwords do not match.';
            return;
        }

        this.loading = true;
        this.message = '';
        this.error = '';

        const payload = {
            email: this.email,
            token: this.token,
            newPassword: this.newPassword
        };

        this.authService.resetPassword(payload).subscribe({
            next: (res) => {
                this.message = res.message;
                this.success = true;
                this.loading = false;
                setTimeout(() => {
                    this.router.navigate(['/login']);
                }, 3000);
            },
            error: (err) => {
                this.error = err.error?.message || 'Failed to reset password. Link might be invalid or expired.';
                this.loading = false;
            }
        });
    }
}
