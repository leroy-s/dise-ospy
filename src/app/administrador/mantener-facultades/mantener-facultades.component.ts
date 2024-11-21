import { Component } from '@angular/core';
import { Campus } from '../models/campus';
import { Facultad } from '../models/facultad';
import { Escuela } from '../models/escuela';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { EscuelaService } from '../services/escuela.service';
import { FacultadService } from '../services/facultad.service';
import { CampusService } from '../services/campus.service';

@Component({
  selector: 'app-mantener-facultades',
  standalone: true,
  imports: [
    FormsModule,
     CommonModule,
      ButtonModule,
      TableModule,
      DialogModule
  ],
  templateUrl: './mantener-facultades.component.html',
  styleUrl: './mantener-facultades.component.css'
})
export class MantenerFacultadesComponent {
  campusList: Campus[] = [];
  facultades: Facultad[] = [];
  escuelas: Escuela[] = [];
  itemsPerPage: number = 10;
  mostrarOptions: number[] = [10, 20, 50];
  searchQuery: string = '';

  selectedCampusId: number | null = null;
  selectedFacultadId: number | null = null;

  displayEditDialog: boolean = false;
  selectedSchool: Escuela | null = null;

  constructor(
    private campusService: CampusService,
    private facultadService: FacultadService,
    private escuelaService: EscuelaService
  ) {}

  ngOnInit() {
    this.loadCampus();
  }

  onBack() {
    console.log("Regresar");
  }

  onItemsPerPageChange() {
    console.log("Mostrar elementos:", this.itemsPerPage);
  }

  onSearch() {
    console.log("Buscar:", this.searchQuery);
  }

  loadCampus() {
    this.campusService.getCampus().subscribe(data => {
      this.campusList = data;
    });
  }

  selectCampus(campusId: number) {
    this.selectedCampusId = campusId;
    this.loadFacultades(campusId);
    this.facultades = [];
    this.escuelas = [];
  }

  onAddCampus() {
    const newCampus: Campus = { idCampus: 0, sede: 'New Campus' };
    this.campusService.createCampus(newCampus).subscribe(() => {
      this.loadCampus();
    });
  }

  editCampus(campus: Campus) {
    this.campusService.updateCampus(campus, campus.idCampus).subscribe(() => {
      this.loadCampus();
    });
  }

  deleteCampus(campusId: number) {
    this.campusService.deleteCampus(campusId).subscribe(() => {
      this.loadCampus();
    });
  }

  loadFacultades(campusId: number) {
    this.facultadService.getFacultadesByCampus(campusId).subscribe(data => {
      this.facultades = data;
    });
  }

  selectFacultad(facultadId: number) {
    this.selectedFacultadId = facultadId;
    this.loadEscuelas(facultadId);
    this.escuelas = [];
  }

  onAddFacultad() {
    if (this.selectedCampusId) {
      const newFacultad: Facultad = { idFacultad: 0, facultad: 'New Faculty', idCampus: this.selectedCampusId };
      this.facultadService.createFacultad(newFacultad).subscribe(() => {
        this.loadFacultades(this.selectedCampusId!);
      });
    }
  }

  editFacultad(facultad: Facultad) {
    this.facultadService.updateFacultad(facultad, facultad.idFacultad).subscribe(() => {
      if (this.selectedCampusId) {
        this.loadFacultades(this.selectedCampusId);
      }
    });
  }

  deleteFacultad(facultadId: number) {
    this.facultadService.deleteFacultad(facultadId).subscribe(() => {
      if (this.selectedCampusId) {
        this.loadFacultades(this.selectedCampusId);
      }
    });
  }

  loadEscuelas(facultadId: number) {
    this.escuelaService.getEscuelasByFacultad(facultadId).subscribe(data => {
      this.escuelas = data;
    });
  }

  onAddEscuela() {
    if (this.selectedFacultadId) {
      const newEscuela: Escuela = { idEP: 0, carrera: 'New Vocational School', idFacultad: this.selectedFacultadId };
      this.escuelaService.createEscuela(newEscuela).subscribe(() => {
        this.loadEscuelas(this.selectedFacultadId!);
      });
    }
  }

  editEscuela(escuela: Escuela) {
    this.selectedSchool = { ...escuela }; // Clona el objeto seleccionado para edición
    this.displayEditDialog = true; // Abre el diálogo de edición
  }

  saveSchool() {
    if (this.selectedSchool) {
      this.escuelaService.updateEscuela(this.selectedSchool, this.selectedSchool.idEP).subscribe(() => {
        if (this.selectedFacultadId) {
          this.loadEscuelas(this.selectedFacultadId);
        }
        this.displayEditDialog = false; // Cierra el diálogo después de guardar
        this.selectedSchool = null;
      });
    }
  }

  deleteEscuela(escuelaId: number) {
    this.escuelaService.deleteEscuela(escuelaId).subscribe(() => {
      if (this.selectedFacultadId) {
        this.loadEscuelas(this.selectedFacultadId);
      }
    });
  }
}
