import { Component, OnInit } from '@angular/core';
import { BeneficiarioService } from '../shared/beneficiario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ServerDataSource } from 'ng2-smart-table';
import { BeneficiarioHelper } from '../shared/beneficiario.helper';
import { forkJoin } from 'rxjs';
import { ModalShowComponent } from '../modal-show/modal-show.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-beneficiario-list-inativo',
  templateUrl: './beneficiario-list-inativo.component.html',
  styleUrls: ['./beneficiario-list-inativo.component.scss']
})
export class BeneficiarioListInativoComponent implements OnInit {

  source: ServerDataSource;
  settings = BeneficiarioHelper.getSettingsTableInativos();

  constructor(
    private beneficiarioService:BeneficiarioService,
    private toast:ToastrService,
    private router: Router,
    private modalService:NgbModal
    ) { }

  ngOnInit() {
    this.source = this.beneficiarioService.getAllBeneficiarioInativo();
  }

  onDelete($event){
    const beneficiario = $event.data;
    if(!window.confirm(`Deseja excluir o beneficiário "${beneficiario.nome_completo}" ? Esta operação não poderá ser desfeita.`)){
      return;
    }
    this.beneficiarioService.deleteBeneficiario(beneficiario.id).subscribe(
      res=>{
        this.toast.success(res.message);
        this.source.remove(beneficiario);
      },
      error=>{
        this.toast.error(error.error.error);
        console.log(error);
      }
    )
  }

  onReativar($event){
    const beneficiario = $event.data;
    if(!window.confirm(`Deseja reativar o beneficiário "${beneficiario.nome_completo}" ?`)){
      return;
    }

    this.beneficiarioService.reativarBeneficiario(beneficiario.id).subscribe(
      res=>{
        this.toast.success(res.message);
        this.source.remove(beneficiario);
      },
      error=>{
        this.toast.success(error.error.error);
        console.log(error);
      }
    )   
  }

  onCustom(event) {
    if (event.action === 'visualizar_beneficiario') {
      let beneficiario_id= event.data.id;
      forkJoin([this.beneficiarioService.buscaUsuario(beneficiario_id), this.beneficiarioService.getDocs(beneficiario_id)])
      .subscribe(results=>{
        const beneficiario= results[0];
        const docBeneficiarios= results[1];
        let  modalRef=this.modalService.open(ModalShowComponent,{container:".app"});
        modalRef.componentInstance.beneficiario= beneficiario;
        modalRef.componentInstance.docBeneficiarios= docBeneficiarios;
        //console.log('results',results)
      });
    }
  }

}
