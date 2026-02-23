import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class FetchApiData {

  private http = inject(HttpClient);

  // ============================
  // AUTH
  // ============================

  userRegistration(userDetails: {
    username: string;
    password: string;
    email: string;
    birthday: string;
    firstName?: string;
    lastName?: string;
  }): Observable<any> {

    return this.http.post(`${apiUrl}users`, userDetails)
      .pipe(catchError(this.handleError));
  }

  userLogin(credentials: {
    username: string;
    password: string;
  }): Observable<any> {

    return this.http.post(`${apiUrl}login`, credentials)
      .pipe(catchError(this.handleError));
  }

  // ============================
  // MOVIES
  // ============================

  getAllMovies(): Observable<any> {

    return this.http.get(`${apiUrl}movies`, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }

  getOneMovie(title: string): Observable<any> {

    return this.http.get(`${apiUrl}movies/${title}`, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }

  getGenre(genreName: string): Observable<any> {

    return this.http.get(`${apiUrl}movies/genre/${genreName}`, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }

  getDirector(directorName: string): Observable<any> {

    return this.http.get(`${apiUrl}movies/directors/${directorName}`, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }

  // ============================
  // USERS
  // ============================

  getUser(username: string): Observable<any> {

    return this.http.get(`${apiUrl}users/${username}`, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }

  editUser(username: string, updatedUser: any): Observable<any> {

    return this.http.put(`${apiUrl}users/${username}`, updatedUser, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }

  deleteUser(username: string): Observable<any> {

    return this.http.delete(`${apiUrl}users/${username}`, this.getAuthHeaders())
      .pipe(catchError(this.handleError));
  }

  // ============================
  // FAVORITES
  // ============================

  addFavoriteMovie(username: string, movieId: string): Observable<any> {

    return this.http.post(
      `${apiUrl}users/${username}/movies/${movieId}`,
      {},
      this.getAuthHeaders()
    ).pipe(catchError(this.handleError));
  }

  removeFavoriteMovie(username: string, movieId: string): Observable<any> {

    return this.http.delete(
      `${apiUrl}users/${username}/movies/${movieId}`,
      this.getAuthHeaders()
    ).pipe(catchError(this.handleError));
  }

  // ============================
  // HELPERS
  // ============================

  private getAuthHeaders() {

    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  private handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {
      console.error('Client error:', error.error.message);
    } else {
      console.error(
        `Server returned code ${error.status}`,
        error.error
      );
    }

    return throwError(() =>
      new Error('Something went wrong. Please try again later.')
    );
  }
}