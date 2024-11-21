import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Persona } from '../models/persona';
import { Usuario } from '../models/usuario';
import { PersonaService } from '../services/persona.service';
import { UsuarioService } from '../services/usuario.service';
import { MessageService } from 'primeng/api';
import { RolesService } from '../services/roles.service';
import { FacultadService } from '../services/facultad.service';
import { EscuelaService } from '../services/escuela.service';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [
    CommonModule,
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
    ListboxModule

  ],
  templateUrl: './gestionusuarios.component.html',
  styleUrl: './gestionusuarios.component.css'
})
export class GestionusuariosComponent implements OnInit{
  searchQuery: string = '';
  visible: boolean = false;
  persona: Persona = new Persona();
  personas: Persona[] = [];
  usuario: Usuario = new Usuario();
  usuarios: Usuario[] = [];
  roles: any[] = []; // Lista de roles obtenida de la base de datos
  carreras: any[] = []; // Datos de carreras obtenidos de la API
  facultades: any[] = []; // Facultades filtradas por carrera seleccionada
  selectedCarrera: any;
  selectedFacultad: any;
  temporaryUsers: Persona[] = [];
  carreraDialogVisible = false;

  showList = false;
  selectedItem: any = null; // Variable para almacenar el ítem seleccionado
  currentRoleIndex: number = 0;
  currentRole: any = { nombre: 'Vacío' }; // Rol actual a mostrar si no hay selección

  constructor(
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private rolesService: RolesService,
    private facultadService: FacultadService,
    private escuelaService: EscuelaService
  ) {}

  ngOnInit(): void {
    this.listarPersonas();
    this.listarUsuarios();
    this.cargarCarreras(); // Cargar carreras al iniciar
  }

  // Método para cargar carreras desde la API
  cargarCarreras() {
    this.escuelaService.getEscuela().subscribe(
      (data: any[]) => {
        this.carreras = data;
      },
      (error) => {
        console.error('Error al cargar carreras', error);
      }
    );
  }

  // Método para cargar roles desde la API según la carrera seleccionada
  cargarRoles() {
    if (!this.selectedCarrera) {
      this.roles = [];
      this.currentRole = { nombre: 'Vacío' };
      return;
    }

    this.rolesService.getRoles().subscribe(
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
    this.facultadService.getFacultadesByCampus(this.selectedCarrera.id).subscribe(
      (data: any[]) => {
        this.facultades = data;
      },
      (error) => {
        console.error('Error al cargar facultades', error);
      }
    );
    this.cargarRoles(); // Cargar roles después de seleccionar una carrera
  }

  confirmSelection() {
    this.carreraDialogVisible = false;
    this.listarUsuarios();
  }

  cancelSelection() {
    this.carreraDialogVisible = false;
    this.selectedCarrera = null;
    this.selectedFacultad = null;
    this.roles = [];
    this.currentRole = { nombre: 'Vacío' };
  }

  // Navegación entre roles
  previousRole() {
    if (this.roles.length > 0) {
      this.currentRoleIndex = (this.currentRoleIndex - 1 + this.roles.length) % this.roles.length;
      this.currentRole = this.roles[this.currentRoleIndex];
    }
  }

  nextRole() {
    if (this.roles.length > 0) {
      this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
      this.currentRole = this.roles[this.currentRoleIndex];
    }
  }

  listarPersonas() {
    this.personaService.getPersona().subscribe(
      (data: Persona[]) => {
        this.personas = data;
      },
      (error) => {
        console.error('Error al obtener personas', error);
      }
    );
  }

  listarUsuarios() {
    this.usuarioService.getUsuario().subscribe(
      (data: Usuario[]) => {
        this.usuarios = data;
      },
      (error) => {
        console.error('Error al obtener usuarios', error);
      }
    );
  }

  agregarPersona() {
    if (!this.persona.dni || !this.persona.nombre || !this.persona.apellido || !this.persona.correo) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos son obligatorios.',
      });
      return;
    }

    if (this.persona.id === 0) {
      this.personaService.createPersona(this.persona).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: 'Persona registrada',
          });
          this.listarPersonas();
          this.visible = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo agregar la persona',
          });
        }
      });
    } else {
      this.personaService.updatePersona(this.persona, this.persona.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: 'Persona actualizada',
          });
          this.listarPersonas();
          this.visible = false;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar la persona',
          });
        }
      });
    }
  }

  agregarUsuario() {
    if (!this.usuario.usuario || !this.usuario.clave || !this.persona.dni) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos son obligatorios.',
      });
      return;
    }

    this.usuario.persona = this.persona;

    if (this.usuario.id === 0) {
      this.usuarioService.createUsuario(this.usuario).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: 'Usuario registrado',
          });
          this.listarUsuarios();
          this.usuario = new Usuario();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo agregar el usuario',
          });
        }
      });
    } else {
      this.usuarioService.updateUsuario(this.usuario, this.usuario.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: 'Usuario actualizado',
          });
          this.listarUsuarios();
          this.usuario = new Usuario();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el usuario',
          });
        }
      });
    }
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
    this.persona = new Persona();
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
    const nuevosUsuarios = this.temporaryUsers.map(persona => {
      let usuario = new Usuario();
      usuario.persona = persona;
      usuario.usuario = `${persona.nombre}.${persona.apellido}`.toLowerCase();
      usuario.clave = 'defaultClave';
      usuario.estado = 'activo';
      return usuario;
    });

    this.usuarios = [...this.usuarios, ...nuevosUsuarios];
    this.temporaryUsers = [];
    this.messageService.add({
      severity: 'success',
      summary: 'Confirmado',
      detail: 'Usuarios temporales confirmados y agregados a la lista principal',
    });
  }

  editarUsuario(usuario: Usuario) {
    this.usuario = { ...usuario };
    this.persona = usuario.persona;
    this.visible = true;
  }

  generateUser() {
    if (this.persona.nombre && this.persona.apellido) {
      this.usuario.usuario = `${this.persona.nombre}.${this.persona.apellido}`.toLowerCase();

      this.usuarioService.createUsuario(this.usuario).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario Creado',
            detail: 'El usuario ha sido generado y guardado correctamente.',
          });
          this.listarUsuarios();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el usuario.',
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor, ingrese nombre y apellido para generar el usuario.'
      });
    }
  }
  onBack() {
    this.showList = false;
    this.selectedItem = null; // Reinicia la selección al regresar
  }

  eliminarUsuario(id: number) {
    if (id > 0) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter((user) => user.id !== id);
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: 'Usuario eliminado correctamente',
          });
        },
        error: (err) => {
          console.error('Error al eliminar usuario', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el usuario',
          });
        }
      });
    }
  }
}
