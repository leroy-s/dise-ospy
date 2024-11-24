import { EscuelaService } from './../mantener-facultades/service/escuela.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ListboxModule } from 'primeng/listbox';
import { FacultadService } from '../mantener-facultades/service/facultad.service';
import { RolesService } from '../services/roles.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-mantener-elementos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    ListboxModule
  ],
  templateUrl: './mantener-elementos.component.html',
  styleUrl: './mantener-elementos.component.css'
})
export class MantenerElementosComponent {
  roles: any[] = [];
  carreras: any[] = [];
  facultades: any[] = [];
  selectedFacultad: any;
  currentCarrera: any = { nombre: 'Seleccione una carrera' };
  carreraIndex: number = 0;
  carreraDialogVisible = false;
  showRoleForm = false;
  showGestionarSubventana = false;
  showInicioSubventana = false;

  roleForm = {
    nombre: '',
  };

  accesos = [
    { nombre: 'crear usuarios', seleccionado: false },
    { nombre: 'Gestionar', seleccionado: false },
    { nombre: 'vista de Inicio', seleccionado: false },
  ];

  gestionarItems = [
    { nombre: 'requerimientos de ppp', seleccionado: false },
    { nombre: 'Crear rubrica de evaluacion', seleccionado: false },
    { nombre: 'Plantillas', seleccionado: false },
    { nombre: 'calificar trabajos', seleccionado: false },
    { nombre: 'calificar rubros', seleccionado: false },
  ];

  inicioItems = [
    { nombre: 'calendario', seleccionado: false },
    { nombre: 'Seguimiento de usuario', seleccionado: false },
    { nombre: 'calendario_editor', seleccionado: false },
    { nombre: 'calendario_cor', seleccionado: false },
  ];

  editorIndex = 0;
  editores = [
    { nombre: 'vació' },
    { nombre: 'editor1' },
    { nombre: 'editor2' }
  ]; // Lista de editores de ejemplo
  selectedEditor: any = this.editores[this.editorIndex]; // Editor seleccionado

  constructor(
    private messageService: MessageService,
    private rolesService: RolesService,
    private facultadService: FacultadService,
    private EscuelaService: EscuelaService
  ) {}

  ngOnInit(): void {
    this.cargarFacultades();
  }

  cargarFacultades() {
    this.facultadService.getFacultades().subscribe(
      (data: any[]) => {
        this.facultades = data;
      },
      (error) => {
        console.error('Error al cargar facultades', error);
      }
    );
  }

  cargarCarreras() {
    if (!this.selectedFacultad) {
      this.carreras = [];
      this.currentCarrera = { nombre: 'Seleccione una carrera' };
      return;
    }

    this.EscuelaService.getEscuelasByFacultad(this.selectedFacultad.id).subscribe(
      (data: any[]) => {
        this.carreras = data;
        this.currentCarrera = this.carreras.length ? this.carreras[0] : { nombre: 'Sin carreras disponibles' };
        this.carreraIndex = 0;
      },
      (error) => {
        console.error('Error al cargar carreras', error);
        this.currentCarrera = { nombre: 'Error al cargar carreras' };
      }
    );
  }

  previousCarrera() {
    if (this.carreras.length > 0) {
      this.carreraIndex = (this.carreraIndex - 1 + this.carreras.length) % this.carreras.length;
      this.currentCarrera = this.carreras[this.carreraIndex];
    }
  }

  nextCarrera() {
    if (this.carreras.length > 0) {
      this.carreraIndex = (this.carreraIndex + 1) % this.carreras.length;
      this.currentCarrera = this.carreras[this.carreraIndex];
    }
  }

  // Métodos para navegar entre editores
  previousEditor() {
    if (this.editores.length > 0) {
      this.editorIndex = (this.editorIndex - 1 + this.editores.length) % this.editores.length;
      this.selectedEditor = this.editores[this.editorIndex];
    }
  }

  nextEditor() {
    if (this.editores.length > 0) {
      this.editorIndex = (this.editorIndex + 1) % this.editores.length;
      this.selectedEditor = this.editores[this.editorIndex];
    }
  }

  toggleRoleForm() {
    this.showRoleForm = !this.showRoleForm;
  }

  toggleSubventana(nombre: string) {
    if (nombre === 'Gestionar') {
      this.showGestionarSubventana = !this.showGestionarSubventana;
      this.showInicioSubventana = false;
    } else if (nombre === 'vista de Inicio') {
      this.showInicioSubventana = !this.showInicioSubventana;
      this.showGestionarSubventana = false;
    }
  }

  confirmForm() {
    // Implementar confirmación
  }

  clearForm() {
    this.roleForm = { nombre: '' };
    this.accesos.forEach(a => a.seleccionado = false);
    this.gestionarItems.forEach(i => i.seleccionado = false);
    this.inicioItems.forEach(i => i.seleccionado = false);
  }
  showFacultadDialog() {
    this.carreraDialogVisible = true; // o cualquier otra lógica que necesites para abrir el diálogo
}

}
