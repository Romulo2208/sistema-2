import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerDataSource } from 'ng2-smart-table';
import { ToastrService } from 'ngx-toastr';
import { MonitoresService } from '../monitores.service';
import { MonitorHelper } from '../shared/monitor.helper';

@Component({
  selector: 'app-monitor-list',
  templateUrl: './monitor-list.component.html',
  styleUrls: ['./monitor-list.component.scss']
})
export class MonitorListComponent implements OnInit {

  source: ServerDataSource;
  settings = MonitorHelper.getSettingsTable();
  private selectedRows: any = [];

  constructor(private monitorService: MonitoresService,
    private toast: ToastrService,
    private router: Router) { }

  ngOnInit() {
    this.source = this.monitorService.getAllMonitoresNg();
  }



  onCreate($event) {
    this.router.navigate(['monitores/new/']);
  }


  onEdit($event) {
    this.router.navigate(['monitores/edit/' + $event.data.id]);
  }

  onDesativar($event) {
    const monitor = $event.data;
    //console.log("monitor: ", $event.data);
    if (!window.confirm(`Deseja excluir o monitor "${monitor.nome}" ? Esta operação não poderá ser desfeita.`)) {
      return;
    }
    this.monitorService.deleteMonitor($event.data.id).subscribe(
      res => {
        this.toast.success(res.message);
        this.source.remove($event.data);
      },
      error => {
        this.toast.error(error.error.error);
        console.log(error);
      }
    )
  }

  onUserRowSelect(event): void {
    this.selectedRows = event.selected;
    console.log(event)
  }

  deleteBath(event) {
    if (!this.selectedRows.length) {
      this.toast.error('Selecione algum registro!');
      return false;
    }
    let monitors_ids = this.selectedRows.map(monitor => monitor.id);
    this.monitorService.deleteBath(monitors_ids).subscribe(
      res => {
        this.toast.success(res.message);
        this.source.refresh();
        this.selectedRows = [];

      },
      error => {
        this.toast.error(error.error.error);
        console.log(error);

      }
    )
  }

}
