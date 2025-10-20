import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      whatsappNumber: [''],
      shopLink: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : { mismatch: true };
  }

  get passwordMismatch(): boolean {
    return this.signupForm.hasError('mismatch');
  }

  onSubmit(): void {
    if (this.signupForm.valid && !this.passwordMismatch) {
      this.errorMessage = '';
      const { userName, email, password, phoneNumber, whatsappNumber, shopLink } = this.signupForm.value;
      this.authService.register({ userName, email, password, phoneNumber, whatsappNumber, shopLink }).subscribe({
        next: (user) => {
          this.authService.setUserName(user.userName);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Signup error:', error);
          if (error.error?.error?.issues) {
            // Handle Zod validation errors
            this.errorMessage = error.error.error.issues.map((issue: any) => issue.message).join(', ');
          } else if (error.error?.error) {
            // Handle other backend errors
            this.errorMessage = Array.isArray(error.error.error)
              ? error.error.error.map((err: any) => err.message).join(', ')
              : error.error.error;
          } else {
            this.errorMessage = 'Erreur lors de l\'inscription';
          }
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
    }
  }
}
