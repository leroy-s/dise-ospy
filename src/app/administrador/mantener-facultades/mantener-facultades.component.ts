import { EscuelaService } from './service/escuela.service';
import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Campus } from './models/campus';
import { Facultad } from './models/facultad';
import { Escuela } from './models/escuela';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FacultadService } from './service/facultad.service';
import { CampusService } from './service/campus.service';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-mantener-facultades',
  standalone: true,
  imports: [
    FormsModule,
     CommonModule,
      ButtonModule,
      TableModule,
      DialogModule,
      ToastModule,
      InputTextModule
  ],
  templateUrl: './mantener-facultades.component.html',
  styleUrl: './mantener-facultades.component.css'
})
export class MantenerFacultadesComponent implements OnInit {
  campusList: Campus[] = [];
  facultades: Facultad[] = [];
  escuelas: Escuela[] = [];

  selectedCampusId?: number;
  selectedFacultadId?: number;

  displayDialog = false;
  newItem: any = {};
  dialogMode: 'campus' | 'facultad' | 'escuela' = 'campus';

  constructor(
    private campusService: CampusService,
    private facultadService: FacultadService,
    private escuelaService: EscuelaService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadCampus();
  }

  loadCampus() {
    this.campusService.getCampus().subscribe({
      next: (data: Campus[]) => (this.campusList = data),
      error: (error: any) => this.showError('Error al cargar campus')
    });
  }

  selectCampus(campusId: number) {
    this.selectedCampusId = campusId;
    this.selectedFacultadId = undefined; // Reiniciar la facultad seleccionada al cambiar el campus
    this.facultades = [];
    this.loadFacultades(campusId);
  }

  loadFacultades(campusId: number) {
    this.facultadService.getFacultadesByCampus(campusId).subscribe({
      next: (data) => (this.facultades = data),
      error: () => this.showError('Error al cargar facultades')
    });
  }

  selectFacultad(facultadId: number) {
    this.selectedFacultadId = facultadId;
    this.escuelas = [];
    this.loadEscuelas(facultadId);
  }

  loadEscuelas(facultadId: number) {
    this.escuelaService.getEscuelasByFacultad(facultadId).subscribe({
      next: (data) => (this.escuelas = data),
      error: () => this.showError('Error al cargar escuelas')
    });
  }

  showCreateDialog(type: 'campus' | 'facultad' | 'escuela') {
    this.dialogMode = type;
    this.newItem = {};
    this.displayDialog = true;
  }

  saveNewItem() {
    let request: Observable<Campus | Facultad | Escuela> | undefined;

    switch (this.dialogMode) {
      case 'campus':
        request = this.campusService.createCampus(this.newItem);
        break;
      case 'facultad':
        if (this.selectedCampusId) {
          this.newItem.idCampus = this.selectedCampusId;
          request = this.facultadService.createFacultad(this.newItem);
        } else {
          this.showError('Debe seleccionar un campus antes de crear una facultad');
        }
        break;
      case 'escuela':
        if (this.selectedFacultadId) {
          this.newItem.idFacultad = this.selectedFacultadId;
          request = this.escuelaService.createEscuela(this.newItem);
        } else {
          this.showError('Debe seleccionar una facultad antes de crear una escuela');
        }
        break;
    }

    if (request) {
      request.subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Elemento creado' });
          this.refreshCurrentView();
          this.displayDialog = false;
        },
        error: () => this.showError('Error al crear elemento')
      });
    }
  }

  private refreshCurrentView() {
    this.loadCampus();
    if (this.selectedCampusId) {
      this.loadFacultades(this.selectedCampusId);
    }
    if (this.selectedFacultadId) {
      this.loadEscuelas(this.selectedFacultadId);
    }
  }

  private showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000 // Mostrar el mensaje por 5 segundos
    });
  }
}
