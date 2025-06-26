import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../login/login.service';
import { DeficienciaHelper } from '../shared/deficiencia-helper';
import { DeficienciaService } from '../shared/deficiencia.service';

@Component({
  selector: 'app-deficiencia-list',
  templateUrl: './deficiencia-list.component.html',
  styleUrls: ['./deficiencia-list.component.scss']
})
export class DeficienciaListComponent implements OnInit {

  
  public settings = DeficienciaHelper.getSettingsTable();
  public source: ServerDataSource;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private deficienciaService:DeficienciaService,
    private loginService:LoginService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  
  loadData() {
    // carregar as deficiências
     this.source = this.deficienciaService.getAllNg();
  }
  
  onCreate(event) {

    if(!this.loginService.hasRole('admin')){
      this.toastr.warning("Sem permissão para executar esta ação");
      return;
    }

    this.deficienciaService.create(event.newData).subscribe(
      (res) => {
        const msg = res.message;
        this.toastr.success(msg);
        const newDeficiencia = res.deficiencia;
        this.source.add(newDeficiencia);
      },
      (err) => {
        const msg_error = err.error.error;
        this.toastr.error(msg_error); 
      }
    )

    event.confirm.resolve();

  }

  onEdit(event) {

    if(!this.loginService.hasRole('admin')){
      this.toastr.warning("Sem permissão para executar esta ação");
      return;
    }

    this.deficienciaService.edit(event.newData).subscribe(
      (res) => {
        const msg = res.message;
        this.toastr.success(msg);
        const deficiencia = res.deficiencia;
        this.source.update(event.data, deficiencia);
      },
      (err) => {
        const msg_error = err.error.error;
        this.toastr.error(msg_error); 
      }
      
    )

    event.confirm.resolve();
  }

  onDelete(event) {
    
    if(!this.loginService.hasRole('admin')){
      this.toastr.warning("Sem permissão para executar esta ação");
      return;
    }

    if (window.confirm(`Deseja remover Deficiência: ${event.data.tipo}?`)) {

      this.deficienciaService.delete(event.data).subscribe(
        (res) => {
          const msg = res.message;
          this.toastr.success(msg);
          this.source.remove(event.data);
        },
        (err) => {
          const msg_error = err.error.error;
          this.toastr.error(msg_error); 
        }
      );

      event.confirm.resolve();

    }

  }


}
