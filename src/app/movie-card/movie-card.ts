import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FetchApiData } from '../fetch-api-data';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardHeader, MatCardActions } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GenreDialog } from '../genre-dialog/genre-dialog';
import { DirectorDialog } from '../director-dialog/director-dialog';
import { SynopsisDialog } from '../synopsis-dialog/synopsis-dialog';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, MatCard, MatCardTitle, MatCardSubtitle, MatCardHeader, MatCardActions, MatButtonModule, MatIconModule, MatToolbarModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('favoriteAnimation', [
      transition('false => true', [
        style({ transform: 'scale(1)' }),
        animate('150ms ease-out', style({ transform: 'scale(1.5)' })),
        animate('100ms ease-in', style({ transform: 'scale(0.9)' })),
        animate('150ms ease-out', style({ transform: 'scale(1.2)' })),
        animate('100ms ease-in', style({ transform: 'scale(1)' }))
      ]),
      transition('true => false', [
        style({ transform: 'scale(1)' }),
        animate('100ms ease-in', style({ transform: 'scale(1.2)' })),
        animate('200ms ease-out', style({ transform: 'scale(0.5)', opacity: 0.5 })),
        animate('100ms ease-in', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class MovieCard implements OnInit {
  private fetchApiData = inject(FetchApiData);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  
  movies = signal<any[]>([]);
  favoriteMovieIds = signal<string[]>([]);

  ngOnInit(): void {
    this.getMovies();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.favoriteMovieIds.set(user.favoriteMovieIds || []);
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies.set(resp);
      console.log(this.movies());
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialog, {
      width: '400px',
      data: {
        name: genre.Name,
        description: genre.Description
      }
    });
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorDialog, {
      width: '400px',
      data: {
        name: director.Name,
        bio: director.Bio,
        birth: director.Birth,
        death: director.Death
      }
    });
  }

  openSynopsisDialog(movie: any): void {
    this.dialog.open(SynopsisDialog, {
      width: '500px',
      data: {
        title: movie.Title,
        description: movie.Description,
        imagePath: movie.ImagePath
      }
    });
  }

  toggleFavorite(movieId: string): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.username) {
      this.snackBar.open('Please login first', 'OK', { duration: 3000 });
      return;
    }

    const isFav = this.isFavorite(movieId);
    const originalFavorites = this.favoriteMovieIds();
    
    if (isFav) {
      // Optimistically remove from favorites
      const updated = this.favoriteMovieIds().filter(id => id !== movieId);
      this.favoriteMovieIds.set(updated);
      
      this.fetchApiData.removeFavoriteMovie(user.username, movieId).subscribe({
        next: (response) => {
          localStorage.setItem('user', JSON.stringify(response));
          this.favoriteMovieIds.set(response.favoriteMovieIds || []);
          this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
        },
        error: (error) => {
          // Revert on error
          this.favoriteMovieIds.set(originalFavorites);
          this.snackBar.open('Failed to remove from favorites', 'OK', { duration: 3000 });
        }
      });
    } else {
      // Optimistically add to favorites
      const updated = [...this.favoriteMovieIds(), movieId];
      this.favoriteMovieIds.set(updated);
      
      this.fetchApiData.addFavoriteMovie(user.username, movieId).subscribe({
        next: (response) => {
          localStorage.setItem('user', JSON.stringify(response));
          this.favoriteMovieIds.set(response.favoriteMovieIds || []);
          this.snackBar.open('Added to favorites!', 'OK', { duration: 2000 });
        },
        error: (error) => {
          // Revert on error
          this.favoriteMovieIds.set(originalFavorites);
          this.snackBar.open('Failed to add to favorites', 'OK', { duration: 3000 });
        }
      });
    }
  }

  isFavorite(movieId: string): boolean {
    return this.favoriteMovieIds().includes(movieId);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    localStorage.clear();
    this.snackBar.open('Logged out successfully', 'OK', { duration: 2000 });
    this.router.navigate(['/welcome']);
  }
}
