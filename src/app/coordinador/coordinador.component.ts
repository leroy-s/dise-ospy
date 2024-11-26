import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarcoordinadorComponent } from './sidebarcoordinador/sidebarcoordinador.component';
import { FormsModule } from '@angular/forms';
import { RedireccionamientoComponent } from './redireccionamiento/redireccionamiento.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coordinador',
  standalone: true,
  imports: [RouterOutlet,SidebarcoordinadorComponent, FormsModule, RedireccionamientoComponent, CommonModule],
  templateUrl: './coordinador.component.html',
  styleUrl: './coordinador.component.css'
})
export class CoordinadorComponent {
  title = 'app-clovalpy';
  isRedirected = false;
  redirectToSidebarcoordinador() {
    this.isRedirected = true;
  }
}
