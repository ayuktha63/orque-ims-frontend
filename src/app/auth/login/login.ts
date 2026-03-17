import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AuthService } from '../../core/services/auth';
import { ToastService } from '../../core/services/toast.service'; // ✅ ADD

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService); // ✅ INJECT

  form = this.fb.group({
    userType: ['ORQUE', [Validators.required]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  // ==========================================
  // LOGIN SUBMIT
  // ==========================================
  submit(): void {

    // ✅ FORM VALIDATION TOASTS
    if (!this.form.value.username) {
      this.toast.warning('Username is required');
      return;
    }

    if (!this.form.value.password) {
      this.toast.warning('Password is required');
      return;
    }

    if (this.form.invalid) {
      this.toast.warning('Please enter valid credentials');
      return;
    }

    const { userType, username, password } = this.form.value;

    this.auth.login(userType!, username!, password!).subscribe({

      next: (res:any) => {

        // ✅ SUCCESS TOAST
        this.toast.success(res?.message || 'Login successful');

        // navigate after toast
        this.router.navigateByUrl('/app/dashboard');
      },

      error: (err) => {

        const msg =
          err?.error?.message ||
          err?.message ||
          'Invalid username or password';

        // ❌ REMOVE ALERT — use toast
        this.toast.error(msg);

        console.error('Login error', err);
      }

    });
  }
}