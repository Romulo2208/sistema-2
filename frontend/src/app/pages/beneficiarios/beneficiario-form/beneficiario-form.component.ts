import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { Nucleo } from '../../nucleos/shared/nucleo.model';
import { NucleoService } from '../../nucleos/shared/nucleo.service';
import { BeneficiarioService } from '../shared/beneficiario.service';
import { Beneficiario } from '../shared/beneficiario.model';
import { Deficiencia } from '../shared/deficiencia.model';
import { Endereco } from '../shared/endereco.model';
import { Uniforme } from '../shared/uniforme.model';
import { frequenciaValidator } from '../shared/ValidatorFrequenciaBeneficiario';
import { cpfValidator } from '../shared/cpf.validator';
import { Escola } from '../../escolas/shared/escola.model';
import { EscolaService } from '../../escolas/shared/escola.service';
import { MatDialog } from '@angular/material';
import { EscolaFormComponent } from '../../escolas/escola-form/escola-form.component';

@Component({
  selector: 'app-beneficiario-form',
  templateUrl: './beneficiario-form.component.html',
  styleUrls: ['./beneficiario-form.component.scss']
})
export class BeneficiarioFormComponent implements OnInit {

  steps: any[];

  nucleos: Nucleo[];
  escolas: Escola[];
  deficiencias: Deficiencia[];
  dia_turno_nucleos: any = [];
  documentos: any[] = [];
  escolaDefault = null;
  tamanhos: any[] = ['6 anos', '8 anos', '10 anos', '12 anos', 'PP', 'P', 'M', 'G', 'GG'];
  listaDeParentesco = [
    { value: 'Afilhada', title: 'Afilhada' },
    { value: 'Afilhado', title: 'Afilhado' },
    { value: 'Amiga', title: 'Amiga' },
    { value: 'Amigo', title: 'Amigo' },
    { value: 'Avó', title: 'Avó' },
    { value: 'Avô', title: 'Avô' },
    { value: 'Cunhada', title: 'Cunhada' },
    { value: 'Cunhado', title: 'Cunhado' },
    { value: 'Enteada', title: 'Enteada' },
    { value: 'Enteado', title: 'Enteado' },
    { value: 'Esposa', title: 'Esposa' },
    { value: 'Filha', title: 'Filha' },
    { value: 'Filho', title: 'Filho' },
    { value: 'Genro', title: 'Genro' },
    { value: 'Irmã', title: 'Irmã' },
    { value: 'Irmão', title: 'Irmão' },
    { value: 'Madrasta', title: 'Madrasta' },
    { value: 'Mãe', title: 'Mãe' },
    { value: 'Marido', title: 'Marido' },
    { value: 'Neta', title: 'Neta' },
    { value: 'Neto', title: 'Neto' },
    { value: 'Nora', title: 'Nora' },
    { value: 'Padrastro', title: 'Padrastro' },
    { value: 'Pai', title: 'Pai' },
    { value: 'Prima', title: 'Prima' },
    { value: 'Primo', title: 'Primo' },
    { value: 'Sobrinha', title: 'Sobrinha' },
    { value: 'Sobrinho', title: 'Sobrinho' },
    { value: 'Sogra', title: 'Sogra' },
    { value: 'Sogro', title: 'Sogro' },
    { value: 'Tia', title: 'Tia' },
    { value: 'Tio', title: 'Tio' },
    { value: 'Nenhum', title: 'Nenhum' }
  ];

  listaSeries = [
    { id: 13, nome: '1º Ano - Ensino Fundamental I' },
    { id: 14, nome: '2º Ano - Ensino Fundamental I' },
    { id: 15, nome: '3º Ano - Ensino Fundamental I' },
    { id: 16, nome: '4º Ano - Ensino Fundamental I' },
    { id: 17, nome: '5º Ano - Ensino Fundamental I' },
    { id: 18, nome: '6º Ano - Ensino Fundamental II' },
    { id: 19, nome: '7º Ano - Ensino Fundamental II' },
    { id: 20, nome: '8º Ano - Ensino Fundamental II' },
    { id: 21, nome: '9º Ano - Ensino Fundamental II' },
    { id: 22, nome: '1º Ano - Ensino Médio' },
    { id: 23, nome: '2º Ano - Ensino Médio' },
    { id: 24, nome: '3º Ano - Ensino Médio' }
  ];


