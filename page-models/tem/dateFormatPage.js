import { Selector } from 'testcafe';

export default class DateFormatPage{
    constructor(){
        this.formatDropdown = Selector('#selected-date');
        this.formatDropdownOptions = this.formatDropdown.find('option');
        this.saveButton = Selector('#save');
        this.closeButton = Selector('#close-account');
        this.modal = Selector('.modal');
        this.okButtonModal = this.modal.find('button');
    }
}