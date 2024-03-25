import { Selector } from 'testcafe';
import { error } from '../../../utils/helperFunctions';

export default class NewUser{
    constructor(){
        this.username = Selector('input[formcontrolname="user_name"]');
        this.username.error = error(this.username);
        this.firstName = Selector('input[formcontrolname="first_name"]');
        this.firstName.error = error(this.firstName);
        this.email = Selector('input[formcontrolname="email"]');
        this.email.error = error(this.email);
        this.middleName = Selector('input[formcontrolname="middle_name"]');
        this.statusDropdown = Selector('div.dropdown-arrow');
        this.statusDropdownOptions = this.statusDropdown.find('p');
        this.lastName = Selector('input[formcontrolname="last_name"]');
        this.lastName.error = error(this.lastName);
        this.customOne = Selector('input[formcontrolname="custom1"]');
        this.phoneNumber = Selector('input[formcontrolname="phone"]');
        this.customTwo = Selector('input[formcontrolname="custom2"]');
        this.saveButton = Selector('#save-user');
        this.cancelButton = Selector('#cancel-user');

        //Modal for cancel button
        this.modalConfirm = Selector('modal.confirm-modal.modal.fade.in');
        this.modalFooter = this.modalConfirm.find('div.modal-footer');
        this.modalAcceptButton = this.modalFooter.find('button').nth(0);
        this.modalCancelButton = this.modalFooter.find('button').nth(1);
    }
}