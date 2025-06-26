import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadsComponent } from './uploads.component';
import { ModeloComponent } from './modelo/modelo.component';
import { DocumentosNucleoComponent } from './documentos-nucleo/documentos-nucleo.component';


const routes: Routes = [
  { path: '', component: UploadsComponent },
  { path: 'modelo', component: ModeloComponent },
  { path: 'nucleo', component: DocumentosNucleoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadsRoutingModule { }
