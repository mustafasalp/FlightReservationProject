import { Routes } from '@angular/router';

// Auth
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

// Flights
import { SearchComponent } from './flights/search/search.component';
import { Details } from './flights/details/details.component';

// Reservations
import { MyReservationsComponent } from './reservations/my-reservations.component';

// Seats
import { Seats } from './flights/seats/seats.component';

// Home
import { HomeComponent } from './home/home.component';

// Admin Flights
import { CreateFlightComponent } from './admin/flights/create/create.component';
import { EditFlightComponent } from './admin/flights/edit/edit.component';
import { ListFlightsComponent } from './admin/flights/list/list.component';
import { AdminPartnersComponent } from './admin/partners/partners.component';

// Pages
import { PrivacyPolicyComponent } from './pages/privacy-policy';
import { TermsOfServiceComponent } from './pages/terms-of-service';
import { SupportComponent } from './pages/support';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  // Auth
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  // Flights
  // { path: 'flights/search', component: SearchComponent }, // Removed as per redesign
  { path: 'flights/details/:id', component: Details },
  { path: 'flights/:id/book', component: Seats },

  // Reservations
  // Reservations
  { path: 'my-reservations', component: MyReservationsComponent },

  // User Settings
  { path: 'user-settings', component: UserSettingsComponent },

  // Admin
  { path: 'admin/flights', component: ListFlightsComponent },
  { path: 'admin/flights/create', component: CreateFlightComponent },
  { path: 'admin/flights/edit/:id', component: EditFlightComponent },
  { path: 'admin/partners', component: AdminPartnersComponent },
  // { path: 'flights/seats/:id', component: Seats }, // Replaced by /flights/:id/book

  // Pages
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  { path: 'support', component: SupportComponent },
];
