import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Nucleo } from '../../nucleos/shared/nucleo.model';
import { NucleoService } from '../../nucleos/shared/nucleo.service';
import { MonitoresService } from '../monitores.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-monitor-form',
  templateUrl: './monitor-form.component.html',
  styleUrls: ['./monitor-form.component.scss']
})
export class MonitorFormComponent implements OnInit {

  monitorForm: FormGroup;
  documentacaoForm: FormGroup;
  steps:any[];
  currentAction: string;
  submittingForm: Boolean = false;
  nucleos:Nucleo[];
  pageTitle: string;
  fileName = '';
  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  fileInfos: [];
  showErrors=false;
  myFiles:any [] = [];
  constructor(
              private toastr: ToastrService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router:Router,
              private monitoresService:MonitoresService,
              private nucleoService:NucleoService,
              private http: HttpClient,
  ) {

    this.steps = [
      {name: 'Monitor', icon: 'fa-user', active: true, valid: false, hasError:false },
      {name: 'Documentacao', icon: 'fa-file-text', active: false, valid: false, hasError:false },
    ]

   }

  ngOnInit() {
    this.setCurrentAction();
    this.loadNucleos();
    this.buildFormMonitorForm();
    this.buildFormDocumentacao();
    this.loadMonitorToEdit();
    
  }


  private setCurrentAction() {
    this.pageTitle = 'Criar Novo Monitor';
    if (this.route.snapshot.url[0].path === 'new'){
      this.currentAction = 'new';
    }else{
      this.pageTitle = 'Editar Monitor';
      this.currentAction = 'edit';
    }
  }

 

  private buildFormMonitorForm() {
    this.monitorForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required]],
      cpf: [null, [Validators.required]],
      celular: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      endereco: [null, [Validators.required]],
      telefone: [null, [Validators.required]],
      data_nascimento: [null, [Validators.required]],
      formacao_academica: [null, [Validators.required]],
      funcao: [null],
      nucleo_id: [null, [Validators.required]],
 
    });
  }


  private buildFormDocumentacao() {
    this.documentacaoForm = this.formBuilder.group({
      id: [null],     
      documentos: [null],     
    });
  }



  private loadMonitorToEdit(){

    if (this.currentAction === 'edit') {

      this.route.paramMap.pipe(switchMap(params => 
        
        this.monitoresService.get(+params.get('id'))))
        .subscribe(
          (res) => {
            //depois é só mandar o patchvalue que é sussa!
            this.monitorForm.patchValue(res);

            //listar os aquivos
           this.loadMonitorFiles(res.id);

           
          },
          (error) => this.toastr.warning('Ocorreu um erro no servidor, tente mais tarde.')
        )

      

    }

  }



  private loadMonitorFiles(monitor_id:number){

    this.monitoresService.getFiles(monitor_id).subscribe(
      res=>{
        this.fileInfos = res.files
      }
    )

  }



  public loadNucleos(){

    this.nucleoService.getAllNucleo().subscribe(
      res=>{
        this.nucleos = res;
        //console.log("Nucleos: ", this.nucleos);
      }
    )

  }








  submitForm() {
    // this.submittingForm = true;
    if(this.monitorForm.invalid){
      console.log(this.monitorForm.controls)
      this.toastr.error("Formulário Inválido");
      this.showErrors=true;
      return false;
    }
    if (this.currentAction == "new"){
      this.createMonitor();
    }else if (this.currentAction == "edit"){
      this.updateMonitor();
    }
  }



  private createMonitor(){
  
    const dados = this.monitorForm.value;

    this.monitoresService.createMonitor(dados)
    .subscribe(
      res => {
        //console.log(res);
        this.toastr.success(`Monitor criado com sucesso!`);
        //this.router.navigate([`monitores/edit/${res.id}`]);
        //this.toastr.success(`Efetue o upload dos documentos!`);

        this.router.navigate([`monitores`])
      },
      error => {
       this.toastr.error(error.error.error);
       console.log(error.message)
       }
    );

  }



  private updateMonitor() {    

    const dados = this.monitorForm.value;

    this.monitoresService.updateMonitor(dados)
    .subscribe(
      res => {
        this.toastr.success(res.message);
        this.router.navigate(['monitores']);
      },
      error => {
       this.toastr.error(error.error.error);
       console.log(error.message)
       }
    );
  }



 selectFiles(event) {
  this.progressInfos = [];
  this.selectedFiles = event.target.files;
}



  uploadFiles() {

    this.message = '';
  
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }

  }

  upload(idx, file) {

    this.progressInfos[idx] = { value: 0, fileName: file.name };
  
    this.monitoresService.upload(file, parseInt(this.monitorForm.get('id').value)).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          // this.fileInfos = this.monitoresService.getFiles(this.monitorForm.get('cpf').value);
          
          this.fileInfos = event.body.files;

        }

      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Não foi possível efeutar o upload do arquivo:' + file.name;
      });

  }






  DeleteFile(file){
    this.monitoresService.deleteFile(file, this.monitorForm.value.id).subscribe(
      res=>{
        this.fileInfos = res.files
      }
    )
  }

  DownloadFile(file){
    this.monitoresService.downloadFile(file, this.monitorForm.value.id).subscribe(
      res=>{

        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(res);

        a.href = objectUrl
        a.download = file;
        a.click();
        URL.revokeObjectURL(objectUrl);

      }
    )
  }






}
