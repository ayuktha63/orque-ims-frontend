import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ErrorHandler, importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app';
import { GlobalErrorHandler } from './app/core/error/global-error-handler';
import { authInterceptor } from './app/core/interceptors/auth-interceptor';
import { HttpErrorInterceptor } from './app/core/interceptors/http-error-interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    
    // Configures HttpClient with modern Fetch API and Functional Interceptors
    provideHttpClient(
      withFetch(), 
      withInterceptors([authInterceptor]), 
      withInterceptorsFromDi() // Keep this ONLY for Class-based HttpErrorInterceptor
    ),
    
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule),

    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    
    // This is for your Class-based Error Interceptor
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: HttpErrorInterceptor, 
      multi: true 
    },
  ]
}).catch(err => console.error(err));