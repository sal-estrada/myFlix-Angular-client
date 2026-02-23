import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FetchApiData } from '../fetch-api-data';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile implements OnInit {
  private fb = inject(FormBuilder);
  private fetchApiData = inject(FetchApiData);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  user = signal<any>(null);
  isLoading = signal(false);
  favoriteMovies = signal<any[]>([]);
  allMovies = signal<any[]>([]);

  profileForm: FormGroup = this.fb.group({
    username: [{ value: '', disabled: true }],
    email: ['', [Validators.required, Validators.email]],
    birthday: [''],
    password: ['']
  });

  ngOnInit(): void {
    this.loadUserData();
    this.loadMovies();
  }

  loadUserData(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/welcome']);
      return;
    }

    const user = JSON.parse(userStr);
    this.user.set(user);

    // Fetch fresh user data from API
    this.fetchApiData.getUser(user.username).subscribe({
      next: (userData) => {
        this.user.set(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Populate form with user data
        this.profileForm.patchValue({
          username: userData.username,
          email: userData.email,
          birthday: userData.birthday ? new Date(userData.birthday).toISOString().split('T')[0] : ''
        });
        
        // Update favorite movies display
        this.updateFavoriteMovies();
      },
      error: (error) => {
        this.snackBar.open('Failed to load user data', 'OK', { duration: 3000 });
      }
    });
  }

  updateUser(): void {
    if (this.profileForm.invalid) {
      this.snackBar.open('Please fix form errors', 'OK', { duration: 3000 });
      return;
    }

    this.isLoading.set(true);
    const username = this.user()?.username;
    
    // Only include fields that were filled in
    const updateData: any = {
      email: this.profileForm.value.email
    };
    
    if (this.profileForm.value.birthday) {
      updateData.birthday = this.profileForm.value.birthday;
    }
    
    if (this.profileForm.value.password) {
      updateData.password = this.profileForm.value.password;
    }

    this.fetchApiData.editUser(username, updateData).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.user.set(response);
        localStorage.setItem('user', JSON.stringify(response));
        this.snackBar.open('Profile updated successfully!', 'OK', { duration: 3000 });
        
        // Clear password field
        this.profileForm.patchValue({ password: '' });
      },
      error: (error) => {
        this.isLoading.set(false);
        this.snackBar.open('Failed to update profile', 'OK', { duration: 3000 });
      }
    });
  }

  deleteAccount(): void {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    const username = this.user()?.username;
    this.fetchApiData.deleteUser(username).subscribe({
      next: () => {
        localStorage.clear();
        this.snackBar.open('Account deleted successfully', 'OK', { duration: 3000 });
        this.router.navigate(['/welcome']);
      },
      error: (error) => {
        this.snackBar.open('Failed to delete account', 'OK', { duration: 3000 });
      }
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/welcome']);
    this.snackBar.open('Logged out successfully', 'OK', { duration: 2000 });
  }

  goToMovies(): void {
    this.router.navigate(['/movies']);
  }

  loadMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (movies) => {
        this.allMovies.set(movies);
        this.updateFavoriteMovies();
      },
      error: (error) => {
        console.error('Failed to load movies:', error);
      }
    });
  }

  updateFavoriteMovies(): void {
    const user = this.user();
    const movies = this.allMovies();
    
    if (user && user.favoriteMovieIds && movies.length > 0) {
      const favorites = movies.filter(movie => 
        user.favoriteMovieIds.includes(movie._id)
      );
      this.favoriteMovies.set(favorites);
    } else {
      this.favoriteMovies.set([]);
    }
  }

  removeFavorite(movieId: string): void {
    const user = this.user();
    if (!user) return;

    this.fetchApiData.removeFavoriteMovie(user.username, movieId).subscribe({
      next: (response) => {
        this.user.set(response);
        localStorage.setItem('user', JSON.stringify(response));
        this.updateFavoriteMovies();
        this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to remove from favorites', 'OK', { duration: 3000 });
      }
    });
  }
}
