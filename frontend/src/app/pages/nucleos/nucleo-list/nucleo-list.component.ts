import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ServerDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../login/login.service';
import { NucleoHelper } from '../shared/nucleo.helper';
import { Nucleo } from '../shared/nucleo.model';
import { NucleoService } from '../shared/nucleo.service';

@Component({
  selector: 'app-nucleo-list',
  templateUrl: './nucleo-list.component.html',
  styleUrls: ['./nucleo-list.component.scss']
})
export class NucleoListComponent implements OnInit {

  source: ServerDataSource;
  settings;
  public nucleo = Nucleo;
  public modalRef: NgbModalRef;

  constructor(private nucleoService:NucleoService,
              private toast:ToastrService,
              public modalService: NgbModal,
              private router: Router,
              private loginService:LoginService) { 

                const showBtnCreateNewNucleo = this.loginService.hasRole('admin') ||  this.loginService.hasRole('coordenador_geral') || this.loginService.hasRole('gestor_nacional') || this.loginService.hasRole('gestor_regional');
                const showBtnEditNewNucleo = this.loginService.hasRole('admin') ||  this.loginService.hasRole('coordenador_geral') || this.loginService.hasRole('gestor_nacional') || this.loginService.hasRole('gestor_regional');
                const showBtnDeleteNewNucleo = this.loginService.hasRole('admin') ||  this.loginService.hasRole('coordenador_geral') || this.loginService.hasRole('gestor_nacional') || this.loginService.hasRole('gestor_regional');

                this.settings = NucleoHelper.getSettingsTable(showBtnCreateNewNucleo, showBtnEditNewNucleo, showBtnDeleteNewNucleo);

              }

  ngOnInit() {
    this.source = this.nucleoService.getAllNucleoNg();
  }

  onCreate($event){
    this.router.navigate(['nucleos/new']);
  }

  onEdit($event){
    this.router.navigate(['nucleos/edit/'+$event.data.id]);
  }

  onDelete($event){
    const nucleo = $event.data;
    if(!window.confirm(`Deseja excluir o núcleo "${nucleo.descricao}" ? Esta operação não poderá ser desfeita.`)){
      return;
    }
    this.nucleoService.deleteNucleo($event.data.id).subscribe(
      res=>{
        this.toast.success(res.message);
        this.source.remove($event.data);
      },
      error=>{
        this.toast.error(error.error.error);
        console.log(error);
      }
    )
  } 

  onCustom(event, modalContent) {
    if (event.action === 'visualizar_nucleo') {
      
      this.openModal(modalContent, event.data);
    }
  }

  public openModal(modalContent, nucleo) {
    //console.log("nucle:", nucleo);
    if(nucleo){
      this.nucleo = nucleo;      
    } 

    //console.log(this.nucleo);

    this.modalRef = this.modalService.open(modalContent, { container: '.app' });

  }

}
