import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { DashboardComponent } from './dashboard.component';
import { GraficoBeneficiariosComponent } from './grafico-beneficiarios/grafico-beneficiarios.component';
import { GraficoBeneficiariosAcessoComponent } from './grafico-beneficiarios-acesso/grafico-beneficiarios-acesso.component';
import { GraficoRegioesComponent } from './grafico-regioes/grafico-regioes.component';
import { GraficoNucleosComponent } from './grafico-nucleos/grafico-nucleos.component';


export const routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PerfectScrollbarModule,
    NgxChartsModule,
    DirectivesModule
  ],
  declarations: [
    DashboardComponent,
    GraficoBeneficiariosComponent,
    GraficoBeneficiariosAcessoComponent,
    GraficoRegioesComponent,
    GraficoNucleosComponent
  ]
})

export class DashboardModule { }
