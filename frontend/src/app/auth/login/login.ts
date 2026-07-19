import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  errorMessage = '';

  onSubmit(): void {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;
    this.auth.login(username!, password!).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => (this.errorMessage = 'Неверный логин или пароль')
    });
  }
}