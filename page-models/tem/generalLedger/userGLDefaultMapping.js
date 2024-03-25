import { Selector } from 'testcafe';
import Table from '../../table';
import { Criteria, textInCell, deleteElement, editElement } from '../../../utils/helperFunctions';

export default class UserGLDefaultMapping{
    constructor(){
        
        this.addButton = Selector('#add-new', { visibilityCheck: true });
        this.userGLDefaultTable = new Table(Selector('#table-mappingList'));
        
        
        this.editButton = Selector('i.fa.fa-pencil');
        this.removeButton = Selector('i.fa.fa-trash');
        
        //Add GL Default
        this.label = Selector('label.legend');
        this.userInput = Selector('#user-name-input');
        this.mapNameInput = Selector('#mapping-name-textbox');
        this.hasHeadersCheckBox = Selector('#has-header-checkbox i.cor-icon-checkbox.fa.fa-check');
        this.fileInput = Selector('#file-upload');
        this.importButton = Selector('#usr-map-import-button');
        this.testButton = Selector('#usr-map-test-button');
        this.saveButton = Selector('#usr-map-save-button');
        this.addRow = Selector('i.fa.fa-plus.fa-fw.action-icon');
        this.title = Selector('#breadcrumb-title');
        this.tableDropdownsContainer = Selector('#mapping-container table');
        this.primaryDropDownsRow = Selector('#primary_fields_row cor-dropdown');
        this.secondaryDropDownsRow = Selector('#secundary_fields_row cor-dropdown');
        this.textAreaTest = Selector('#tests');
        this.closeButton = Selector('[title="Close"]');


        //Buttons
        this.cancelButton = Selector('i.fa.fa-times');

        //Modal
        this.modalConfirm = Selector('modal.confirm-modal.modal.fade.in');
        this.modalFooterButton = Selector('div.modal-footer').find('button');
        
    }

    async existMapOnTable(mapName){
        let criteria = new Criteria(mapName, textInCell);
        return this.userGLDefaultTable.findElement(criteria);
    }

    async deleteMap(mapName){
        let criteria = new Criteria(mapName, textInCell, deleteElement);
        return this.userGLDefaultTable.findElement(criteria);
    }

    async editMap(mapName){
        let criteria = new Criteria(mapName, textInCell, editElement);
        return this.userGLDefaultTable.findElement(criteria);
    }

}