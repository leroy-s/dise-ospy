

import { EscuelaService } from './../mantener-facultades/service/escuela.service';
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
import { Persona } from '../mantener-facultades/models/persona';

import { PersonaService } from '../services/persona.service';
import { UsuarioService } from '../services/usuario.service';
import { MessageService } from 'primeng/api';
import { RolesService } from '../services/roles.service';
import { FacultadService } from '../mantener-facultades/service/facultad.service';


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
export class GestionusuariosComponent {

}
