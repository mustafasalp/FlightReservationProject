import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  currentRoute: string = '';

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  // REQUIRED METHODS
  isNotHome(): boolean {
    return this.currentRoute !== '/';
  }

  get userName(): string {
    return this.authService.getUserName();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}