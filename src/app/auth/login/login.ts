import { Component, inject ,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators , AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth';
import { ToastService } from '../../core/services/toast.service';

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
    MatButtonToggleModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  hidePassword = true;
  private toast = inject(ToastService); // ✅ INJECT

  form = this.fb.group({
    userType: ['ORQUE', [Validators.required]],
username: ['', [
  Validators.required,
  Validators.maxLength(50),
  (control: AbstractControl) => {
    const value = control.value || '';
    // whitespace-only check
    if (value.trim().length === 0 && value.length > 0) {
      return { whitespace: true };
    }
    // spaces anywhere in username
    if (/\s/.test(value)) {
      return { noSpaces: true };
    }
    return null;
  }
]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

    // ==========================================
  // BLOCK COPY / PASTE / CUT
  // ==========================================
  blockAction(
    event: ClipboardEvent,
    action: string
  ): void {

    event.preventDefault();

    if (action === 'copy') {

      this.toast.warning(
        'Copy action is not allowed on the login page'
      );
    }

    if (action === 'paste') {

      this.toast.warning(
        'Paste action is disabled for security reasons'
      );
    }

    if (action === 'cut') {

      this.toast.warning(
        'Cut action is not permitted'
      );
    }
  }


  // ==========================================
  // BLOCK KEYBOARD SHORTCUTS
  // ==========================================
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {

    const key = (event.key || '').toLowerCase();

    // WINDOWS CTRL
    const isCtrl =
      event.ctrlKey;

    // MAC COMMAND
    const isCommand =
      event.metaKey;

    // ==========================================
    // COPY
    // ==========================================
    if (
      (isCtrl || isCommand) &&
      key === 'c'
    ) {

      event.preventDefault();

      this.toast.warning(
        'Copy action is disabled'
      );
    }

    // ==========================================
    // PASTE
    // ==========================================
    if (
      (isCtrl || isCommand) &&
      key === 'v'
    ) {

      event.preventDefault();

      this.toast.warning(
        'Paste action is disabled'
      );
    }

    // ==========================================
    // CUT
    // ==========================================
    if (
      (isCtrl || isCommand) &&
      key === 'x'
    ) {

      event.preventDefault();

      this.toast.warning(
        'Cut action is disabled'
      );
    }

    // ==========================================
    // SELECT ALL
    // ==========================================
    if (
      (isCtrl || isCommand) &&
      key === 'a'
    ) {

      event.preventDefault();

      this.toast.warning(
        'Select all is disabled'
      );
    }

    // ==========================================
    // SAVE PAGE
    // ==========================================
    if (
      (isCtrl || isCommand) &&
      key === 's'
    ) {

      event.preventDefault();

      this.toast.warning(
        'Save action is restricted'
      );
    }

    // ==========================================
    // VIEW SOURCE
    // ==========================================
    if (
      (isCtrl || isCommand) &&
      key === 'u'
    ) {

      event.preventDefault();

      this.toast.warning(
        'Viewing source is restricted'
      );
    }

    // ==========================================
    // DEVTOOLS
    // ==========================================
    if (
      event.key === 'F12' ||

      ((isCtrl || isCommand) &&
        event.shiftKey &&
        key === 'i')
    ) {

      event.preventDefault();

      this.toast.warning(
        'Developer tools are restricted'
      );
    }

    // ==========================================
    // PRINT SCREEN
    // ==========================================
    if (event.key === 'PrintScreen') {

      event.preventDefault();

      this.toast.warning(
        'Screenshots are restricted'
      );
    }
  }

  // ==========================================
  // LOGIN SUBMIT
  // ==========================================
  submit(): void {

    const username = this.form.value.username || '';
    const password = this.form.value.password || '';

    // USERNAME VALIDATION
    if (!username.trim()) {
      this.toast.warning('Username is required');
      return;
    } 
    if (username.length > 50) {
      this.toast.warning('Username must not exceed 50 characters');
      return;
    }
// USERNAME FORMAT VALIDATION
if (!/^[A-Za-z0-9_]+$/.test(username)) {

  this.toast.warning(
    'Invalid Username'
  );

  return;
}
    // NO SPACES IN USERNAME
    if (/\s/.test(username)) {
      this.toast.warning('Username cannot contain spaces');
      return;
    }
    // PASSWORD REQUIRED
    if (!password.trim()) {
      this.toast.warning('Password is required');
      return;
    }

    // SPECIAL CHARACTER VALIDATION
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      this.toast.warning(
        'Password must contain at least 1 special character'
      );
      return;
    }

    // UPPERCASE VALIDATION
    if (!/[A-Z]/.test(password)) {
      this.toast.warning(
        'Password must contain at least 1 uppercase letter'
      );
      return;
    }

    // Numerical validation
    if (!/[0-9]/.test(password)) {
      this.toast.warning(
        'Password must contain at least 1 number'
      );
      return;
    }

    // FORM INVALID
    if (this.form.invalid) {
      this.toast.warning('Please enter valid credentials');
      return;
    }

    const { userType } = this.form.value;

   this.auth.login(userType!, username, password).subscribe({

     next: (res:any) => {

       // ✅ SUCCESS TOAST
       this.toast.success(res?.message || 'Login successful');

       this.router.navigateByUrl('/app/dashboard');
     },

     error: (err) => {

       // 401 UNAUTHORIZED
       if (err.status === 401) {
         this.toast.error('Invalid Username');
         return;
       }

       // SERVER ERROR
       if (err.status === 500) {
         this.toast.error('Server error occurred');
         return;
       }

       // NETWORK ERROR
       if (err.status === 0) {
         this.toast.error('Unable to connect to server');
         return;
       }

       // DEFAULT ERROR
       this.toast.error(
         err?.error?.message ||
         'Something went wrong'
       );

       console.error('Login error', err);
     }
   });
  }
  // ==========================================
  // LIVE USERNAME VALIDATION
  // ==========================================
  onUsernameInput(): void {
    const username = this.form.value.username || '';

    if (username.length > 50) {
      this.toast.warning('Username must not exceed 50 characters');
    }
  }
  // ==========================================
  // LIVE PASSWORD VALIDATION
  // ==========================================
  onPasswordInput(): void {

    const password = this.form.value.password || '';

    // SPECIAL CHARACTER CHECK
    if (password.length > 0 &&
        !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {

      this.toast.warning(
        'Password must contain at least 1 special character'
      );
    }

    // UPPERCASE CHECK
    if (password.length > 0 &&
        !/[A-Z]/.test(password)) {

      this.toast.warning(
        'Password must contain at least 1 uppercase letter'
      );
    }
  }
}
