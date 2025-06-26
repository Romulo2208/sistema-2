import { Component, OnInit, SimpleChanges } from "@angular/core";
import { DefaultFilter } from "ng2-smart-table";
import { RelatorioService } from "../shared/relatorio.service";

@Component({
  selector: "app-select-turnos",
  template: `
    <ng-select
      [items]="options"
      bindLabel="descricao"
      bindValue="id"
      [ngClass]="{ multi_select: true }"
      [multiple]="true"
      [(ngModel)]="selectedOptions"
      (change)="onSelect($event)"
      placeholder="Selecione o Turno"
    >
    </ng-select>
  `,
})
export class SelectTurnosComponent extends DefaultFilter implements OnInit {
  selectedOptions: number[] = [];
  diaTurnoList: any[];
  options: any[];

  constructor(private relatorioService: RelatorioService) {
    super();
  }

  ngOnInit() {
    this.getDiaTurnos();
    // console.log(this.column.getFilterConfig());
  }

  private getDiaTurnos() {
    this.relatorioService.getDiaTurnos().subscribe(
      (data) => {
        this.options = data;
      },
      (error) => {
        console.error('Erro ao buscar os turnos:', error);
      }
    );
  }

  onSelect(evento) {
    this.query = this.selectedOptions.join(",");
    this.setFilter();
  }

  ngOnChanges(changes: SimpleChanges) {}
}
