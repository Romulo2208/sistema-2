import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { Toast, ToastrService } from 'ngx-toastr';
import { EscolaService } from '../shared/escola.service';

@Component({
  selector: 'app-escola-form',
  templateUrl: './escola-form.component.html',
  styleUrls: ['./escola-form.component.scss']
})
export class EscolaFormComponent implements OnInit {

  escolaForm: FormGroup;
  regioes = ['Norte', 'Sul', 'Sudeste', 'Centro-Oeste', 'Nordeste'];
  zonas = ['Rural', 'Urbana'];
  rede = ['Federal', 'Estadual', 'Municipal', 'Privada'];

  constructor(private formBuilder: FormBuilder, private escolaService: EscolaService, private toastr: ToastrService, public dialogRef: MatDialogRef<any>) { }

  ngOnInit() {
    this.buildEscolaForm();
  }

  private buildEscolaForm() {
    this.escolaForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required]],
      localidade: [null, [Validators.required]],
      pais: [null, [Validators.required]],
      regiao: [null, [Validators.required]],
      uf: [null, [Validators.required]],
      municipio: [null, [Validators.required]],
      categoria_zona: [null],
      categoria_tipo: [null],     
    });
  }

  cadastrarEscola(){
    const escola = this.escolaForm.value;
    this.escolaService.create(escola).subscribe(
      escola=> {
        this.toastr.success(`Escola criada com sucesso!`);
        this.dialogRef.close(escola);

      },
      error=>{
        this.toastr.error(error.error.error);
      }
    )
  }

}
