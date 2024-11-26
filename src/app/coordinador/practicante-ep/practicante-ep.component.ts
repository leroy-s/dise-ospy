import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RouterLink, RouterModule } from '@angular/router';



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

import { PracticanteEPService } from './services/practicante-ep.service';


import { MessageService } from 'primeng/api';
import { EscuelaProfesional, Facultad, IPracticante } from './model/usuarioprac-tutor';

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
  usuariosTemporales: Array<{
    nombre: string;
    apellido: string;
    correoElectronico: string;
    dni: string;
    telefono: string;
    direccion: string;
    sexo: string;
    nacionalidad: string;
    rol: string;
    escuela?: string;
    semestre?: string;
    linea?: string;
  }> = [];
  escuelaSeleccionada: EscuelaProfesional | null = null;
  dialogoCarreraVisible = false;
  indiceRolActual = 0;
  roles = [
    { nombre: 'PRACTICANTE' },
    { nombre: 'TUTOR' }
  ];
  rolActual = this.roles[0];
  lineas: any[] = [];
  facultades: Facultad[] = [];
  facultadSeleccionada: Facultad | null = null;
  escuelas: EscuelaProfesional[] = [];
  usuariosRegistrados: any[] = [];
  visible: boolean = false;

  // Agregar una variable temporal para la selección
  escuelaSeleccionadaTemp: EscuelaProfesional | null = null;
  facultadSeleccionadaTemp: Facultad | null = null;

  constructor(
    private practicanteService: PracticanteEPService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cargarLineas();
    this.cargarFacultades();
    this.cargarUsuariosRegistrados();
  }

  cargarLineas() {
    this.practicanteService.getLineas().subscribe({
      next: (data) => this.lineas = data,
      error: (error) => console.error('Error al cargar líneas:', error)
    });
  }

  cargarFacultades() {
    this.practicanteService.getFacultades().subscribe({
      next: (data) => {
        console.log('Facultades recibidas:', data); // Para debug
        if (Array.isArray(data)) {
          this.facultades = data;
        } else {
          console.error('La respuesta no es un array:', data);
          this.mostrarError('Formato de datos inválido');
        }
      },
      error: (error) => {
        console.error('Error al cargar facultades:', error);
        this.mostrarError('Error al cargar facultades: ' + error.message);
      }
    });
  }

  onFacultadChange(event: any) {
    console.log('Evento de cambio de facultad:', event); // Debug evento
    if (event.value?.id) {
      this.facultadSeleccionadaTemp = event.value;
      this.cargarEscuelasPorFacultad(event.value.id);
      this.escuelaSeleccionadaTemp = null;
    }
  }

  cargarEscuelasPorFacultad(facultadId: number) {
    this.escuelas = []; // Limpiar escuelas anteriores
    this.practicanteService.getEscuelasByFacultad(facultadId).subscribe({
      next: (data) => {
        console.log('Escuelas recibidas:', data); // Para debug
        if (Array.isArray(data)) {
          this.escuelas = data.map(escuela => ({
            ...escuela,
            nombre: escuela.nombre || escuela.carrera // Fallback al campo carrera si nombre está vacío
          }));
        } else {
          console.error('Respuesta de escuelas no válida:', data);
          this.mostrarError('Formato de datos de escuelas inválido');
        }
      },
      error: (error) => {
        console.error('Error al cargar escuelas:', error);
        this.mostrarError(`Error al cargar escuelas: ${error.message || 'Error desconocido'}`);
      }
    });
  }

  cargarUsuariosRegistrados() {
    this.practicanteService.getPracticantes().subscribe({
      next: (data) => {
        this.usuariosRegistrados = data.map(practicante => ({
          ...practicante,
          rol: 'PRACTICANTE',
          escuela: this.escuelaSeleccionada?.nombre || 'No asignada',
          semestre: this.semestreSeleccionado || '2024-I'
        }));
      },
      error: (error) => {
        console.error('Error al cargar practicantes:', error);
        this.mostrarError('Error al cargar la lista de practicantes');
      }
    });
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
        // Convertir el usuario temporal a IPracticante
        const practicante: IPracticante = {
          username: `practicante${new Date().getFullYear()}${Math.floor(Math.random() * 1000)}`,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          correoElectronico: usuario.correoElectronico,
          dni: usuario.dni,
          telefono: usuario.telefono,
          direccion: usuario.direccion,
          sexo: usuario.sexo,
          nacionalidad: usuario.nacionalidad,
          codigo: `${new Date().getFullYear()}001`,
          añoEstudio: this.semestreSeleccionado || '2024-I',
          escuelaId: this.escuelaSeleccionada!.id,
          lineaId: this.lineaSeleccionada.id
        };
        this.registrarPracticante(practicante);
      } else {
        this.registrarTutor(usuario);
      }
    });
  }

  registrarPracticante(practicante: IPracticante) {
    if (!this.escuelaSeleccionada?.id || !this.lineaSeleccionada?.id) {
      this.mostrarError('Seleccione una escuela y una línea');
      return;
    }

    this.practicanteService.createPracticante(practicante).subscribe({
      next: (response) => {
        this.mostrarMensajeExito('Practicante registrado exitosamente');
        this.usuariosTemporales = [];
        this.cargarUsuariosRegistrados(); // Recargar la lista después de crear
      },
      error: (error) => {
        console.error('Error al registrar:', error);
        this.mostrarError('Error al registrar practicante');
      }
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

  // Modificar el método para confirmar la selección
  confirmarSeleccionEscuela() {
    if (this.escuelaSeleccionadaTemp) {
      this.escuelaSeleccionada = this.escuelaSeleccionadaTemp;
      this.facultadSeleccionada = this.facultadSeleccionadaTemp;
      this.dialogoCarreraVisible = false;
      this.mostrarMensajeExito('Escuela seleccionada correctamente');
    } else {
      this.mostrarError('Debe seleccionar una escuela');
    }
  }

  // Método para cancelar la selección
  cancelarSeleccionEscuela() {
    this.escuelaSeleccionadaTemp = null;
    this.facultadSeleccionadaTemp = null;
    this.dialogoCarreraVisible = false;
  }

  // Modificar el método para abrir el diálogo
  mostrarDialogoEscuela() {
    this.escuelaSeleccionadaTemp = this.escuelaSeleccionada;
    this.facultadSeleccionadaTemp = this.facultadSeleccionada;
    this.dialogoCarreraVisible = true;
  }

}
