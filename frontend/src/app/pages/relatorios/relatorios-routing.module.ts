import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RelatorioBeneficiariosEscolaComponent } from "./relatorio-beneficiarios-escola/relatorio-beneficiarios-escola.component";
import { RelatorioBeneficiariosComponent } from "./relatorio-beneficiarios/relatorio-beneficiarios.component";

const routes: Routes = [
  {
    path: "beneficiarios",
    component: RelatorioBeneficiariosComponent,
    data: { breadcrumb: "Beneficiários Ativos" },
  },
  {
    path: "beneficiarios-escola",
    component: RelatorioBeneficiariosEscolaComponent,
    data: { breadcrumb: "Beneficiários por Escola" },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatoriosRoutingModule {}
