import { Routes } from '@angular/router';

import { AdministradorComponent } from './administrador/administrador.component';
import { CoordinadorComponent } from './coordinador/coordinador.component';
import { TutorComponent } from './tutor/tutor.component';
import { PracticanteComponent } from './practicante/practicante.component';
import { FormComponent } from './login/form/form.component';
import { DirectorComponent } from './director/director/director.component';
import { MantenerFacultadesComponent } from './administrador/mantener-facultades/mantener-facultades.component';
import { MantenerElementosComponent } from './administrador/mantener-elementos/mantener-elementos.component';
import { HistorialComponent } from './administrador/historial/historial.component';
import { RedireccionamientoComponent } from './administrador/redireccionamiento/redireccionamiento.component';
import { SidebarComponent } from './administrador/sidebar/sidebar.component';
import { GestionusuariosComponent } from './administrador/gestionusuarios/gestionusuarios.component';
import { authGuard } from './login/auth/guards/auth.guard';
import { SidebarcoordinadorComponent } from './coordinador/sidebarcoordinador/sidebarcoordinador.component';
import { HomeComponent } from './coordinador/home/home.component';
import { PracticanteEpComponent } from './coordinador/practicante-ep/practicante-ep.component';
import { RequisitosFinalesComponent } from './coordinador/requisitos-finales/requisitos-finales.component';
import { CartaPresentacionComponent } from './coordinador/carta-presentacion/carta-presentacion.component';
import { ValidacionComponent } from './coordinador/validacion/validacion.component';
import { ComienzopppComponent } from './coordinador/comienzoppp/comienzoppp.component';
import { SeguimientodeusuarioComponent } from './coordinador/seguimientodeusuario/seguimientodeusuario.component';
import { RequisitosdedocumentacionComponent } from './coordinador/requisitosdedocumentacion/requisitosdedocumentacion.component';
import { SidebarpracticanteComponent } from './practicante/sidebarpracticante/sidebarpracticante.component';
import { InicioComponent } from './practicante/inicio/inicio.component';
import { GestionarCartaPresentacionComponent } from './practicante/gestionar-carta-presentacion/gestionar-carta-presentacion.component';
import { AdministrarDocumentosComponent } from './practicante/administrar-documentos/administrar-documentos.component';
import { MisEvaluacionesComponent } from './practicante/mis-evaluaciones/mis-evaluaciones.component';
import { CorreoComponent } from './practicante/correo/correo.component';
import { SecretariaComponent } from './secretaria/secretaria.component';
import { SidebarsecretariaComponent } from './secretaria/sidebarsecretaria/sidebarsecretaria.component';
import { GestionDeCartasComponent } from './secretaria/gestion-de-cartas/gestion-de-cartas.component';
import { GestionReportesComponent } from './secretaria/gestion-reportes/gestion-reportes.component';
//Implementado a medias : Glender

export const routes: Routes = [
  {
    path: 'login',
    component: FormComponent
  },
  //------------------------------------------------------------


  {
      path: 'sidebar',
      component: SidebarComponent,
      title: 'Sidebar',
      canActivate: [authGuard],
      data: { roles: ['ADMIN'] },
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
    canActivate: [authGuard],
    data: { roles: ['COORDINADOR'] },
  },

  {
    path: 'sidebarcoordinador',
    component: SidebarcoordinadorComponent,
    title: 'Sidebarcoordinador',
   canActivate: [authGuard],
    data: { roles: ['COORDINADOR'] },
    children:[
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home',
      },
      {
        path: 'practicante-ep',
        component: PracticanteEpComponent,
        title: 'Formulario de usuarios',
      },
      {
        path: 'requisitos-finales',
        component: RequisitosFinalesComponent,
        title: 'Requisitos Finales ',
      },
      {
        path: 'carta-presentacion',
        component: CartaPresentacionComponent,
        title: 'Carta de presentacion',
      },
      {
      path: 'validacion',
      component: ValidacionComponent,
      title: 'Requerimientos de Practicas',
    },
    {
        path: 'comienzoppp',
        component: ComienzopppComponent,
        title: 'Comienzo de Practicas',
      },
      {
        path: 'seguimientodeusuario',
        component: SeguimientodeusuarioComponent,
        title: 'Seguimiento de usuario',
      },
      {
        path: 'requisitosdedocumentacion',
        component: RequisitosdedocumentacionComponent,
        title: 'Requerimientos de Documentacion',
      },
      {
        path :'home',
        redirectTo: ''
       }
    ]
  },

  {
    path: 'tutor',
    component: TutorComponent,
    canActivate: [authGuard],
    data: { roles: ['TUTOR'] }
  },


  {
    path: 'practicante',
    component: PracticanteComponent,

  },
  {
      path: 'sidebarpracticante',
      component: SidebarpracticanteComponent,
      title: 'Sidebarpracticante',
      canActivate: [authGuard],
      data: { roles: ['PRACTICANTE', 'ROLE_PRACTICANTE'] }, // Aceptamos ambos formatos
      children:[
        {
          path: 'inicio',
          component: InicioComponent,
          title: 'Componente inicio'
          },
          {
            path: 'cartappp',
            component:  GestionarCartaPresentacionComponent,
            title: 'Componente de cartas'
         },
         {
          path: 'documentacion',
          component:  AdministrarDocumentosComponent,
          title: 'Componente de documentos'
      }
      ,
      {
          path: 'evaluaciones',
          component:  MisEvaluacionesComponent,
          title: 'Componente de documentos'
      }
      ,
      {
          path: 'correo',
          component:  CorreoComponent,
          title: 'Componente de documentos'
      },
         {
          path :'**',
          redirectTo: ''
         }
      ]
    },
  {
    path: 'director',
    component: DirectorComponent,
    canActivate: [authGuard],
    data: { roles: ['DIRECTOR'] }
  },
  {
    path: 'secretaria',
    component: SecretariaComponent,
  }
  ,
  {
    path: 'sidebarsecretaria',
    component: SidebarsecretariaComponent,
    title: 'Sidebarsecretaria',
    children:[
      {
        path: 'gestion_cartas',
        component: GestionDeCartasComponent,
        title: 'Componente de cartas'
    }
    ,
    {
        path: 'reportes',
        component:  GestionReportesComponent,
        title: 'Componente de escuelas y facultades'
    },

       {
        path :'**',
        redirectTo: ''
       }

    ]
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

