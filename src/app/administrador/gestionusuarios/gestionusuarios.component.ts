import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { GestionusuariosService } from './services/gestionusuarios.service';
import { EscuelaService } from '../mantener-facultades/service/escuela.service';
import { FacultadService } from '../mantener-facultades/service/facultad.service';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-persona',
  templateUrl: './gestionusuarios.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ListboxModule,
    DialogModule,
    AvatarModule,     // Add this
    TableModule,      // Add this
    ToastModule
  ],
  styleUrls: ['./gestionusuarios.component.css']
})
export class GestionusuariosComponent implements OnInit {
  searchQuery: string = '';
  visible: boolean = false;
  persona: any = {};
  usuario: any = {};
  usuarios: any[] = [];
  roles: string[] = ['COORDINADOR', 'DIRECTOR', 'DOCENTE'];
  selectedRole: string = 'COORDINADOR';
  carreras: any[] = [];
  facultades: any[] = [];
  selectedCarrera: any;
  selectedFacultad: any;
  temporaryUsers: any[] = [];
  carreraDialogVisible = false;
  currentRoleIndex: number = 0;
  currentRole: any = { nombre: 'COORDINADOR' };

  constructor(
    private messageService: MessageService,
    private gestionusuariosService: GestionusuariosService,
    private escuelaService: EscuelaService,
    private facultadService: FacultadService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.cargarFacultades();
    this.listarUsuarios(); // Add this line to load users on init
  }

