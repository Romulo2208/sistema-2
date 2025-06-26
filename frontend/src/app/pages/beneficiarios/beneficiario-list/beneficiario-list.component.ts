import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServerDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { BeneficiarioService } from '../shared/beneficiario.service';
import { BeneficiarioHelper } from '../shared/beneficiario.helper';
import { Beneficiario } from '../shared/beneficiario.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ModalShowComponent } from '../modal-show/modal-show.component';
import { forkJoin } from 'rxjs';




@Component({
  selector: 'app-beneficiario-list',
  templateUrl: './beneficiario-list.component.html',
  styleUrls: ['./beneficiario-list.component.scss']
})
export class BeneficiarioListComponent implements OnInit {
  @ViewChild('modalDesactive') modalDesactive;
  source: ServerDataSource;
  settings = BeneficiarioHelper.getSettingsTable();
  public modalRef: NgbModalRef;
  private selectedRows: any = [];
 
  desactiveForm: FormGroup;
  private nameBeneficiarioOnDesactive: any;
  private submittingDesactive: boolean = false;

  constructor(private beneficiarioService: BeneficiarioService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    public modalService: NgbModal,
    private router: Router) { }

  ngOnInit() {
    this.source = this.beneficiarioService.getAllBeneficiarioNg();
    this.applyFilterPjp();    
    this.builddesactiveForm();   
  }

  private builddesactiveForm() {
    this.desactiveForm = this.formBuilder.group({
      beneficiario_id: [null],
      justificativa: [null, [Validators.required]],
    });
  }

  onCreate($event) {
    this.router.navigate(['beneficiarios/new/']);
  }

  onEdit($event) {
    this.router.navigate(['beneficiarios/edit/' + $event.data.id]);
  }

  onUserRowSelect(event): void {
    this.selectedRows = event.selected;
    //console.log(event)
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

  public applyFilterPjp() {
    let filterPjp = this.router.routerState.snapshot.root.queryParams.pjp;
    if (filterPjp == 1 || filterPjp == 0) {
      this.source.setFilter([{ field: 'pjp', search: filterPjp }]);
    }
  }

  prepareDesactiveOne($event) {
    const beneficiario = $event.data;
    this.desactiveForm.patchValue({ beneficiario_id: beneficiario.id });
    this.nameBeneficiarioOnDesactive = beneficiario.nome_completo;
    this.modalService.open(this.modalDesactive);
  }

  prepareDesactiveBath(event) {
    if (!this.selectedRows.length) {
      this.toast.error('Selecione algum registro!');
      return false;
    }
    this.desactiveForm.patchValue({ beneficiario_id: null });
    this.nameBeneficiarioOnDesactive = "";
    this.modalService.open(this.modalDesactive);
  }

  desactive() {
    this.submittingDesactive = true;
    if (this.desactiveForm.invalid) {
      setTimeout(() => {
        this.submittingDesactive = false;
      }, 2000);

      return false;
    }
    let beneficiario_id = this.desactiveForm.value.beneficiario_id;

    if (beneficiario_id) {
      this.desactiveOne(beneficiario_id);
    }
    else {
      this.desactiveBath();
    }

  }

  desactiveBath() {
    console.log(this.desactiveForm.value);
    console.log(this.selectedRows);
    let beneficiarios_id = this.selectedRows.map(beneficiario => beneficiario.id);
    let justificativa = this.desactiveForm.value.justificativa;
    this.beneficiarioService.desativarBathBeneficiario(beneficiarios_id, justificativa).subscribe(
      res => {
        this.modalService.dismissAll();
        this.toast.success(res.message);
        this.source.refresh();
        this.selectedRows=[]; 
        this.submittingDesactive = false;
      },
      error => {
        this.toast.error(error.error.error);
        console.log(error);
        this.submittingDesactive = false;
      }
    )
  }

  desactiveOne(beneficiario_id) {
    let justificativa = this.desactiveForm.value.justificativa;
    this.beneficiarioService.desativarBeneficiario(beneficiario_id, justificativa).subscribe(
      res => {
        this.modalService.dismissAll();
        this.toast.success(res.message);
        this.source.refresh();
        this.submittingDesactive = false;
      },
      error => {
        this.toast.error(error.error.error);
        console.log(error);
        this.submittingDesactive = false;
      }
    )
  }



}
