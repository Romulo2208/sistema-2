
export class DeficienciaHelper {

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

        tipo: {
          title: 'Tipo de Deficiência',
          //  with: '100px',
        },
      },
      pager: {
        display: true,
        perPage: 20,
        doEmit: false
      }
    };
  }



}
