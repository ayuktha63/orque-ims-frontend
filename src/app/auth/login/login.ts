import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // Use inject() to ensure these are available for property initialization
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Now 'this.fb' is defined and safe to use here
  form = this.fb.group({
    username: ['', [Validators.required]], 
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  // Constructor is no longer needed for injection
  constructor() {}

  submit(): void {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;

    // username! and password! tell TS these won't be null due to Validators.required
    this.auth.login(username!, password!).subscribe({
      next: () => {
        this.router.navigateByUrl('/app/dashboard');
      },
      error: (err) => {
        alert('Access Denied: Please check your username or password.');
        console.error('Login error', err);
      }
    });
  }
}