  currentAction: string;
  beneficiarioForm: FormGroup;
  enderecoForm: FormGroup;
  uniformeForm: FormGroup;
  submittingForm: Boolean = false;
  pageTitle: string;
  selectedFileAutorizacaoMedica: FileList;
  selectedFileAutorizacaoImagem: FileList;



  constructor(private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private beneficiarioService: BeneficiarioService,
    private nucleoService: NucleoService,
    private escolaService: EscolaService,
    public dialog: MatDialog) {

    this.steps = [
      { name: 'Beneficiario', icon: 'fa-user', active: true, valid: false, hasError: false },
      { name: 'Endereço', icon: 'fa-home', active: false, valid: false, hasError: false },
      { name: 'Uniforme', icon: 'fa-cubes', active: false, valid: false, hasError: false },
    ]

  }

  ngOnInit() {

    this.setCurrentAction();
    this.loadNucleos();
    this.loadDeficiencias();
    //this.loadEscolas();

    this.buildFormBeneficiarioForm();
    this.buildEnderecoBeneficiarioForm();
    this.buildUniformeBeneficiarioForm();
    this.loadBeneficiarioToEdit();

    this.beneficiarioForm.get('pjp').valueChanges.subscribe(value => {
      const serieCtrl = this.beneficiarioForm.get('serie_id');
      const defCtrl = this.beneficiarioForm.get('deficiencias');
      if (value) {
        serieCtrl.setValue(null);
        serieCtrl.clearValidators();
        defCtrl.setValidators([Validators.required]);
      } else {
        defCtrl.setValue([]);
        serieCtrl.setValidators([Validators.required]);
        defCtrl.clearValidators();
      }
      serieCtrl.updateValueAndValidity();
      defCtrl.updateValueAndValidity();
    });


  }

