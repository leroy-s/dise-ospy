import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../models/usuario/usuario.module';
import { PracticanteEP } from '../models/practicante-ep/practicante-ep.module';
import { RouterLink, RouterModule } from '@angular/router';

import { Persona } from '../models/persona/persona.module';
import { PersonaService } from '../services/persona.service';
import { UsuarioService } from '../services/usuario.service';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { ListboxModule } from 'primeng/listbox';
import { TableModule } from 'primeng/table';
import { PracticanteService } from '../services/practicante.service';
import { TutorService } from '../services/tutor.service';
import { Tutor } from '../models/tutor/tutor.module';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { SidebarcoordinadorComponent } from '../sidebarcoordinador/sidebarcoordinador.component';
import { PracticanteEPService } from './services/practicante-ep.service';

import { IEscuela, IUsuarioTemp } from './model/usuarioprac-tutor';
import { MessageService } from 'primeng/api';

@Component({

  selector: 'app-practicante-ep',
  standalone: true,
  imports: [CommonModule,

    RouterModule,

    FormsModule,
    CardModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    MessageModule,
    DropdownModule,
    AvatarModule,
    ListboxModule],
  templateUrl: './practicante-ep.component.html',
  styleUrls: ['./practicante-ep.component.css'],
  providers: [MessageService]

})
export class PracticanteEpComponent implements OnInit {
  persona = {
    nombre: '',
    apellido: '',
    correoElectronico: '',
    dni: '',
    telefono: '',
    direccion: '',
    sexo: 'M',
    nacionalidad: 'Peruana'
  };

  semestreSeleccionado: string = '';
  lineaSeleccionada: any = null;

  busqueda: string = '';
  usuariosTemporales: any[] = [];
  escuelaSeleccionada: any = null;
  dialogoCarreraVisible = false;
  indiceRolActual = 0;
  roles = [
    { nombre: 'PRACTICANTE' },
    { nombre: 'TUTOR' }
  ];
  rolActual = this.roles[0];
  lineas: any[] = [];
  escuelas: any[] = [];
  usuariosRegistrados: any[] = [];
  visible: boolean = false;

  constructor(
    private practicanteService: PracticanteEPService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cargarLineas();
    this.cargarEscuelas();
    this.cargarUsuariosRegistrados();
  }

  cargarLineas() {
    this.practicanteService.getLineas().subscribe({
      next: (data) => this.lineas = data,
      error: (error) => console.error('Error al cargar líneas:', error)
    });
  }

  cargarEscuelas() {
    this.practicanteService.getEscuelas().subscribe({
      next: (data) => this.escuelas = data,
      error: (error) => console.error('Error al cargar escuelas:', error)
    });
  }

  cargarUsuariosRegistrados() {
    // Simular carga de usuarios registrados - reemplazar con llamada real a API
    this.usuariosRegistrados = [
      { id: 1, nombre: 'Juan', apellido: 'Pérez', rol: 'PRACTICANTE', escuela: 'Ingeniería', semestre: '2023-II' },
      { id: 2, nombre: 'Ana', apellido: 'García', rol: 'TUTOR', escuela: 'Sistemas', semestre: '2023-II' },
      // ...más usuarios
    ];
  }

  agregarUsuarioTemporal() {
    if (!this.validarFormulario()) return;

    const usuario = {
      ...this.persona,
      rol: this.rolActual.nombre,
      escuela: this.escuelaSeleccionada?.nombre
    };

    this.usuariosTemporales.push(usuario);
    this.limpiarFormulario();
    this.mostrarMensajeExito('Usuario agregado temporalmente');
  }

  confirmarUsuarios() {
    if (!this.escuelaSeleccionada) {
      this.mostrarError('Seleccione una escuela');
      return;
    }

    this.usuariosTemporales.forEach(usuario => {
      if (usuario.rol === 'PRACTICANTE') {
        this.registrarPracticante(usuario);
      } else {
        this.registrarTutor(usuario);
      }
    });
  }

  registrarPracticante(datos: any) {
    const practicante = {
      ...datos,
      codigo: `${new Date().getFullYear()}001`,
      añoEstudio: this.semestreSeleccionado,
      escuelaId: this.escuelaSeleccionada.id,
      lineaId: this.lineaSeleccionada.id
    };

    this.practicanteService.createPracticante(practicante).subscribe({
      next: () => {
        this.mostrarMensajeExito('Practicante registrado exitosamente');
        this.usuariosTemporales = [];
      },
      error: (error) => this.mostrarError('Error al registrar practicante')
    });
  }

  registrarTutor(datos: any) {
    // Implementar cuando esté disponible la API de tutores
    console.log('Registro de tutor pendiente:', datos);
  }

  rolAnterior() {
    this.indiceRolActual = (this.indiceRolActual - 1 + this.roles.length) % this.roles.length;
    this.rolActual = this.roles[this.indiceRolActual];
    this.limpiarFormulario();
  }

  rolSiguiente() {
    this.indiceRolActual = (this.indiceRolActual + 1) % this.roles.length;
    this.rolActual = this.roles[this.indiceRolActual];
    this.limpiarFormulario();
  }

  private validarFormulario(): boolean {
    if (!this.persona.nombre || !this.persona.apellido) {
      this.mostrarError('Complete los campos requeridos');
      return false;
    }
    return true;
  }

  private limpiarFormulario() {
    this.persona = {
      nombre: '',
      apellido: '',
      correoElectronico: '',
      dni: '',
      telefono: '',
      direccion: '',
      sexo: 'M',
      nacionalidad: 'Peruana'
    };
  }

  private mostrarMensajeExito(mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: mensaje
    });
  }

  private mostrarError(mensaje: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: mensaje
    });
  }
  agregarTemporal() {
    if (!this.validarFormulario()) {
      this.mostrarError('Complete todos los campos requeridos');
      return;
    }

    const nuevoUsuario = {
      ...this.persona,
      rol: this.rolActual.nombre,
      escuela: this.escuelaSeleccionada?.nombre,
      semestre: this.semestreSeleccionado,
      linea: this.lineaSeleccionada?.nombre
    };

    this.usuariosTemporales.push(nuevoUsuario);
    this.mostrarMensajeExito('Usuario agregado a la lista temporal');
    this.limpiarFormulario();
  }

  eliminarTemporal(index: number) {
    this.usuariosTemporales.splice(index, 1);
    this.mostrarMensajeExito('Usuario eliminado de la lista temporal');
  }

  mostrarDialogo() {
    this.visible = true;
  }

}
