import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { ServerDataSource } from "ng2-smart-table";
import { forkJoin } from "rxjs";

import { RelatorioHelper } from "../shared/relatorio.helper";
import { RelatorioService } from "../shared/relatorio.service";
import { Beneficiario } from "../../beneficiarios/shared/beneficiario.model";

//.pdf
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

//.csv
import * as Papa from "papaparse";


//.xls
import * as XLSX from 'xlsx/xlsx';

@Component({
  selector: "app-relatorio-beneficiarios-escola",
  templateUrl: "./relatorio-beneficiarios-escola.component.html",
  styleUrls: ["./relatorio-beneficiarios-escola.component.scss"],
})
export class RelatorioBeneficiariosEscolaComponent implements OnInit {
  source: ServerDataSource;
  diaTurnoList: any;
  comarList: any;
  settings = RelatorioHelper.getSettingsTablePorEscola();
  public beneficiario: Beneficiario;
  pjp: any;
  valueSelected: number = 25;
  loadingData: boolean = true;
  totalBeneficiarios: number = 0;
  isActionFilter: boolean = false;//para indicar quando mudar o datasource dos dados da table
  filters: any[]=[];//armazenar os filtros
  elements: any[];//elementos que compoem o filtro

  constructor(private relatorioService: RelatorioService) {}

  ngOnInit() {
    this.source = this.relatorioService.getAllBeneficiarioNg();
    this.loadData();
    this.updateTotal();
    //ouvir os filtros do ngSmartTable
    this.source.onChanged().subscribe(change => {
      if (change.action === 'filter') {
        this.isActionFilter = true;
        this.elements = change.elements;
        this.filters = change.filter.filters;
        console.log('change',change);
        this.updateTotal();
      }
    });
    //fim da escuta dos filtros
  }

  async loadData() {
    try {
      const data = await this.source.getElements();
      if (data && data.length > 0) {
        this.loadingData = false;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.loadData();
      }
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
    }
  }

  setQtdPage() {
    this.source.setPaging(1, this.valueSelected, true);
  }

  updateTotal() {
    const params = this.filters.map(item => item.field + '_like=' + item.search);
    params.push('_page=1');
    params.push('_limit=1');
    const queryString = params.join('&');
    this.relatorioService.getTotalBeneficiarios(queryString).subscribe(total => {
      this.totalBeneficiarios = total;
    });
  }

  generatePDF() {
    let ArrayFiltro=this.filters.map(item=>item.field+"_like="+item.search);
    ArrayFiltro.push('_page=1');
    ArrayFiltro.push('_limit=100000');
    let queryString= ArrayFiltro.join("&");
   
    this.relatorioService.getBeneficiariosByFilter(queryString).subscribe(resp=>{
      let respostaMapeada= this.mapResponseToExport(resp);
      
      let tableData= [];
      let headerPdf= Object.keys(respostaMapeada[0]).map((title) => ({ text: title, style: "columnTitle" }) );    
      let bodyPdf= respostaMapeada.map((item)=>{
          return Object.values(item).map((title) => ({ text: title })  )
      })

      tableData.push(headerPdf);
      tableData.push(...bodyPdf);

     // console.log('tableData', tableData) 

      const docDefinitions = RelatorioHelper.getDocDefinitionPDF(tableData);
      pdfMake
        .createPdf(docDefinitions)
        .download(
          `${new Date().toLocaleDateString()}_RelatórioBeneficiários.pdf`
        );
      
       

   });

  }

  generateCSV() {
    //console.log('filters: ', this.filters);
    let ArrayFiltro=this.filters.map(item=>item.field+"_like="+item.search);
    ArrayFiltro.push('_page=1');
    ArrayFiltro.push('_limit=100000');
    let queryString= ArrayFiltro.join("&");
    this.relatorioService.getBeneficiariosByFilter(queryString).subscribe(resp=>{
      let respostaMapeada= this.mapResponseToExport(resp);
      
      const csv = Papa.unparse(respostaMapeada);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${new Date().toLocaleDateString()}_RelatorioBeneficiarios.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
        

   });  
}

generateXLS() {
  let ArrayFiltro = this.filters.map(item => item.field + "_like=" + item.search);
  ArrayFiltro.push('_page=1');
  ArrayFiltro.push('_limit=100000');
  let queryString = ArrayFiltro.join("&");
  this.relatorioService.getBeneficiariosByFilter(queryString).subscribe(resp => {
    let respostaMapeada = this.mapResponseToExport(resp);
    const ws = XLSX.utils.json_to_sheet(respostaMapeada);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

    const blob = new Blob([XLSX.write(wb, { type: "buffer", bookType: "xlsx" })], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${new Date().toLocaleDateString()}_RelatorioBeneficiarios.xlsx`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

}


  private mapResponseToExport(response:Array<any>){
    /*
      Colocar todos atributos desejados no export. O response possui toda a resposta.
      Utilizar aspas no nome atributo se for utilizar espaço ou acento.
    */
      let frequenciaToTurnos=(frequencia)=>{
        return frequencia.map(fr=>fr.turno.descricao).join(' | ');
      };
      return response.map(resp=>{
        return {
          id:resp.id,
          "Nome Completo":resp.nome_completo,
          "CPF":resp.cpf,
          "Data Nasc.":resp.data_nascimento,
          "Nome Mãe":resp.nome_mae,
          "Nome Pai":resp.nome_pai,
          "Nome Responsável":resp.nome_responsavel,
          "Parentesco": resp.grau_parentesco_responsavel,
          "Comar": resp.comar_descricao,
          "Núcleo": resp.nucleo_descricao,
          "Município": resp.municipio,
          "UF": resp.uf,
          "É PJP?":  resp.pjp > 0 ? "Sim" : "Não",
          "Escola": resp.escola_nome,
          "Turno": frequenciaToTurnos(resp.frequencia_beneficiarios)
        }
      });
  }

}


