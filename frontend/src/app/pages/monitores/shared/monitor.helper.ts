import { DatePipe, registerLocaleData } from "@angular/common";
import ptLocale from "@angular/common/locales/pt";
registerLocaleData(ptLocale);

export class MonitorHelper {
  //Tabela de Todos os Beneficiários
  static getSettingsTable() {
    return {
      selectMode: "multi", //single|multi
      hideHeader: false,
      hideSubHeader: false,
      actions: {
        columnTitle: "Ação",
        add: true,
        edit: true,
        delete: true,
        custom: [
          // { name: "visualizar_beneficiario", title: '<i class="fa fa-eye mr-3" title="Visualizar Beneficiário"></i>' }
        ],
        width: "100%",
        position: "right", // left|right
      },
      mode: "external",
      add: {
        addButtonContent:
          '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
        createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
      },
      edit: {
        editButtonContent:
          '<i class="fa fa-pencil mr-3 text-primary" title="Editar monitor"></i>',
        saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
      },
      delete: {
        deleteButtonContent:
          '<i class="fa fa-times-circle text-danger" title="Desativar monitor"></i>',
        confirmDelete: true,
      },
      noDataMessage: "Nenhuma Correspondência Encontrada!",
      columns: {
        id: {
          title: "ID",
          filter: false,
          sortDirection: "desc",
        },
        nome: {
          title: "Nome Completo",
        },
        endereco: {
          title: "Endereço",
        },
        cpf: {
          title: "CPF",
          width: "110px",
        },
        email: {
          title: "Email",
        },
        celular: {
          title: "Celular",
        },
        telefone: {
          title: "Telefone",
        },
        data_nascimento: {
          title: "Data Nascimento",
          width: "60px",
          filter: false,
          valuePrepareFunction: (_, row) => {
            const datePipe = new DatePipe("pt");
            return datePipe.transform(row.data_nascimento, "dd/MM/yyyy") || "";
          },
        },
        nucleo: {
          title: "Núcleo",
          width: "120px",
          valuePrepareFunction: (cell, row) => {
            //console.log(cell);
            return cell ? cell.descricao : "-";
          },
        },
      },
      pager: {
        display: true,
        perPage: 25,
      },
    };
  }
}
