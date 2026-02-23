import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Components
import { UserRegistrationForm } from './user-registration-form/user-registration-form';
import { UserLoginForm } from './user-login-form/user-login-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private dialog = inject(MatDialog);
  protected readonly title = signal('myFlix-Angular-client');

  // This is the function that will open the dialog when the signup button is clicked
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationForm, {
      width: '280px'
    });
  }

  openUserLoginDialog(): void {
    this.dialog.open(UserLoginForm, {
      width: '280px'
    });
  }
}
