import { Selector } from 'testcafe';
import { visible } from '../../utils/helperFunctions';

export default class NewRole{ 
    constructor(){
        this.roleInput = Selector('input[formcontrolname="role_name"]');
        this.addButton = Selector('#add-role-button');
        this.closeButton = visible(Selector('.close'));
        this.defaultCheckbox = Selector('input[formcontrolname="is_default"]');

        this.modalWarning = Selector('modal.info-modal.modal.fade.in');
    }
}