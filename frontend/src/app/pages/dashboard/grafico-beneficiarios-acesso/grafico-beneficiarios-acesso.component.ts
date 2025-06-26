import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BeneficiarioService } from '../../beneficiarios/shared/beneficiario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grafico-beneficiarios-acesso',
  templateUrl: './grafico-beneficiarios-acesso.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GraficoBeneficiariosAcessoComponent implements OnInit{
  
  public single: any[];
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E']
  };
  public label = "Quantitativo de Beneficiários (Por Núcleo)";

  constructor(
    private beneficiarioService: BeneficiarioService,
    private router:Router
  ) {}

  ngOnInit() {
    this.buscaQuantitativoBeneficiarios();
  }

  buscaQuantitativoBeneficiarios(){
    this.beneficiarioService.getTotalBeneficiariosAcesso().subscribe(
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
