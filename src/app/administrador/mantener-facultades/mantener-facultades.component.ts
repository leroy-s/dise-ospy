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
import { catchError } from 'rxjs/operators';

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
  providers: [MessageService], // Add MessageService to providers
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
      next: (data) => {
        console.log('Facultades cargadas:', data); // Para debugging
        this.facultades = data;
      },
      error: (error) => {
        console.error('Error al cargar facultades:', error);
        this.showError('Error al cargar facultades');
      }
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
    if (!this.validateNewItem()) {
      return;
    }

    let request: Observable<Campus | Facultad | Escuela>;

    switch (this.dialogMode) {
      case 'campus':
        request = this.campusService.createCampus(this.newItem);
        break;
      case 'facultad':
        if (!this.selectedCampusId) {
          this.showError('Debe seleccionar un campus');
          return;
        }
        this.newItem.idCampus = this.selectedCampusId;
        request = this.facultadService.createFacultad(this.newItem);
        break;
      case 'escuela':
        if (!this.selectedFacultadId) {
          this.showError('Debe seleccionar una facultad');
          return;
        }
        this.newItem.idFacultad = this.selectedFacultadId;
        request = this.escuelaService.createEscuela(this.newItem);
        break;
      default:
        return;
    }

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `${this.dialogMode} creado correctamente`
        });
        this.displayDialog = false;
        this.refreshCurrentView();  // Llamar a refreshCurrentView después de crear
      },
      error: (error) => {
        console.error(error);
        this.showError(`Error al crear ${this.dialogMode}`);
      }
    });
  }

  private validateNewItem(): boolean {
    const requiredField = this.dialogMode === 'campus' ? 'sede' :
                         this.dialogMode === 'facultad' ? 'nombre' :
                         'carrera';

    if (!this.newItem[requiredField]) {
      this.showError(`El campo ${requiredField} es requerido`);
      return false;
    }
    return true;
  }

  private refreshCurrentView() {
    switch (this.dialogMode) {
      case 'campus':
        this.loadCampus();
        break;
      case 'facultad':
        if (this.selectedCampusId) {
          this.loadFacultades(this.selectedCampusId);
        }
        break;
      case 'escuela':
        if (this.selectedFacultadId) {
          this.loadEscuelas(this.selectedFacultadId);
        }
        break;
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