  private setCurrentAction() {
    this.pageTitle = 'Criar Novo Beneficiário';
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.pageTitle = 'Editar Beneficiário';
      this.currentAction = 'edit';
    }
  }

  private buildFormBeneficiarioForm() {
    this.beneficiarioForm = this.formBuilder.group({
      id: [null],
      nome_completo: [null, [Validators.required]],
      cpf: [null,[Validators.required, cpfValidator]],
      data_nascimento: [null, [Validators.required]],
      nome_pai: [null],
      nome_mae: [null],
      nome_responsavel: [null, [Validators.required]],
      grau_parentesco_responsavel: [null],
      telefone: [null],
      celular: [null],
      email: [null, [Validators.email]],
      nucleo_id: [null, [Validators.required]],
      escola_id: [null, [Validators.required]],
      pjp: [false],
      serie_id: [null],
      deficiencias: [null],
      frequencia_nucleo: [null, [Validators.required, frequenciaValidator]],
      documento_autorizacao_medica_pjp: [null],
      documento_autorizacao_imagem: [null],
      data_ingresso: [new Date().toISOString().split('T')[0], [Validators.required]],
    });
  }


  private buildEnderecoBeneficiarioForm() {
    this.enderecoForm = this.formBuilder.group({
      id: [null],
      cep: [null],
      logradouro: [null],
      complemento: [null],
      bairro: [null],
      localidade: [null],
      numero: [null],
      uf: [null]
    });
  }




  private buildUniformeBeneficiarioForm() {
    this.uniformeForm = this.formBuilder.group({
      id: [null],
      tamanho_camisa: [null, [Validators.min(1), Validators.max(200)]],
      tamanho_calca: [null, [Validators.min(1), Validators.max(200)]],
      tamanho_tenis: [null, [Validators.min(1), Validators.max(200)]],
      tamanho_abrigo: [null, [Validators.min(1), Validators.max(200)]],
      tamanho_short: [null, [Validators.min(1), Validators.max(200)]],
    });
  }


  public loadNucleos() {
    this.nucleoService.getAllNucleo().subscribe(
      res => {
        this.nucleos = res;
        // console.log("Nucleos: ", this.nucleos);
      }
    )
  }

  public loadEscolas(escola?) {
    this.escolaService.getAllEscola().subscribe(
      res => {
        this.escolas = res;
      }
    )

  }



  public loadDeficiencias() {
    this.beneficiarioService.getAllDeficiencia().subscribe(
      res => {
        this.deficiencias = res;
      }
    )
  }


  SelecionaDiaTurnoNuclecoSelecionado(event) {
    this.loadNucleos();
    const nucleo_id = event.id;

    const nucleo_selecionado = this.nucleos.find(nucleo => nucleo.id === nucleo_id);

    this.dia_turno_nucleos = nucleo_selecionado.dia_turno_nucleos;

  }

  changeEscola(event) {

    if (event.term.length >= 3) {
      const query = `nome_like=${event.term}`;
      this.escolaService.getQueryStringEscolas(query).subscribe(
        res => {
          if (res.length > 0) {
            this.escolas = [];
          }
          this.escolas = res;
        }
      )
    }
  }


  openCadastroEscola(): void {
    const dialogRef = this.dialog.open(EscolaFormComponent, {
      width: '60%',
      height: '70%'
    });

    dialogRef.afterClosed().subscribe(escola => {
      if (escola) this.escolaDefault = escola.id;
      this.loadEscolas(escola);
    });
  }


  private loadBeneficiarioToEdit() {

    if (this.currentAction === 'edit') {

      this.route.paramMap.pipe(
        switchMap(params => this.beneficiarioService.get(+params.get('id')))
      )
        .subscribe(
          (res) => {

            //console.log("Editar: ", res);
            // salvar referência das deficiencias antes para excluir do objeto
            const deficiencias: any[] = res.deficiencias;
            const isPjp = res.pjp !== undefined ? !!res.pjp : (deficiencias && deficiencias.length > 0);
            res.pjp = isPjp;
            //  const endereco = res.endereco;

            //console.log("Endereço: ", endereco);

            delete res.deficiencias; // evitar dar erro de bind value no console log. por conta no ng-select

            //depois é só mandar o patchvalue que é sussa!
            this.beneficiarioForm.patchValue(res);
            // this.enderecoForm.patchValue(endereco);

            // para fazer o bind das defiiencias é necessario somente o array de id
            const deficiencias_id_selecionadas = [];

            deficiencias.forEach(element => {
              // console.log("Element: ",element);
              deficiencias_id_selecionadas.push(element['id']);
            });

            // Patch value exclusivo para as deficiências
            this.beneficiarioForm.get('deficiencias').patchValue(deficiencias_id_selecionadas);


            this.escolas = [res.escola]

            //preenche os dias disponível do núcleo o qual o beneficiário pertence
            this.dia_turno_nucleos = res.nucleo.dia_turno_nucleos;

            this.nucleos = [];
            this.nucleos.push(res.nucleo)


            //patch para a frequencia do beneficiario
            const frequencia_beneficiarios = [];
            res['frequencia_beneficiarios'].forEach(e => {
              frequencia_beneficiarios.push(e.dia_turno_id);
            })

            this.beneficiarioForm.get('frequencia_nucleo').setValue(frequencia_beneficiarios);


            // Patch value exclusivo para as endereco
            if(res.endereco)
              this.enderecoForm.patchValue(res.endereco)

            // Patch value exclusivo para as uniforme
             if(res.uniforme)
              this.uniformeForm.patchValue(res.uniforme)


            //documentos de imagem e medico
            this.documentos = res['documentos']


          },
          (error) => this.toastr.warning('Ocorreu um erro no servidor, tente mais tarde.')
        )
    }

  }


  selectDocument(event) {

    const pdf = "application/pdf";//tipo de arquivo aceito
    const controlName = event.target.getAttribute('formControlName');//de qual campo está vindo o aquivo

    if (event.target.files.length == 0) {
      return;
    }

    // warning para tipo != de pdf
    if (event.target.files[0].type !== pdf) {
      delete event.target.files[0];
      this.toastr.warning("Selecione arquivos pdf!");
      return;
    }

    const documento = {
      controlName: controlName,
      file: event.target.files[0]
    }



    //se o documento do campo já existir substitui pelo novo
    let existe = false;
    this.documentos.forEach(e => {
      if (e.controlName === documento.controlName) {
        e.file = documento.file;
        existe = true;
      }
    })

    //se o documento não existir na lista de documentos add na lista
    if (!existe)
      this.documentos.push(documento);


  }

  selectFileAutorizacaoMedica(event) {
    const file = event.target.files[0];

    if (file && file.type !== 'application/pdf') {
      this.beneficiarioForm.controls['documento_autorizacao_medica_pjp'].setErrors({ pdfOnly: true });
    } else {
      this.beneficiarioForm.controls['documento_autorizacao_medica_pjp'].setErrors(null);
      //this.beneficiarioForm.patchValue({ fileInput: file });
      this.selectedFileAutorizacaoMedica = event.target.files;
    }
  }

  selectFileAutorizacaoImagem(event) {
    const file = event.target.files[0];

    if (file && file.type !== 'application/pdf') {
      this.beneficiarioForm.controls['documento_autorizacao_imagem'].setErrors({ pdfOnly: true });
    } else {
      this.beneficiarioForm.controls['documento_autorizacao_imagem'].setErrors(null);
      //this.beneficiarioForm.patchValue({ fileInput: file });
      this.selectedFileAutorizacaoImagem = event.target.files;
    }
  }
  fileInputHasErrorAutorizacaoMedica() {
    return this.beneficiarioForm.get('documento_autorizacao_medica_pjp').hasError('pdfOnly') && this.beneficiarioForm.get('documento_autorizacao_medica_pjp').touched;
  }
  fileInputHasErrorAutorizacaoImagem() {
    return this.beneficiarioForm.get('documento_autorizacao_imagem').hasError('pdfOnly') && this.beneficiarioForm.get('documento_autorizacao_imagem').touched;
  }

  uploadFilesAutorizacaoMedica() {

    //this.message = '';

    if (this.selectedFileAutorizacaoMedica) {
      for (let i = 0; i < this.selectedFileAutorizacaoMedica.length; i++) {
        this.upload(i, this.selectedFileAutorizacaoMedica[i], "autMed");
      }
    }

    return

  }

  uploadFilesAutorizacaoImagem() {

    //this.message = '';


    if (this.selectedFileAutorizacaoImagem) {
      for (let i = 0; i < this.selectedFileAutorizacaoImagem.length; i++) {
        this.upload(i, this.selectedFileAutorizacaoImagem[i], "autImg");
      }
    }

    return
  }

  upload(idx, file, tipo) {

    //this.progressInfos[idx] = { value: 0, fileName: file.name };

    this.beneficiarioService.upload(file, parseInt(this.beneficiarioForm.get('id').value), tipo).subscribe(
      event => {
        //console.log("Evento upload ", event);

      },
      err => {
        //console.log("Evento upload erro:", err);
      });

  }


  private createBeneficiario() {

    //const endereco: Endereco = Object.assign(new Endereco(), this.enderecoForm.value);
    const { pjp, ...dados } = this.beneficiarioForm.value;
    const beneficiario: Beneficiario = Object.assign(new Beneficiario(), dados);

    //beneficiario.endereco = endereco;
    //beneficiario.uniforme = Object.assign(new Uniforme(), this.uniformeForm.value);


    this.beneficiarioService.createBeneficiario(beneficiario)
      .subscribe(
        res => {

          this.beneficiarioForm.get('id').setValue(res.id);
          this.uploadFilesAutorizacaoMedica();
          this.uploadFilesAutorizacaoImagem();
          this.toastr.success(`Beneficiario criado com sucesso!`);
          this.router.navigateByUrl('beneficiarios',{skipLocationChange:true}).then(
            ()=>this.router.navigate(["beneficiarios","edit",res.id])
          );
        },
        error => {
          this.toastr.error(error.error.error);
          this.submittingForm = false;
          //console.log(error.message)
        }
      );

  }



  private updateBeneficiario() {


    const { pjp, ...dados } = this.beneficiarioForm.value;
    const beneficiario: Beneficiario = Object.assign(new Beneficiario(), dados);
    //beneficiario.endereco = Object.assign(new Endereco(), this.enderecoForm.value);
    //beneficiario.uniforme = Object.assign(new Uniforme(), this.uniformeForm.value);


    this.beneficiarioService.updateBeneficiario(beneficiario)
      .subscribe(
        () => {
          this.uploadFilesAutorizacaoMedica();
          this.uploadFilesAutorizacaoImagem();
          this.toastr.success("Beneficiário atualizado com sucesso!");          
          this.router.navigateByUrl('beneficiarios',{skipLocationChange:true}).then(
            ()=>this.router.navigate(["beneficiarios","edit",beneficiario.id])
          );
        },
        error => {
          this.toastr.error(error.error.error);
          this.submittingForm = false;
          //  console.log(error.message);
        }
      )
  }




  onCheckboxDiaChange(e) {
    const checkArray: FormArray = this.beneficiarioForm.get('dias_turnos') as FormArray;

    //obj com dia da semana e turno para ser add no form array
    const obj = { dia: null, turno: [] };

    const elements = document.getElementById('turno_dia_' + e.target.value).getElementsByTagName('input')

    if (e.target.checked) {

      obj.dia = e.target.value;
      checkArray.push(new FormControl(obj));

      //habilita todos os checkbox de turno
      for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
      }

    } else {
      checkArray.controls.forEach((item: FormControl, key) => {

        if (item.value.dia == e.target.value) {
          checkArray.removeAt(key);

          //desabilita todos os checkbox de turno
          for (let i = 0; i < elements.length; i++) {
            elements[i].disabled = true;
            elements[i].checked = false;
          }

          return;
        }

      });
    }
  }




  onCheckboxTurnoChange(e, dia_id) {
    //encontrar o id do dia no form array
    //e atualizar o turno
    const checkArray: FormArray = this.beneficiarioForm.get('dias_turnos') as FormArray;

    //se for checked add o dia no formArray
    if (e.target.checked) {
      checkArray.controls.forEach((item: FormControl) => {

        if (item.value.dia == dia_id) {
          item.value.turno.push(e.target.value)
          return;
        }

      });
    } else {//remove do formArray
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value.dia == dia_id) {
          item.value.turno.pop(e.target.value)
          //console.log(item.value.turno);
          return;
        }
      });

    }

  }



  submitForm() {

     this.submittingForm = true;

    if (this.currentAction == "new") {
      this.createBeneficiario();
    } else if (this.currentAction == "edit") {
      this.updateBeneficiario();
    }

  }


 

  public setStep(stepTarget){
   // console.log(stepTarget);
    const beneficiario = this.beneficiarioForm.value;
    if(stepTarget.name!="Beneficiario" && !beneficiario.id){
      this.toastr.warning("É necessário salvar Beneficiário primeiro!");
      return false;
    }
    this.steps.forEach(step => step.name===stepTarget.name?step.active = true:step.active=false);
    
  }



  public confirm() {
    // Aqui submit todo o form
    this.steps.forEach(step => step.valid = true);
    this.submitForm();
  }

  preencheEndereco(endereco) {

    this.enderecoForm.patchValue({
      logradouro: endereco.logradouro,
      complemento: endereco.complemento,
      bairro: endereco.bairro,
      localidade: endereco.localidade,
      uf: endereco.uf,

    });
  }

  getBuscarCep() {
    // this.formularioPronto = false;

    const cep: number = this.enderecoForm.get('cep').value;

    this.beneficiarioService.buscaCep(cep).subscribe(
      (endereco) => {

        //console.log("Endereço retornado: ", endereco);
        this.preencheEndereco(endereco);
      }
    );

  }




  DownloadFile(tipo, arquivo) {

    this.beneficiarioService.downloadDoc(this.beneficiarioForm.get('id').value, tipo, arquivo).subscribe(
      res => {
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(res);

        a.href = objectUrl;
        a.target = '_blank';
        a.click();
        URL.revokeObjectURL(objectUrl);

      },
      err => {
        // console.log("Erro de arquivo: ", err);
        this.toastr.error("Arquivo ainda não enviado!");
      }
    )
  }

  saveBeneficiario(){
    this.submittingForm = true;

    if (this.currentAction == "new") {
      this.createBeneficiario();
    } else if (this.currentAction == "edit") {
      this.updateBeneficiario();
    }
  }

  saveEndereco(){
    this.submittingForm = true;
    const { pjp, ...dados } = this.beneficiarioForm.value;
    const beneficiario: Beneficiario = Object.assign(new Beneficiario(), dados);
    beneficiario.endereco = Object.assign(new Endereco(), this.enderecoForm.value);

    this.beneficiarioService.updateEndereco(beneficiario)
      .subscribe(
        () => {
          this.toastr.success("Endereço Salvo com sucesso!");
          this.submittingForm = false;
         // this.router.navigate(['beneficiarios']);
        },
        error => {
          this.toastr.error(error.message);
          this.submittingForm = false;
          //  console.log(error.message);
        }
      )
  }

  saveUniforme(){
    this.submittingForm = true;
    const { pjp: pjp2, ...dadosUni } = this.beneficiarioForm.value;
    const beneficiario: Beneficiario = Object.assign(new Beneficiario(), dadosUni);
    beneficiario.uniforme = Object.assign(new Uniforme(), this.uniformeForm.value);

    this.beneficiarioService.updateUniforme(beneficiario)
      .subscribe(
        () => {
          this.toastr.success("Uniforme Salvo com sucesso!");
          this.submittingForm = false;
         // this.router.navigate(['beneficiarios']);
        },
        error => {
          this.toastr.error(error.error.error);
          this.submittingForm = false;
          //  console.log(error.message);
        }
      )
  }

}
