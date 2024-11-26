import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarcoordinadorComponent } from '../sidebarcoordinador/sidebarcoordinador.component'; 
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PracticanteEP } from '../models/practicante-ep/practicante-ep.module'; 
import { Practicas } from '../models/practica/practica.module'; 
import { DomSanitizer } from '@angular/platform-browser';
import { SafeUrlPipe } from './safe-url.pipe';

@Component({
  selector: 'app-requisitosdedocumentacion',
  standalone: true,

  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, AvatarModule],
  templateUrl: './requisitosdedocumentacion.component.html',
  styleUrl: './requisitosdedocumentacion.component.css'
})
export class RequisitosdedocumentacionComponent {
  practicantes: PracticanteEP[] = [];
  filteredPracticantes: PracticanteEP[] = [];
  selectedPracticante: PracticanteEP | null = null;
  searchQuery: string = '';
  selectedPractica: Practicas | null = null;
  showValidation = false;
  requisitosEstado = 'Completado'; // Esto puede cambiar dinámicamente según tu API
  tutorEmpresarialEstado = 'En revisión';
  currentView: string | null = null; // Permite que currentView sea 'string' o 'null'

  showPreview = false;
  pdfUrl: string = 'https://example.com/document.pdf';
  showCommentBox = false;
  userComment = '';

  toggleCommentBox() {
    this.showCommentBox = !this.showCommentBox;
  }
  setView(view: string| null): void {
    this.currentView = view; // Cambia la vista actual
  }


  
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Datos simulados
    this.practicantes = [
      {
        id: 1,
        escuelasprofesionales: { id: 1, carrera: 'Ingeniería de Sistemas', facultades: null },
        practicantes: {
          id: 1,
          año_estudio: '2024',
          personas: {
            id: 1,
            nombre: 'Juan',
            apellido: 'Pérez',
            correo_electronico: 'juan.perez@example.com',
            direccion: 'Calle Falsa 123',
            dni: '12345678',
            nacionalidad: 'Peruana',
            sexo: 'M',
            telefono: '987654321'
          }
        },
        semestre: '2024-1'
      },
      {
        id: 2,
        escuelasprofesionales: { id: 2, carrera: 'Derecho', facultades: null },
        practicantes: {
          id: 2,
          año_estudio: '2023',
          personas: {
            id: 2,
            nombre: 'Ana',
            apellido: 'Gómez',
            correo_electronico: 'ana.gomez@example.com',
            direccion: 'Av. Principal 456',
            dni: '87654321',
            nacionalidad: 'Peruana',
            sexo: 'F',
            telefono: '987654322'
          }
        },
        semestre: '2023-2'
      }
    ];

    // Inicializar los datos filtrados
    this.filteredPracticantes = this.practicantes;
  }

  filterPracticantes() {
    this.filteredPracticantes = this.practicantes.filter((practicante) =>
      `${practicante.practicantes.personas.nombre} ${practicante.practicantes.personas.apellido}`
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }

  selectPracticante(practicante: PracticanteEP) {
    this.selectedPracticante = practicante;

  }

  addEmoji(emoji: string) {
    this.userComment += emoji;
  }

  submitComment() {
    alert(`Comentario enviado: ${this.userComment}`);
    this.userComment = '';
    this.showCommentBox = false;
  }

  

  downloadDocument() {
    const link = document.createElement('a');
    link.href = this.pdfUrl;
    link.download = 'documento.pdf';
    link.click();
  }


  togglePreview() {
    this.showPreview = !this.showPreview;
  }
  validateDocument() {
    this.showValidation = true; // Mostrar el mensaje de validación
    setTimeout(() => {
      this.showValidation = false; // Ocultar después de 4 segundos
    }, 4000);
  }
  
}
