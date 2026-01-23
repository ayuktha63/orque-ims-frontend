import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ErrorHandler, importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app';
import { GlobalErrorHandler } from './app/core/error/global-error-handler';
import { AuthInterceptor } from './app/core/interceptors/auth-interceptor';
import { HttpErrorInterceptor } from './app/core/interceptors/http-error-interceptor';



bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule),

    { provide: ErrorHandler, useClass: GlobalErrorHandler },

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ]
}).catch(err => console.error(err));
