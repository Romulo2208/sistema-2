import { DatePipe } from '@angular/common';
//import { Console } from 'console';

export class BeneficiarioHelper {
  //Tabela de Todos os Beneficiários
  static getSettingsTable() {
    return {
      selectMode: 'multi',  //single|multi
      hideHeader: false,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Ação',
        add: true,
        edit: true,
        delete: true, 
        custom: [
          { name: "visualizar_beneficiario", title: '<i class="fa fa-eye mr-3" title="Visualizar Beneficiário"></i>' }
        ],
        width:'100%',
        position: 'right' // left|right
      },
      mode: 'external',
      add: {
        addButtonContent: '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
        createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>'
      },
      edit: {
        editButtonContent: '<i class="fa fa-pencil mr-3 text-primary" title="Editar beneficiário"></i>',
        saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>'
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-times-circle text-danger" title="Desativar beneficiário"></i>',
        confirmDelete: true
      },
      noDataMessage: 'Nenhuma Correspondência Encontrada!',
      columns: {
        id:{
          title:'ID',
          filter: false,
          sortDirection:'desc'
        },
        nome_completo:{
          title:"Nome Completo"
        },
        nome_responsavel:{
          title:"Nome Responsável"
        },
        cpf:{
          title:"CPF",
          width:'110px',
        },
        comar_id:{
          title:"COMAR",
          width:'120px',
          filter: {
            type: 'list',
            config: {
              selectText: 'Todos',
              list: [
                {value: '1', title:'I COMAR'},
                {value: '2', title:'II COMAR'},
                {value: '3', title:'III COMAR'},
                {value: '4', title:'IV COMAR'},
                {value: '5', title:'V COMAR'},
                {value: '6', title:'VI COMAR'},
                {value: '7', title:'VII COMAR'},
              ],
            },
          },
          valuePrepareFunction:(cell, row)=>{
            return row.comar_descricao;
         }
        },
        nucleo_descricao:{
          title:"Núcleo"
        },
        municipio:{
          title:"Município",
        },
        uf:{
          title:"UF",
          width:'60px',
        },
 
        pjp:{
          title:"PJP",
          width:'100px',
          filter: {
            type: 'list',
            config: {
              selectText: 'Todos',
              list: [
                {value: '1', title:'Sim'},
                {value: '0', title:'Não'},
                
              ],
            },
          },
          valuePrepareFunction:(data)=>{
             return data?"Sim":"Não";
          }
        }

      },
      pager: {
        display: true,
        perPage: 25
      }
    };
  }



  //Tabela de Beneficiários Inativos
  static getSettingsTableInativos() {
    return {
      selectMode: 'single',  //single|multi
      hideHeader: false,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Ação',
        add: false,
        edit: true,
        delete: true, 
        custom: [
          { name: "visualizar_beneficiario", title: '<i class="fa fa-eye mr-3" title="Visualizar Beneficiário"></i>' }
        ],
        width: '90px',
        position: 'right' // left|right
      },
      mode: 'external',
      edit: {
        editButtonContent: '<i class="fa fa-check-circle mr-3 text-primary text-success" title="Ativar beneficiário"></i>',
        confirmDelete: true,
        saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>'
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-trash-o text-danger" title="Excluir beneficiário"></i>',
        confirmDelete: true
      },
      noDataMessage: 'Nenhuma Correspondência Encontrada!',
            columns: {
        id:{
          title:'ID',
          filter: false,
          sortDirection:'desc'
        },
        nome_completo:{
          title:"Nome Completo"
        },
        nome_responsavel:{
          title:"Nome Responsável"
        },
        cpf:{
          title:"CPF",
          width:'110px',
        },
        comar_id:{
          title:"COMAR",
          width:'120px',
          filter: {
            type: 'list',
            config: {
              selectText: 'Todos',
              list: [
                {value: '1', title:'I COMAR'},
                {value: '2', title:'II COMAR'},
                {value: '3', title:'III COMAR'},
                {value: '4', title:'IV COMAR'},
                {value: '5', title:'V COMAR'},
                {value: '6', title:'VI COMAR'},
                {value: '7', title:'VII COMAR'},
              ],
            },
          },
          valuePrepareFunction:(cell, row)=>{
            return row.comar_descricao;
         }
        },
        nucleo_descricao:{
          title:"Núcleo"
        },
        pjp:{
          title:"PJP",
          width:'100px',
          filter: {
            type: 'list',
            config: {
              selectText: 'Todos',
              list: [
                {value: '1', title:'Sim'},
                {value: '0', title:'Não'},
                
              ],
            },
          },
          valuePrepareFunction:(data)=>{
            return data?"Sim":"Não";
         }
        }
        
      },
      pager: {
        display: true,
        perPage: 25
      }
    };
  }


}