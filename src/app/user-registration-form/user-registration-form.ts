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
  selector: 'app-user-registration-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-registration-form.html',
  styleUrl: './user-registration-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRegistrationForm {
  private fetchApiData = inject(FetchApiData);
  private dialogRef = inject(MatDialogRef<UserRegistrationForm>);
  private snackBar = inject(MatSnackBar);
  private formBuilder = inject(FormBuilder);

  isLoading = signal(false);

  registrationForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    birthday: [''],
  });

  registerUser(): void {
    if (this.registrationForm.invalid) {
      this.snackBar.open('Please fill in all required fields correctly', 'OK', {
        duration: 2000,
      });
      return;
    }

    this.isLoading.set(true);

    this.fetchApiData.userRegistration(this.registrationForm.value).subscribe({
      next: (result) => {
        this.isLoading.set(false);
        this.snackBar.open('Registration successful!', 'OK', { duration: 2000 });
        this.dialogRef.close();
      },
      error: (error) => {
        this.isLoading.set(false);
        const errorMessage =
          error?.error?.message || 'Registration failed. Please try again.';
        this.snackBar.open(errorMessage, 'OK', { duration: 2000 });
      },
    });
  }
}
