import { Selector } from 'testcafe';
import { visible } from '../../utils/helperFunctions';
import Table from '../table';

export default class AddEditGroupsModal{
    constructor(){
        this.title = Selector('.modal-title');
        this.labelLegend = Selector('label.legend');
        this.groupTypeDropdown = visible(Selector('#addedit-group-type-dropdown input')); 
        this.groupNameInput = Selector('#addedit-group-name-input');
        this.groupTypeID = Selector('#addedit-group-type-id-label');
        this.groupID = Selector('#addedit-group-id-label');
        this.groupsTable = new Table(visible(Selector('.table')));
        this.parentGroupDropdown = Selector('#addedit-group-list-dropdown input') 
        this.groupNameTable = Selector('#addedit-results-table');
        this.saveButton = Selector('#addedit-save-button');
        this.cancelButton = Selector('#addedit-cancel-button');

        this.button = visible(Selector('button.btn.btn-primary'));
        this.dropdownOptions = Selector('div.dropdown-options p')
    }
}