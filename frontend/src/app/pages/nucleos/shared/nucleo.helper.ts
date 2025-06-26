import { DatePipe } from '@angular/common';

export class NucleoHelper {
  static getSettingsTable(showButtonAdd:boolean, showButtonEdit:boolean, showButtonDelete:boolean) {

    

    return {
      selectMode: 'single',  //single|multi
      hideHeader: false,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Ação',
        add: showButtonAdd,
        edit: showButtonEdit,
        delete: showButtonDelete, 
        custom: [
          { name: "visualizar_nucleo", title: '<i class="fa fa-eye mr-3" title="Visualizar Núcleo"></i>' }
        ],
        width: '90px',
        position: 'right' // left|right
      },
      mode: 'external',
      add: {
        addButtonContent: '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success"></i></h4>',
        createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>'
      },
      edit: {
        editButtonContent: '<i class="fa fa-pencil mr-3 text-primary"></i>',
        saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>'
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-trash-o text-danger"></i>',
        confirmDelete: true
      },
      noDataMessage: 'Nenhuma Correspondência Encontrada!',
      columns: {
        id:{
          title:'ID',
          width:'70px',
          sortDirection:'desc',
          filter:false
        },
        descricao:{
          title:"Descrição",
        },
        municipio:{
          title:"Município",
        },
        uf:{
          title:"UF",
          width:'70px'
        },
        regiao:{
          title:"Região",
          width:'150px'
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
        dias_turnos:{
          title:"Dias de Funcionamento",
          type:'html',
          filter:false,
          valuePrepareFunction: (cell, row) => { 
            
            let dias_funcionamento = "";

            row.dia_turno_nucleos.forEach(e=>{
              dias_funcionamento+= `<span class='btn btn-secondary btn-sm mb-1'>${e.descricao}</span> `
            });

            return dias_funcionamento;
          }
        },
       
        // created_at:{
        //   title: 'Criado',
        //   valuePrepareFunction: (date) => { 
        //     const raw = new Date(date);
        //     const formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
        //     return formatted; 
        //   }
        // },
        // updated_at:{
        //   title: 'Atualizado',
        //   valuePrepareFunction: (date) => { 
        //     const raw = new Date(date);
        //     const formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
        //     return formatted; 
        //   }
        // }
     

      },
      pager: {
        display: true,
        perPage: 25
      }
    };
  }


}