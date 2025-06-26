import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages/pages.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { LoggedinGuard } from './pages/security/loggedin.guard';
import { LogoutComponent } from './pages/security/logout.component';

export const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [

      { path: '', loadChildren: './pages/dashboard/dashboard.module#DashboardModule',
        data: { breadcrumb: 'Dashboard', module_slug:'dashboard'},
        canLoad: [LoggedinGuard], canActivate: [LoggedinGuard]
      },

      {
        path: 'uploads',
        loadChildren: './pages/uploads/uploads.module#UploadsModule',
        data: { breadcrumb: 'Upload de Documentos', module_slug: 'upload' }
      },

      { 
        path: 'documents',
        loadChildren: './pages/documents/documents.module#DocumentsModule', 
        data: { breadcrumb: 'Documentos' , module_slug:'documentos'} , 
        
      },

      { 
        path: 'relatorios', 
        loadChildren: './pages/relatorios/relatorios.module#RelatoriosModule', 
        data: { breadcrumb: 'Relatórios' , module_slug: 'relatorios'} , 
      },

      { 
        path: 'membership',
        loadChildren: './pages/membership/membership.module#MembershipModule', 
        data: { breadcrumb: 'Membership', module_slug:'membership' } , 
        canLoad: [LoggedinGuard], canActivate: [LoggedinGuard]
      },


      { path: 'form-elements', loadChildren: './pages/form-elements/form-elements.module#FormElementsModule', data: { breadcrumb: 'Form Elements' } , canActivate: [LoggedinGuard]},
      { path: 'blank', component: BlankComponent, data: { breadcrumb: 'Blank page' } , canActivate: [LoggedinGuard]},

      { 
        path: 'beneficiarios', 
        loadChildren: './pages/beneficiarios/beneficiarios.module#BeneficiariosModule', 
        data: { breadcrumb: 'Beneficiários' , module_slug:'beneficiarios'} , 
        canLoad: [LoggedinGuard], canActivate: [LoggedinGuard]
      },

      { 
        path: 'monitores',
        loadChildren: './pages/monitores/monitores.module#MonitoresModule', 
        data: { breadcrumb: 'Monitores' , module_slug:'monitores'} , 
        
      },


      {
        path: 'deficiencias', loadChildren: './pages/deficiencias/deficiencias.module#DeficienciasModule',
        data: { breadcrumb: 'Deficiências', module_slug:'deficiencias'},
        canLoad: [LoggedinGuard], canActivate: [LoggedinGuard]
      },

      
      { path: 'nucleos', 
        loadChildren: './pages/nucleos/nucleos.module#NucleosModule', 
        data: { breadcrumb: 'Núcleos', module_slug:'nucleos' } , 
        canActivate: [LoggedinGuard], canLoad: [LoggedinGuard]
      },

   
      {
        path: 'usuarios', loadChildren: './pages/users/users.module#UsersModule',
        data: { breadcrumb: 'Usuários', module_slug:'usuarios'},
        canLoad: [LoggedinGuard], canActivate: [LoggedinGuard]
      },

      
      {
        path: 'acl', loadChildren: './pages/acl/acl.module#AclModule',
        data: { breadcrumb: 'Controle de Permissões', module_slug:'acl'},
        canLoad: [LoggedinGuard], canActivate: [LoggedinGuard]
      },

      

    ]
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginModule' },
  { path: 'logout', component:LogoutComponent},
  { path: 'register', loadChildren: './pages/register/register.module#RegisterModule' },
  { path: '**', component: NotFoundComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules,
  // useHash: true
});