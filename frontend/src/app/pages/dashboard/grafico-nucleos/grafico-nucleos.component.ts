import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NucleoService } from '../../nucleos/shared/nucleo.service';

@Component({
  selector: 'app-grafico-nucleos',
  templateUrl: './grafico-nucleos.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GraficoNucleosComponent implements OnInit{
  
  public single: any[];
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060'] 
  }; 

  constructor(private nucleoService: NucleoService) {}
  
  ngOnInit() {
    this.buscaQuantitativoNucleos();
  }

  buscaQuantitativoNucleos(){
    this.nucleoService.getTotalNucleos().subscribe(
      res=>{
       this.single = res;
      }
    )
  }

}
