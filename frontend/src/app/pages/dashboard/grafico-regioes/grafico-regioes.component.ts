import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BeneficiarioService } from '../../beneficiarios/shared/beneficiario.service';

@Component({
  selector: 'app-grafico-regioes',
  templateUrl: './grafico-regioes.component.html',
  styleUrls: ['./grafico-regioes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GraficoRegioesComponent  implements OnInit{

  public multi: any[]; 

  public showXAxis = true;
  public showLegend = true;
  public showXAxisLabel = true;
  public showDataLabel = true; 
  public legendTitle = "Legenda";
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
  };

  constructor(private beneficiarioService: BeneficiarioService) {}

  ngOnInit() {
    this.buscaQuantitativoBeneficiarios();
  }

  buscaQuantitativoBeneficiarios(){
    this.beneficiarioService.getTotalBeneficiarios().subscribe(
      res=>{
       this.multi = res.multi;
      }
    )
  }



}
