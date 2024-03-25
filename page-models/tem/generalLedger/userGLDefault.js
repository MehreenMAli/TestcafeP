import { Selector } from 'testcafe';
import Table from '../../table';
import { Criteria, textInCell, deleteElement } from '../../../utils/helperFunctions';

export default class UserGLDefault{
    constructor(){
        
        this.addButton = Selector('button.btn.flLeft.btn-primary');
        this.title = Selector('#breadcrumb-title');
        this.userGLDefaultTable = new Table(Selector('#table-default-users'));
        this.reserButton = Selector('#reset-button-default-users');
        this.editButton = Selector('i.fa.fa-pencil');
        this.deleteButton = Selector('i.fa.fa-trash');

        //Filter inputs
        this.fullNameFilterInput = Selector('#user_full_name');
        this.UserNameFilterInput = Selector('#user_name');

        //Add GL Default
        this.label = Selector('label.legend');
        this.userInput = Selector('#user-name-input');
        this.addRow = Selector('i.fa.fa-plus.fa-fw.action-icon');
        this.userInputOptions = Selector('typeahead-container li a');
        this.dropdownsSegments = Selector('cor-dropdown');


        //Buttons
        this.cancelButton = Selector('i.fa.fa-times');
        this.saveButton = Selector('i.fa.fa-check');

        //Modal
        this.modalConfirm = Selector('modal.confirm-modal.modal.fade.in');
        this.modalFooterButton = Selector('div.modal-footer').find('button');
        
    }
}