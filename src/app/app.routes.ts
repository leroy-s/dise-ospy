import { Routes } from '@angular/router';

import { AdministradorComponent } from './administrador/administrador.component';
import { CoordinadorComponent } from './coordinador/coordinador.component';
import { TutorComponent } from './tutor/tutor.component';
import { PracticanteComponent } from './practicante/practicante.component';
import { FormComponent } from './login/form/form.component';
import { DirectorComponent } from './director/director/director.component';
import { SecretariaComponent } from './secretaria/secretaria/secretaria.component';
import { MantenerFacultadesComponent } from './administrador/mantener-facultades/mantener-facultades.component';
import { MantenerElementosComponent } from './administrador/mantener-elementos/mantener-elementos.component';
import { HistorialComponent } from './administrador/historial/historial.component';
import { RedireccionamientoComponent } from './administrador/redireccionamiento/redireccionamiento.component';
import { SidebarComponent } from './administrador/sidebar/sidebar.component';
import { GestionusuariosComponent } from './administrador/gestionusuarios/gestionusuarios.component';

export const routes: Routes = [
  {
    path: 'login',
    component: FormComponent
  },
  //------------------------------------------------------------
  {
    path: 'administrador',
    component: AdministradorComponent,

  },

  {
      path: 'escuelafacultad',
      component:  MantenerFacultadesComponent,
      title: 'Componente de escuelas y facultades'
  }
  ,
  {
      path: 'elementos',
      component:  MantenerElementosComponent,
      title: 'Componente de roles'
  }
  ,
  {
      path: 'historial',
      component:  HistorialComponent,
      title: 'Componente de historiales'
  }
  ,
  {
      path: 'redireccionamiento',
      component:  RedireccionamientoComponent,
      title: 'Componente de redireccionamiento'
  }
  ,
  {
      path: 'sidebar',
      component: SidebarComponent,
      title: 'Sidebar',
      children:[
         {
          path: 'gestion-usuarios',
          component: GestionusuariosComponent,
         },
         {
           path: 'mantener-facultades',
           component: MantenerFacultadesComponent,
         },
         {
          path: 'elementos',
          component: MantenerElementosComponent,
         },
         {
          path: 'historial',
          component: HistorialComponent
         },

         {
          path :'**',
          redirectTo: 'gestion-usuarios'
         }

      ]

  }

  //-----------------------------------------------------------
  ,{
    path: 'coordinador',
    component: CoordinadorComponent,

  },
  {
    path: 'tutor',
    component: TutorComponent,

  },
  {
    path: 'practicante',
    component: PracticanteComponent,

  },
  {
    path: 'director',
    component: DirectorComponent,

  },
  {
    path: 'secretaria',
    component: SecretariaComponent,

  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }

];