  cargarCarreras() {
    this.escuelaService.getEscuela().subscribe(
      (data: any[]) => {
        console.log('Datos de carreras recibidos:', data);
        this.carreras = data.map(carrera => ({
          id: carrera.id,
          nombre: carrera.carrera // Cambiado de nombre a carrera para coincidir con el modelo
        }));
      },
      (error) => {
        console.error('Error al cargar carreras:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las carreras'
        });
      }
    );
  }

  cargarFacultades() {
    this.facultadService.getFacultades().subscribe(
      (data: any[]) => {
        console.log('Facultades recibidas:', data);
        this.facultades = data;
      },
      (error) => {
        console.error('Error al cargar facultades:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las facultades'
        });
      }
    );
  }

  loadCarrerasByFacultad() {
    if (!this.selectedFacultad) {
      this.carreras = [];
      return;
    }
    this.escuelaService.getEscuelasByFacultad(this.selectedFacultad.id).subscribe(
      (data: any[]) => {
        console.log('Carreras recibidas:', data);
        this.carreras = data;
      },
      (error) => {
        console.error('Error al cargar carreras:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las carreras'
        });
      }
    );
  }

  cargarRoles() {
    if (!this.selectedCarrera) {
      this.roles = [];
      this.currentRole = { nombre: 'Vacío' };
      return;
    }

    this.gestionusuariosService.getRoles().subscribe(
      (data: any[]) => {
        this.roles = data;
        if (this.roles.length > 0) {
          this.currentRole = this.roles[0];
          this.currentRoleIndex = 0;
        } else {
          this.currentRole = { nombre: 'Vacío' };
        }
      },
      (error) => {
        console.error('Error al obtener roles', error);
        this.currentRole = { nombre: 'Error al cargar roles' };
      }
    );
  }

  showCarreraDialog() {
    this.carreraDialogVisible = true;
  }

  loadFacultades() {
    if (!this.selectedCarrera) {
      this.facultades = [];
      return;
    }
    this.facultadService.getFacultades().subscribe(
      (data: any[]) => {
        console.log('Facultades recibidas:', data);
        this.facultades = data;
      },
      (error) => {
        console.error('Error al cargar facultades:', error);
      }
    );
    this.cargarRoles();
  }

  confirmSelection() {
    if (!this.selectedCarrera) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, seleccione una carrera'
      });
      return;
    }
    this.carreraDialogVisible = false;
    this.listarUsuarios();
  }

  cancelSelection() {
    this.carreraDialogVisible = false;
    this.selectedCarrera = null;
    this.selectedFacultad = null;
    this.carreras = [];
    this.roles = [];
    this.currentRole = { nombre: 'Vacío' };
  }

  previousRole() {
    this.currentRoleIndex = (this.currentRoleIndex - 1 + this.roles.length) % this.roles.length;
    this.selectedRole = this.roles[this.currentRoleIndex];
    this.currentRole = { nombre: this.selectedRole };
    this.clearForm();
  }

  nextRole() {
    this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
    this.selectedRole = this.roles[this.currentRoleIndex];
    this.currentRole = { nombre: this.selectedRole };
    this.clearForm();
  }

  listarUsuarios() {
    this.gestionusuariosService.getUsers().subscribe(
      (data) => {
        console.log('Usuarios recibidos:', data);
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios'
        });
      }
    );
  }

  addToTemporaryList() {
    if (!this.persona.nombre || !this.persona.apellido) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, complete los campos requeridos antes de agregar.',
      });
      return;
    }

    this.temporaryUsers.push({ ...this.persona });
    this.persona = {};
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Persona agregada a la lista temporal',
    });
  }

  removeFromTemporaryList(index: number) {
    this.temporaryUsers.splice(index, 1);
    this.messageService.add({
      severity: 'info',
      summary: 'Eliminado',
      detail: 'Persona eliminada de la lista temporal',
    });
  }

  confirmUsers() {
    if (!this.selectedCarrera || !this.currentRole) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Debe seleccionar una carrera y un rol'
      });
      return;
    }

    const promises = this.temporaryUsers.map(tempUser => {
      const baseUserData = {
        username: `${tempUser.nombre.toLowerCase().split(' ')[0]}.${tempUser.apellido.toLowerCase().split(' ')[0]}`,
        nombre: tempUser.nombre,
        apellido: tempUser.apellido,
        correoElectronico: tempUser.correo,
        dni: tempUser.dni,
        telefono: tempUser.telefono,
        carreraId: this.selectedCarrera.id
      };

      if (this.currentRole.nombre === 'DIRECTOR') {
        return this.gestionusuariosService.signUpDirector({
          ...baseUserData,
          firma: tempUser.firma || 'base64-firma', // Asegúrate de capturar estos valores del formulario
          sello: tempUser.sello || 'base64-sello'
        }).toPromise();
      } else {
        return this.gestionusuariosService.signUp({
          ...baseUserData,
          roles: [this.currentRole.nombre]
        }).toPromise();
      }
    });

    // Ejecutar todas las promesas
    Promise.all(promises)
      .then(responses => {
        console.log('Usuarios creados:', responses);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Se han registrado ${this.temporaryUsers.length} usuarios exitosamente`
        });
        this.temporaryUsers = []; // Limpiar la lista temporal
        this.listarUsuarios(); // Actualizar la lista después de crear usuarios
      })
      .catch(error => {
        console.error('Error al crear usuarios:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al registrar los usuarios'
        });
      });
  }

  handleFileUpload(event: any, type: 'firma' | 'sello') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (type === 'firma') {
          this.persona.firma = e.target.result.split(',')[1];
        } else {
          this.persona.sello = e.target.result.split(',')[1];
        }
      };
      reader.readAsDataURL(file);
    }
  }

  generateUser() {
    if (this.persona.nombre && this.persona.apellido) {
      const nombre = this.persona.nombre.toLowerCase().split(' ')[0];
      const apellido = this.persona.apellido.toLowerCase().split(' ')[0];
      this.usuario.usuario = `${nombre}.${apellido}`;
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Ingrese nombre y apellido para generar el usuario'
      });
    }
  }


  editarUsuario(usuario: any) {
    // Implementar edición de usuario si es necesario
  }

  eliminarUsuario(id: number) {
    // Implementar eliminación de usuario si es necesario
  }

  loadRoles() {
    // Si los roles vienen del backend, implementarlo aquí
    // Por ahora, usamos los roles definidos localmente
  }

  clearForm() {
    this.persona = {};
    this.usuario = {};
  }
}
