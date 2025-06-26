import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadsComponent } from './uploads.component';
import { UploadsRoutingModule } from './uploads-routing.module';
import { FormsModule } from '@angular/forms';
import { ModeloComponent } from './modelo/modelo.component';
import { DocumentosNucleoComponent } from './documentos-nucleo/documentos-nucleo.component';

@NgModule({
  declarations: [UploadsComponent, ModeloComponent, DocumentosNucleoComponent],
  imports: [
    CommonModule,
    FormsModule,
    UploadsRoutingModule
  ]
})
export class UploadsModule { }
