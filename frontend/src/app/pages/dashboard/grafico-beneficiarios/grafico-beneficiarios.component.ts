import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BeneficiarioService } from '../../beneficiarios/shared/beneficiario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grafico-beneficiarios',
  templateUrl: './grafico-beneficiarios.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GraficoBeneficiariosComponent implements OnInit{
  
  public single: any[];
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E']
  };
  public label = "Total de Beneficiários Ativos";

  constructor(
    private beneficiarioService: BeneficiarioService,
    private router:Router
  ) {}

  ngOnInit() {
    this.buscaQuantitativoBeneficiarios();
  }

  buscaQuantitativoBeneficiarios(){
    this.beneficiarioService.getTotalBeneficiarios().subscribe(
      res=>{
        this.single = res.single;
      }
    )
  }

  onSelect(event) {
    let filterPjp=event.name==="Beneficiários PJP"?'1':'0';
    this.router.navigateByUrl('beneficiarios?pjp='+filterPjp);
  }


}
