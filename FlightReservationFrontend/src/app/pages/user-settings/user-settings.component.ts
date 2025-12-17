import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss'] // Assuming scss, will create empty one if needed or inline. Let's use inline styles or just basic classes for now? No, better use separate file or inline style block. I'll create .scss file too.
})
export class UserSettingsComponent implements OnInit {
    user: any = {
        firstName: '',
        lastName: '',
        userName: '',
        email: ''
    };

    passwords = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    showCurrentPassword = false;
    showNewPassword = false;
    showConfirmPassword = false;

    message: string = '';
    error: string = '';
    isLoading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.fetchProfile();
    }

    fetchProfile() {
        console.log('Fetching user profile...');
        this.authService.getProfile().subscribe({
            next: (data) => {
                console.log('Profile loaded:', data);
                this.user = data;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to fetch profile', err);
                this.error = 'Failed to load user data.';
                this.cdr.detectChanges();
            }
        });
    }

    updateProfile() {
        this.message = '';
        this.error = '';

        // Basic validation
        if (this.passwords.newPassword && this.passwords.newPassword !== this.passwords.confirmPassword) {
            this.error = 'New passwords do not match.';
            return;
        }

        this.isLoading = true;

        const payload = {
            ...this.user,
            currentPassword: this.passwords.currentPassword || null,
            newPassword: this.passwords.newPassword || null
        };

        this.authService.updateProfile(payload).subscribe({
            next: (res) => {
                this.isLoading = false;
                if (res.success) {
                    this.message = res.message;

                    if (res.requiresLogout) {
                        alert(res.message);
                        this.authService.logout();
                        this.router.navigate(['/login']);
                    } else {
                        // Update local storage if username changed
                        const currentUserId = this.authService.getUserId();
                        if (currentUserId) {
                            this.authService.saveUserData(res.user.userName, this.authService.getRole(), currentUserId);
                        }
                    }
                }
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.error?.message || 'Update failed.';
                if (err.error?.errors) {
                    this.error += ' ' + err.error.errors.join(', ');
                }
                this.cdr.detectChanges();
            }
        });
    }
}
