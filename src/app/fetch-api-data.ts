import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Replace with your deployed API URL
const apiUrl = 'YOUR_HOSTED_API_URL_HERE/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiData {

  private http = inject(HttpClient);

  /**
   * Register User
   */
  userRegistration(userDetails: {
    Username: string;
    Password: string;
    Email: string;
    Birthday: string;
  }): Observable<any> {

    return this.http.post(`${apiUrl}users`, userDetails)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get All Movies (Protected Route)
   */
  getAllMovies(): Observable<any> {

    const token = localStorage.getItem('token');

    return this.http.get(`${apiUrl}movies`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Error Handling
   */
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