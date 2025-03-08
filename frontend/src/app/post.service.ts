import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPosts(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiUrl, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  getPost(id: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  createPost(post: any): Observable<any> {
    return this.http
      .post(this.apiUrl, post, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  updatePost(id: string, post: any): Observable<any> {
    return this.http
      .patch(`${this.apiUrl}/${id}`, post, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  deletePost(id: string): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${id}`, this.getHeaders())
      .pipe(catchError(this.handleError));
  }

  private getHeaders(): { headers?: HttpHeaders } {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
      return { headers };
    } else {
      console.log('No token found, sending empty headers');
      return {};
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
          `body was: ${JSON.stringify(error.error)}`
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(() => 'Something bad happened; please try again later.');
  }
}
