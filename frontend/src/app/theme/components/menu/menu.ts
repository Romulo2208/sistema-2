import { Injectable } from '@angular/core';
import { LoginService } from 'src/app/pages/login/login.service';
import { Menu } from './menu.model';

@Injectable({ providedIn: 'root' })

export class DadosMenu {

    constructor(private loginService:LoginService){}

    getMenuItems() {

        const items = [];

        items.push(new Menu (1, 'Home', '/', null, 'home', null, false, 0));
        


        items.push(new Menu (2, 'Beneficiários', null, null, 'users', null, true, 0));
        items.push(new Menu (21, 'Listar Todos', '/beneficiarios', null, 'list', null, false, 2));
        items.push(new Menu (22, 'Listar Inativos', '/beneficiarios/inativos', null, 'list', null, false, 2));
        items.push(new Menu (23, 'Registar Novo', '/beneficiarios/new', null, 'user-plus', null, false, 2));

        items.push(new Menu (3, 'Efetivo', null, null, 'users', null, true, 0));
        items.push(new Menu (31, 'Listar Todos', '/monitores', null, 'list', null, false, 3));
        items.push(new Menu (33, 'Registar Novo', '/monitores/new', null, 'user-plus', null, false, 3));

        items.push(new Menu (4, 'Núcleos', null, null, 'globe', null, true, 0)); 
        items.push(new Menu (41, 'Listar Todos', '/nucleos', null, 'list', null, false, 4));

        if(this.loginService.hasRole('admin') || this.loginService.hasRole('coordenador_geral')){
            items.push(new Menu (42, 'Novo Núcleo', '/nucleos/new', null, 'plus-circle', null, false, 4));
        }

        items.push(new Menu (10, 'Upload', null, null, 'users', null, true, 0));
        items.push(new Menu(101, 'Documento Modelo', '/uploads/modelo', null, 'file-text', null, false, 10));
        items.push(new Menu(102, 'Documento Núcleo', '/uploads/nucleo', null, 'file-text', null, false, 10));
        items.push(new Menu(103, 'Prestação de Contas', '/uploads/contas', null, 'file-text', null, false, 10));

        items.push(new Menu (5, 'Documentos Modelos', '/documents', null, 'folder-open', null, false, 0));

        if(this.loginService.hasRole('admin') || this.loginService.hasRole('coordenador_geral')){
            items.push(new Menu(6, 'Deficiências', null, null, 'wheelchair-alt', null, true, 0));
            items.push(new Menu(61, 'Listar', '/deficiencias', null, 'list', null, false, 6));
        }

        items.push(new Menu (7, 'Relatórios', null, null, 'file-text-o', null, true, 0));
        items.push(new Menu (71, 'Beneficiários Ativos', '/relatorios/beneficiarios', null, 'file-text-o', null, false, 7));
        items.push(new Menu (72, 'Beneficiários por Escola', '/relatorios/beneficiarios-escola', null, 'file-text-o', null, false, 7));

        if(this.loginService.hasRole('admin') || this.loginService.hasRole('coordenador_geral')){
            items.push(new Menu(88, 'Usuários', null, null, 'user', null, true, 0))
            items.push(new Menu(881, 'Listar', '/usuarios', null, 'list', null, false, 88));
            items.push(new Menu(882, 'Novo', '/usuarios/new', null, 'plus', null, false, 88));
        }
   
        if(this.loginService.hasRole('admin')){
            items.push(new Menu(99, 'Roles / Permissions', null, null, 'lock', null, true, 0));
            items.push(new Menu(991, 'Grupos', '/acl/roles', null, 'lock', null, false, 99));
            items.push(new Menu(992, 'Permissões', '/acl/permissions', null, 'lock', null, false, 99));
            items.push(new Menu(993, 'Módulos', '/acl/modules', null, 'windows', null, false, 99));
        } 
        
        return items;
    }
}
    // new Menu (2, 'Membership', '/membership', null, 'users', null, false, 0), 
    // new Menu (3, 'UI Features', null, null, 'laptop', null, true, 0),   
    // new Menu (4, 'Buttons', '/ui/buttons', null, 'keyboard-o', null, false, 3),  
    // new Menu (5, 'Cards', '/ui/cards', null, 'address-card-o', null, false, 3), 
    // new Menu (6, 'Components', '/ui/components', null, 'creative-commons', null, false, 3),
    // new Menu (7, 'Icons', '/ui/icons', null, 'font-awesome', null, false, 3), 
    // new Menu (8, 'List Group', '/ui/list-group', null, 'th-list', null, false, 3), 
    // new Menu (9, 'Media Objects', '/ui/media-objects', null, 'object-group', null, false, 3), 
    // new Menu (10, 'Tabs & Accordions', '/ui/tabs-accordions', null, 'server', null, false, 3),
    // new Menu (11, 'Typography', '/ui/typography', null, 'font', null, false, 3),
    // new Menu (15, 'Dynamic Menu', '/dynamic-menu', null, 'list-ul', null, false, 0),    
    // new Menu (16, 'Mailbox', '/mailbox', null, 'envelope-o', null, false, 0),
    // new Menu (20, 'Form Elements', null, null, 'pencil-square-o', null, true, 0), 
    // new Menu (21, 'Form Controls', '/form-elements/controls', null, 'check-square-o', null, false, 20),
    // new Menu (22, 'Form Layouts', '/form-elements/layouts', null, 'th-large', null, false, 20),
    // new Menu (23, 'Form Validations', '/form-elements/validations', null, 'exclamation-triangle', null, false, 20),
    // new Menu (24, 'Form Wizard', '/form-elements/wizard', null, 'magic', null, false, 20),
    // new Menu (25, 'Editor', '/form-elements/editor', null, 'pencil', null, false, 20),
    // new Menu (26, 'Tables', null, null, 'table', null, true, 0),
    // new Menu (27, 'Basic Tables', '/tables/basic-tables', null, 'th', null, false, 26), 
    // new Menu (28, 'Dynamic Tables', null, null, 'th-large', null, true, 26), 
    // new Menu (29, 'Smart DataTable', '/tables/dynamic-tables/smart', null, 'caret-right', null, false, 28),
    // new Menu (30, 'NGX DataTable', '/tables/dynamic-tables/ngx', null, 'caret-right', null, false, 28), 
    // new Menu (31, 'Tools', null, null, 'wrench', null, true, 0),
    // new Menu (32, 'Drag & Drop', '/tools/drag-drop', null, 'hand-paper-o', null, false, 31), 
    // new Menu (33, 'Resizable', '/tools/resizable', null, 'expand', null, false, 31), 
    // new Menu (34, 'Toaster', '/tools/toaster', null, 'bell-o', null, false, 31), 
    // new Menu (40, 'Pages', null, null, 'file-text-o', null, true, 0),
    // new Menu (43, 'Login', '/login', null, 'sign-in', null, false, 40),    
    // new Menu (44, 'Register', '/register', null, 'registered', null, false, 40),
    // new Menu (45, 'Blank', '/blank', null, 'file-o', null, false, 40),
    // new Menu (46, 'Error', '/pagenotfound', null, 'exclamation-circle', null, false, 40),
    // new Menu (50, 'Calendar', '/calendar', null, 'calendar', null, false, 0),
    // new Menu (66, 'Maps', null, null, 'globe', null, true, 0),
    // new Menu (67, 'Google Maps', '/maps/googlemaps', null, 'map-marker', null, false, 66),
    // new Menu (68, 'Leaflet Maps', '/maps/leafletmaps', null, 'map-o', null, false, 66),
    // new Menu (70, 'Charts', null, null, 'area-chart', null, true, 0),
    // new Menu (71, 'Bar Charts', '/charts/bar', null, 'bar-chart', null, false, 70),
    // new Menu (72, 'Pie Charts', '/charts/pie', null, 'pie-chart', null, false, 70),
    // new Menu (73, 'Line Charts', '/charts/line', null, 'line-chart', null, false, 70),
    // new Menu (74, 'Bubble Charts', '/charts/bubble', null, 'comment-o', null, false, 70),    
    // new Menu (140, 'Level 1', null, null, 'folder-open-o', null, true, 0),
    // new Menu (141, 'Level 2', null, null, 'folder-open-o', null, true, 140),
    // new Menu (142, 'Level 3', null, null, 'folder-open-o', null, true, 141),
    // new Menu (143, 'Level 4', null, null, 'folder-open-o', null, true, 142),
    // new Menu (144, 'Level 5', null, null, 'folder-o', null, false, 143),
    // new Menu (200, 'External Link', null, 'http://themeseason.com', 'external-link', '_blank', false, 0)


