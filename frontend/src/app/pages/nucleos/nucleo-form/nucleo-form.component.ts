import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { Municipio } from '../shared/municipio.model';
import { Nucleo } from '../shared/nucleo.model';
import { NucleoService } from '../shared/nucleo.service';




@Component({
  selector: 'app-nucleo-form',
  templateUrl: './nucleo-form.component.html',
  styleUrls: ['./nucleo-form.component.scss']
})
export class NucleoFormComponent implements OnInit{

  selectedComar : any;
  selectedRegiao: any;
  selectedUF    : any;


  comars = [];
  regiao = [];
  ufs_by_regiao = [];

  dias_turnos = [];

  currentAction: string;
  nucleoForm: FormGroup;
  submittingForm: Boolean = false;
  pageTitle: string;


  municipios:Municipio[];


  constructor(private toastr: ToastrService,
              private nucleoService:NucleoService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router:Router) { }

  ngOnInit() {

    this.setCurrentAction();
    
    this.loadNucleoToEdit();

    this.loadComars();

    this.loadRegioes();

    this.loadDiasDaSemanaTurno();

    this.buildFormNucleoForm();

  }

  loadDiasDaSemanaTurno(){
    this.nucleoService.getAllDiaTurnos().subscribe(
      res=>{
        this.dias_turnos = res;
      }
    );
  }



  private setCurrentAction() {
    this.pageTitle = 'Criar Novo Núcleo';
    if (this.route.snapshot.url[0].path === 'new'){
      this.currentAction = 'new';
    }else{
      this.pageTitle = 'Editar Núcleo';
      this.currentAction = 'edit';
    }
  }

  private buildFormNucleoForm() {
    this.nucleoForm = this.formBuilder.group({
      id: [null],
      municipio_id: [null, [Validators.required]],
      comar_id: [null, [Validators.required]],
      descricao: [null, [Validators.required]],
      diaTurnoNucleos:  [null, [Validators.required]]
    });

 
  }


  private loadComars(){
    this.nucleoService.getAllComars().subscribe(
      res => {
        this.comars = res;
      }
    )
  }

  private loadRegioes(){
    this.nucleoService.getAllRegiao().subscribe(
      res=>{
        this.regiao = res;
      }
    )
  }

  public loadUFByRegiao(p_regiao){
    
    this.ufs_by_regiao = [];
    this.selectedUF = null;

    this.nucleoService.getUFByRegiao(p_regiao).subscribe(
      res=>{
        this.ufs_by_regiao = res;
      }
    )

  }


  public loadMunicipiosByUF(p_uf){
       
    this.municipios = [];
        
    this.nucleoService.getMunicipioByUF(p_uf).subscribe(
       res=>{
         this.municipios = res;
       }
     )

  }


  private loadNucleoToEdit(){

    if (this.currentAction === 'edit') {

      this.route.paramMap.pipe(
        switchMap(params => this.nucleoService.get(+params.get('id')))
      )
        .subscribe(
          (nucleo) => {

            this.nucleoForm.patchValue(nucleo);

            const dia_turno_id = [];
            nucleo.dia_turno_nucleos.forEach(e=>{
              dia_turno_id.push(e.id)
            });
            
            this.nucleoForm.get('diaTurnoNucleos').setValue(dia_turno_id);

            const municipio:Municipio =  Object.assign(new Municipio(), nucleo.municipio);

            this.selectedRegiao = nucleo.municipio.regiao;
            this.selectedUF     = nucleo.municipio.uf;
            this.municipios = [];
            this.municipios.push(municipio);

            
          },
          (error) => this.toastr.warning('Ocorreu um erro no servidor, tente mais tarde.')
        )
    }

  }



  



  private createNucleo() {

    const nucleo: Nucleo = Object.assign(new Nucleo(), this.nucleoForm.value);

     this.nucleoService.createNucleo(nucleo)
       .subscribe(
         res => {
          //  console.log(res);
           this.toastr.success(`Núcleo criado com sucesso!`);
           this.router.navigate(['nucleos']);
         },
         error => {
          this.toastr.error(error.message);
          }
       );
  }


  private updateNucleo() {
    
    //  const data= this.vendaForm.value;
     const nucleo: Nucleo = Object.assign(new Nucleo(), this.nucleoForm.value);
 
     this.nucleoService.updateNucleo(nucleo)
       .subscribe(
         () => {
           this.toastr.success("Núcleo atualizado com sucesso!");
           this.router.navigate(['nucleos']);
         },
         error => {
           this.toastr.error(error.message);
          console.log(error.message);
          }
       )
  }


  submitForm() {
    
   // this.submittingForm = true;

     if (this.currentAction == "new")
       this.createNucleo();
     else if (this.currentAction == "edit")
       this.updateNucleo();
       
  }




}
