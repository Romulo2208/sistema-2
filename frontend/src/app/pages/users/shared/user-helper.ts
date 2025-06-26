import { DatePipe } from '@angular/common';

export class UserHelper {

  

  static getSettingsTable(p_is_admin=false, p_is_coordenador=false) {

    return {
      selectMode: 'multi',  //single|multi
      hideHeader: false,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Ação',
        add: (p_is_admin || p_is_coordenador),
        edit: (p_is_admin || p_is_coordenador),
        delete: (p_is_admin || p_is_coordenador), 
        custom: [
          // { name: "experts-by-cliente", title: '<i class="fa fa-reddit-alien mr-3 text-primary" title="Meus Robôs" ></i>' },
          // { name: "reset_passowrd", title: '<span  class="fa-passwd-reset fa-stack mr-2"><img width=17 src="assets/img/password-reset.svg"></span>' },
        ],
        width: '100px',
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
          title: 'ID',
          width: '80px',
          filter:false,
          sortDirection:'desc'
        },
      
        name:{
          title:'Nome',
          width: '800px',
        },
        
        email: {
          title: 'Email',
        },
        username: {
          title: 'Username'
        },
        roles:{
          title:'Função',
          filter:false,
          sort:false,
          type:'html',
          valuePrepareFunction(cell, row){
            let custom_html = '';

            if( (row.roles !== undefined && row.roles.length === 0) || !cell){
              custom_html += `<span class="bg-light"} p-1 ml-1 small rounded text-black">Sem Função</span>`;
              return custom_html;
            }
            
            cell.forEach(role=>{
              if (role.slug === "admin"){
                custom_html += `<span class=" bg-primary p-1 ml-1 small rounded text-white">${role.name}</span>`;
              }
              if (role.slug === "coordenador_geral"){
                custom_html += `<span class=" bg-danger p-1 ml-1 small rounded text-white">${role.name}</span>`;
              }
              if (role.slug === "gestor_regional"){
                custom_html += `<span class=" bg-success p-1 ml-1 small rounded text-white">${role.name}</span>`;
              }
              if (role.slug === "gestor_nacional"){
                custom_html += `<span class=" bg-secondary p-1 ml-1 small rounded text-white">${role.name}</span>`;
              }
              if (role.slug === "coordenador_nucleo"){
                custom_html += `<span class=" bg-warning p-1 ml-1 small rounded text-white">${role.name}</span>`;
              }
            });

            return custom_html;
          }
          
        }
        
      },
      pager: {
        display: true,
        perPage: 20
      }
    };
  }


}