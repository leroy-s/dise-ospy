import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from './../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AuthResponse } from '../auth/AuthLoginRequest';

@Component({
    selector: 'login-form',
    standalone: true,

    imports: [
        CommonModule,
        ToastModule,
        FormsModule,         // Necesario para [(ngModel)]
        InputTextModule,     // Campo de texto
        ButtonModule,        // Botón
        CheckboxModule
    ],
    providers: [MessageService],
    templateUrl: './form.component.html',
    styleUrl: './form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  loginData = {
    username: '',
    password: '',
    remember: false
  };
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private MessageService: MessageService
  ) {}

  onSubmit(): void {
    if (!this.loginData.username || !this.loginData.password) {
      this.MessageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Complete todos los campos'
      });
      return;
    }

    this.loading = true;
    this.authService.login({
      username: this.loginData.username,
      password: this.loginData.password
    }).subscribe({
      next: (response: AuthResponse) => {
        if (response.status) {
          if (this.loginData.remember) {
            localStorage.setItem('remember_user', this.loginData.username);
          }
          this.router.navigate(['/sidebar']);
        } else {
          this.MessageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message || 'No tiene roles asignados'
          });
        }
      },
      error: (error: any) => {
        this.MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al conectar con el servidor'
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
