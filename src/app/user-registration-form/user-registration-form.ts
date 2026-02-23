import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
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
  private router = inject(Router);

  isLoading = signal(false);

  // Custom validator for alphanumeric password
  alphanumericValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    return alphanumericRegex.test(value) ? null : { notAlphanumeric: true };
  }

  registrationForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, this.alphanumericValidator.bind(this)]],
    email: ['', [Validators.required, Validators.email]],
    birthday: [''],
  });

  registerUser(): void {
    if (this.registrationForm.invalid) {
      const usernameControl = this.registrationForm.get('username');
      const passwordControl = this.registrationForm.get('password');

      if (usernameControl?.hasError('required')) {
        this.snackBar.open('Username is required', 'OK', { duration: 2000 });
      } else if (usernameControl?.hasError('minlength')) {
        this.snackBar.open('Username must be at least 5 characters', 'OK', { duration: 2000 });
      } else if (passwordControl?.hasError('required')) {
        this.snackBar.open('Password is required', 'OK', { duration: 2000 });
      } else if (passwordControl?.hasError('notAlphanumeric')) {
        this.snackBar.open('Password must contain only letters and numbers', 'OK', { duration: 2000 });
      } else {
        this.snackBar.open('Please fill in all required fields correctly', 'OK', { duration: 2000 });
      }
      return;
    }

    this.isLoading.set(true);

    this.fetchApiData.userRegistration(this.registrationForm.value).subscribe({
      next: (result) => {
        this.isLoading.set(false);
        this.dialogRef.close();
        this.snackBar.open('Registration successful! Please log in.', 'OK', { duration: 2000 });
        this.router.navigate(['/welcome']);
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