export const horizontalMenuItems = [ 
    // new Menu (1, 'Dashboard', '/', null, 'tachometer', null, false, 0),
    // new Menu (2, 'Membership', '/membership', null, 'users', null, false, 0), 
    // new Menu (3, 'UI Features', null, null, 'laptop', null, true, 0),   
    // new Menu (4, 'Buttons', '/ui/buttons', null, 'keyboard-o', null, false, 3),  
    // new Menu (5, 'Cards', '/ui/cards', null, 'address-card-o', null, false, 3), 
    // new Menu (6, 'Components', '/ui/components', null, 'creative-commons', null, false, 3),
    // new Menu (7, 'Icons', '/ui/icons', null, 'font-awesome', null, false, 3), 
    // new Menu (8, 'List Group', '/ui/list-group', null, 'th-list', null, false, 3), 
    // new Menu (9, 'Media Objects', '/ui/media-objects', null, 'object-group', null, false, 3), 
    // new Menu (10, 'Tabs & Accordions', '/ui/tabs-accordions', null, 'server', null, false, 3),
    // new Menu (11, 'Typography', '/ui/typography', null, 'font', null, false, 3),
    // new Menu (31, 'Tools', null, null, 'wrench', null, true, 3),
    // new Menu (32, 'Drag & Drop', '/tools/drag-drop', null, 'hand-paper-o', null, false, 31), 
    // new Menu (33, 'Resizable', '/tools/resizable', null, 'expand', null, false, 31), 
    // new Menu (34, 'Toaster', '/tools/toaster', null, 'bell-o', null, false, 31), 
    // new Menu (20, 'Form Elements', null, null, 'pencil-square-o', null, true, 0), 
    // new Menu (21, 'Form Controls', '/form-elements/controls', null, 'check-square-o', null, false, 20),
    // new Menu (22, 'Form Layouts', '/form-elements/layouts', null, 'th-large', null, false, 20),
    // new Menu (23, 'Form Validations', '/form-elements/validations', null, 'exclamation-triangle', null, false, 20),
    // new Menu (24, 'Form Wizard', '/form-elements/wizard', null, 'magic', null, false, 20),
    // new Menu (25, 'Editor', '/form-elements/editor', null, 'pencil', null, false, 20),
    // new Menu (26, 'Tables', null, null, 'table', null, true, 20),
    // new Menu (27, 'Basic Tables', '/tables/basic-tables', null, 'th', null, false, 26), 
    // new Menu (28, 'Dynamic Tables', null, null, 'th-large', null, true, 26), 
    // new Menu (29, 'Smart DataTable', '/tables/dynamic-tables/smart', null, 'caret-right', null, false, 28),
    // new Menu (30, 'NGX DataTable', '/tables/dynamic-tables/ngx', null, 'caret-right', null, false, 28), 
    // new Menu (40, 'Pages', null, null, 'file-text-o', null, true, 0),
    // new Menu (15, 'Dynamic Menu', '/dynamic-menu', null, 'list-ul', null, false, 40), 
    // new Menu (43, 'Login', '/login', null, 'sign-in', null, false, 40),    
    // new Menu (44, 'Register', '/register', null, 'registered', null, false, 40),
    // new Menu (45, 'Blank', '/blank', null, 'file-o', null, false, 40),
    // new Menu (46, 'Error', '/pagenotfound', null, 'exclamation-circle', null, false, 40),
    // new Menu (50, 'Calendar', '/calendar', null, 'calendar', null, false, 40),
    // new Menu (16, 'Mailbox', '/mailbox', null, 'envelope-o', null, false, 40), 
    // new Menu (200, 'External Link', null, 'http://themeseason.com', 'external-link', '_blank', false, 40),
    // new Menu (66, 'Maps', null, null, 'globe', null, true, 0),
    // new Menu (67, 'Google Maps', '/maps/googlemaps', null, 'map-marker', null, false, 66),
    // new Menu (68, 'Leaflet Maps', '/maps/leafletmaps', null, 'map-o', null, false, 66),
    // new Menu (70, 'Charts', null, null, 'area-chart', null, true, 0),
    // new Menu (71, 'Bar Charts', '/charts/bar', null, 'bar-chart', null, false, 70),
    // new Menu (72, 'Pie Charts', '/charts/pie', null, 'pie-chart', null, false, 70),
    // new Menu (73, 'Line Charts', '/charts/line', null, 'line-chart', null, false, 70),
    // new Menu (74, 'Bubble Charts', '/charts/bubble', null, 'comment-o', null, false, 70)
]