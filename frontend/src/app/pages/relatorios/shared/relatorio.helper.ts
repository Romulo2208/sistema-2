import { SelectTurnosComponent } from "../select-turnos/select-turnos.component";
import { DatePipe, registerLocaleData } from "@angular/common";
import ptLocale from "@angular/common/locales/pt";
registerLocaleData(ptLocale);

export class RelatorioHelper {
  static getSettingsTable(qtdPerPage = 25) {
    return {
      selectMode: "single",
      hideHeader: false,
      hideSubHeader: false,
      actions: {
        columnTitle: "",
        add: false,
        edit: false,
        delete: false,
        width: "100%",
        position: "right",
      },
      mode: "external",
      noDataMessage: "Nenhuma Correspondência Encontrada!",
      columns: {
        nome_completo: {
          title: "Nome Completo",
        },
        cpf: {
          title: "CPF",
          width: "110px",
        },
        data_nascimento: {
          title: "Data de Nascimento",
          filter: false,
          valuePrepareFunction: (_, row) => {
            const datePipe = new DatePipe("pt");
            return datePipe.transform(row.data_nascimento, "dd/MM/yyyy") || "";
          },
        },
        nome_mae: { title: "Nome da Mãe" },
        nome_pai: { title: "Nome do Pai" },
        nome_responsavel: {
          title: "Nome Responsável",
        },
        grau_parentesco_responsavel: {
          title: "Grau de Parentesco (Responsável)",
        },
        comar_id: {
          title: "COMAR",
          width: "120px",
          filter: {
            type: "list",
            config: {
              selectText: "Todos",
              list: [
                { value: "1", title: "I COMAR" },
                { value: "2", title: "II COMAR" },
                { value: "3", title: "III COMAR" },
                { value: "4", title: "IV COMAR" },
                { value: "5", title: "V COMAR" },
                { value: "6", title: "VI COMAR" },
                { value: "7", title: "VII COMAR" },
              ],
            },
          },
          valuePrepareFunction: (_, row) => {
            return row.comar_descricao;
          },
        },
        nucleo_descricao: {
          title: "Núcleo",
        },
        municipio: {
          title: "Município",
        },
        uf: {
          title: "UF",
          width: "60px",
        },

        pjp: {
          title: "PJP",
          width: "100px",
          filter: {
            type: "list",
            config: {
              selectText: "Todos",
              list: [
                { value: "1", title: "Sim" },
                { value: "0", title: "Não" },
              ],
            },
          },
          valuePrepareFunction: (data) => {
            return data ? "Sim" : "Não";
          },
        },
      },
      pager: {
        display: true,
        perPage: qtdPerPage,
      },
    };
  }

  static getSettingsTablePorEscola(qtdPerPage = 25, relatorio?: boolean) {
    return {
      selectMode: "single",
      hideHeader: false,
      hideSubHeader: false,
      actions: {
        columnTitle: "",
        add: false,
        edit: false,
        delete: false,
        width: "100%",
        position: "right",
      },
      mode: "external",
      noDataMessage: "Nenhuma Correspondência Encontrada!",
      columns: {
        nome_completo: {
          title: "Nome Completo",
        },
        cpf: {
          title: "CPF",
          width: "110px",
        },
        data_nascimento: {
          title: "Data de Nascimento",
          filter: false,
          valuePrepareFunction: (_, row) => {
            const datePipe = new DatePipe("pt");
            return datePipe.transform(row.data_nascimento, "dd/MM/yyyy") || "";
          },
        },
        comar_id: {
          title: "COMAR",
          width: "120px",
          filter: {
            type: "list",
            config: {
              selectText: "Todos",
              list: [
                { value: "1", title: "I COMAR" },
                { value: "2", title: "II COMAR" },
                { value: "3", title: "III COMAR" },
                { value: "4", title: "IV COMAR" },
                { value: "5", title: "V COMAR" },
                { value: "6", title: "VI COMAR" },
                { value: "7", title: "VII COMAR" },
              ],
            },
          },
          valuePrepareFunction: (_, row) => {
            return row.comar_descricao;
          },
        },
        nucleo_descricao: {
          title: "Núcleo",
        },
        municipio: {
          title: "Município",
        },
        uf: {
          title: "UF",
          width: "60px",
        },

        pjp: {
          title: "PJP",
          width: "100px",
          filter: {
            type: "list",
            config: {
              selectText: "Todos",
              list: [
                { value: "1", title: "Sim" },
                { value: "0", title: "Não" },
              ],
            },
          },
          valuePrepareFunction: (data) => {
            return data ? "Sim" : "Não";
          },
        },
        escola_nome: {
          title: "Escola",
        },
        turno: {
          title: "Turno",
          type: "html",
          filter: {
            type: "custom",
            component: SelectTurnosComponent,
          },
          valuePrepareFunction: (_, row) => {
            const dias_turnos = row.frequencia_beneficiarios.map(
              (frequencia) => {
                return `<span class='btn btn-primary btn-sm mb-1'>${frequencia.turno.descricao}</span>`;
              }
            );
            return dias_turnos.join(" ");
          },
        },
      },
      pager: {
        display: true,
        perPage: qtdPerPage,
      },
    };
  }

  static getDocDefinitionPDF(tableData) {
    const currentDate = new Date().toLocaleDateString();
    const currentHour = new Date().toLocaleTimeString();
    const docDefinition = {
      content: [
        {
          text: `Relatório de Beneficiários por Escola gerado em ${currentDate} às ${currentHour}`,
          style: "header",
        },
        {
          table: {
            body: tableData,
          },
          style: "table",
        },
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: "center",
        },
        table: {
          fontSize: 10,
          alignment: "center",
        },
        columnTitle: {
          fontSize: 12,
          fillColor: "#2F3E9E",
          bold: true,
          color: "white",
          alignment: "center",
        },
      },
      pageSize: "A4",
      pageMargins: [25, 40, 30, 60],
      pageOrientation: "landscape",
      footer: function (currentPage, pageCount) {
        //contador de páginas
        return {
          text: `Página ${currentPage.toString()} de ${pageCount}`,
          alignment: "right",
          margin: [0, 20, 30, 0],
          fontSize: 10,
        };
      },
    };
    return docDefinition;
  }
}
