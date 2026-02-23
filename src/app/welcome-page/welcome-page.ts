import { Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { UserRegistrationForm } from '../user-registration-form/user-registration-form';
import { UserLoginForm } from '../user-login-form/user-login-form';

@Component({
  selector: 'app-welcome-page',
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatToolbarModule],
  templateUrl: './welcome-page.html',
  styleUrl: './welcome-page.scss',
})
export class WelcomePage {
  private dialog = inject(MatDialog);

  dunePoster = signal<string>('assets/starwars.svg');
  interstellarPoster = signal<string>('assets/Mercy.webp');

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationForm, {
      width: '360px',
      maxWidth: '95vw'
    });
  }

  openUserLoginDialog(): void {
    this.dialog.open(UserLoginForm, {
      width: '360px',
      maxWidth: '95vw'
    });
  }
}
