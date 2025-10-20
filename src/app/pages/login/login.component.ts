import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          this.authService.setToken(response.token);
          this.authService.setUserName(response.user.userName);
          this.authService.setUserId(response.user.id);
          this.authService.setRole(response.user.role);
          const redirectPath = response.user.role === 'ADMIN' ? '/admin' : '/products';
          this.router.navigate([redirectPath]);
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Erreur lors de la connexion';
        }
      });
    }
  }
}
