import { DatePipe } from "@angular/common";
import { EmptyEditorComponent } from "./empty-editor.component";


export class AclHelper {

  static getSettingsTable() {
    return {
      selectMode: 'single',  //single|multi
      hideHeader: false,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Ação',
        add: true,
        edit: true,
        delete: true,

        width: '120px',
        position: 'right' // left|right
      },
      mode: 'inline',
      add: {
        addButtonContent: '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success" title="Criar Tipo Evento"></i></h4>',
        createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
        confirmCreate: true,
      },
      edit: {
        editButtonContent: '<i class="fa fa-pencil mr-3 text-primary" title="Editar Evento"></i>',
        saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
        confirmSave: true
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-trash-o text-danger" title="Deletar Evento"></i>',
        confirmDelete: true
      },
      noDataMessage: 'Nenhuma Correspondência Encontrada!',
      columns: {
        name: {
          title: 'Título',
          //  with: '100px',
        },
        description: {
          title: 'Descrição',
          //  with: '100px',
        },
        slug: {
          title: 'Slug',
          //width: '500px'
        },
      },
      pager: {
        display: true,
        perPage: 5,
        doEmit: false
      }
    };
  }


    
  static getRolesTable() {
    return {
      selectMode: 'single',  //single|multi
      hideHeader: false,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Ação',
        add: true,
        edit: true,
        delete: true,

        width: '120px',
        position: 'right' // left|right
      },
      mode: 'inline',
      add: {
        addButtonContent: '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success" title="Criar Tipo Evento"></i></h4>',
        createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
        confirmCreate: true,
      },
      edit: {
        editButtonContent: '<i class="fa fa-pencil mr-3 text-primary" title="Editar Evento"></i>',
        saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
        confirmSave: true
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-trash-o text-danger" title="Deletar Evento"></i>',
        confirmDelete: true
      },
      noDataMessage: 'Nenhuma Correspondência Encontrada!',
      columns: {
        name: {
          title: 'Título',
          //  with: '100px',
        },
        slug: {
          title: 'Slug',
          //  with: '100px',
        },
        description: {
          title: 'Descrição',
          //  with: '100px',
        },
        permissions: {
          
          title: 'Permissões',
          editable:false,
          editor:{
            type:'custom',
            component: EmptyEditorComponent,//para não permitir insert das permissões na criação
          },
          type:'html',
          valuePrepareFunction(cell, row){
            let custom_html = '';
           
            const colors = ['bg-info', 'bg-danger', 'bg-warning', 'bg-success', 'bg-primary', 'bg-secondary', 'bg-dark'];
            let count = 0;

            if(row.permissions.length === 0){
              custom_html += `<span class="bg-light"} p-1 ml-1 small rounded text-black">Sem Função</span>`;
              return custom_html;
            }

            cell.forEach(role=>{
              
              if(count > colors.length){
                count = colors.length-1;
              }
              
              custom_html += `<span class=" ${colors[count]} p-1 ml-1 small rounded text-white">${role.name}</span>`;
              count++;

            });

            return custom_html;
          }
          
        },
      },
      pager: {
        display: true,
        perPage: 5,
        doEmit: false
      }
    };
  }


  static getModulesTable() {
    return {
      selectMode: 'single',  //single|multi
      hideHeader: false,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Ação',
        add: true,
        edit: true,
        delete: true,

        width: '120px',
        position: 'right' // left|right
      },
      mode: 'inline',
      add: {
        addButtonContent: '<h4 class="mb-1"><i class="fa fa-plus ml-3 text-success" title="Criar Tipo Evento"></i></h4>',
        createButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
        confirmCreate: true,
      },
      edit: {
        editButtonContent: '<i class="fa fa-pencil mr-3 text-primary" title="Editar Evento"></i>',
        saveButtonContent: '<i class="fa fa-check mr-3 text-success"></i>',
        cancelButtonContent: '<i class="fa fa-times text-danger"></i>',
        confirmSave: true
      },
      delete: {
        deleteButtonContent: '<i class="fa fa-trash-o text-danger" title="Deletar Evento"></i>',
        confirmDelete: true
      },
      noDataMessage: 'Nenhuma Correspondência Encontrada!',
      columns: {
        name: {
          title: 'Título',
          //  with: '100px',
        },
        slug: {
          title: 'Slug',
          //  with: '100px',
        },
        description: {
          title: 'Descrição',
          //  with: '100px',
        },
        roles: {
          
          title: 'Grupos',
          editable:false,
          editor:{
            type:'custom',
            component: EmptyEditorComponent,//para não permitir insert das permissões na criação
          },
          type:'html',
          valuePrepareFunction(cell, row){
            let custom_html = '';
           
            const colors = ['bg-info', 'bg-danger', 'bg-warning', 'bg-success', 'bg-primary', 'bg-secondary', 'bg-dark'];
            let count = 0;

            if(row.roles === undefined || row.roles.length === 0){
              custom_html += `<span class="bg-light"} p-1 ml-1 small rounded text-black">Sem Função</span>`;
              return custom_html;
            }

            cell.forEach(role=>{
              
              if(count > colors.length){
                count = colors.length-1;
              }
              
              custom_html += `<span class=" ${colors[count]} p-1 ml-1 small rounded text-white">${role.name}</span>`;
              count++;

            });

            return custom_html;
          }
          
        },
      },
      pager: {
        display: true,
        perPage: 25,
        doEmit: false
      }
    };
  }

}
