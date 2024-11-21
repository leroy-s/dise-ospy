import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'login-form',
    standalone: true,

    imports: [
        CommonModule,

        FormsModule,         // Necesario para [(ngModel)]
        InputTextModule,     // Campo de texto
        ButtonModule,        // Botón
        CheckboxModule
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  remember: boolean = false; // Variable para controlar el estado del checkbox

}
