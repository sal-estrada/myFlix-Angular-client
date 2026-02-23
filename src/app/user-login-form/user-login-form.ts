import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiData } from '../fetch-api-data';

@Component({
  selector: 'app-user-login-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-login-form.html',
  styleUrl: './user-login-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLoginForm {
  private fetchApiData = inject(FetchApiData);
  private dialogRef = inject(MatDialogRef<UserLoginForm>);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);

  isLoading = signal(false);

  loginForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loginUser(): void {
    if (this.loginForm.invalid) {
      this.snackBar.open('Please enter your username and password', 'OK', {
        duration: 2000,
      });
      return;
    }

    this.isLoading.set(true);

    this.fetchApiData.userLogin(this.loginForm.value).subscribe({
      next: (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.isLoading.set(false);
        this.snackBar.open('Login successful!', 'OK', { duration: 2000 });
        this.dialogRef.close();
      },
      error: (error) => {
        this.isLoading.set(false);
        const errorMessage =
          error?.error?.message || 'Login failed. Please try again.';
        this.snackBar.open(errorMessage, 'OK', { duration: 2000 });
      },
    });
  }
}
