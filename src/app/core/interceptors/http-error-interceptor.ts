import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoggerService } from '../services/logger';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private logger: LoggerService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const errorId = this.logger.error('HTTP error', {
          url: req.url,
          method: req.method,
          status: err.status,
          message: err.message,
          error: err.error
        });

        if (err.status === 401) {
          this.snackBar.open('Session expired. Please login again.', 'Dismiss', { duration: 5000 });
          this.router.navigateByUrl('/login');
        } else {
          this.snackBar.open(`Request failed. Error ID: ${errorId}`, 'Dismiss', { duration: 6000 });
        }

        return throwError(() => err);
      })
    );
  }
}
