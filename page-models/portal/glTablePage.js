import { Selector } from 'testcafe';
import { error } from '../../utils/helperFunctions';

export default class GLTablePage {
    constructor() {
        this.customersDropdown = Selector('cor-dropdown input');
        this.label = Selector('label.legend');
        this.importButton = Selector('#import');
        this.dropdownOptions = Selector('.dropdown-option');
        this.saveButton = Selector('#save');
        this.addTableButton = Selector('#add-table-button');
        this.arrowDownIcon = Selector('.fa-angle-down');
        this.trashIcon = Selector('.fa-trash');
        this.plusIcon = Selector('.fa-plus');
        this.tableRows = Selector('div[formarrayname="tables"]');
        this.tableNameInput = Selector('input[formcontrolname="table_name"]');
        this.tableNameInput.error = error(this.tableNameInput);
        this.columnRows = Selector('div[formarrayname="columns"]');
        this.columnInput = Selector('input[formcontrolname="column_name"]');
        this.columnInput.error = error(this.columnInput);
        this.columnDescriptionInput = Selector('input[formcontrolname="column_description"]');
        this.columnKeyCheckbox = Selector('span.cor-span-checkbox');
        this.columnLengthInput = Selector('input[formcontrolname="column_length"]');
        this.columnLengthInput.error = error(this.columnLengthInput);
        this.columnPlusIcon = this.columnRows.find('.fa-plus');
        this.columnThrashIcon = this.columnRows.find('.fa-trash');
        //MOBILE
        this.mobileToggleMenuButton = Selector('button#hamb-menu');
        this.mobileSetupMenuOption = Selector('#setup');
        this.mobileGlTablesMenuOption = Selector('#gl_table') 

    }

    async getCustomerName(env,clients){
        if(env == 'prod'){
           let client_id = '9999';
           for(let i=0; i<clients.length;i++){
                if(clients[i].client_id == client_id){
                    return clients[i].client_name;
                }
            }
            return null;
        }else{
            return 'Corcentric';
        }
    }

    async deleteTable(allTables, nameTable){
        let portalTables = allTables;
        let deleteTable = new Array();
        let formatData = '';
        let totalCol = 0;
        for(let i=0; i < portalTables.length; i++){
            if(portalTables[i].table_name == nameTable){
               portalTables[i].action = 'delete';
               totalCol = 2;
            }else{
                totalCol = 0;
            }
            formatData = {
                action: portalTables[i].action,
                columns: [],
                columnsUpdated: false,
                previousAction: null,
                table_id: portalTables[i].table_id,
                table_name: portalTables[i].table_name,
                totalColumns: totalCol
            }
            deleteTable[i] = formatData;
        }
        return deleteTable;
    }
}
