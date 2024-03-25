import { Selector } from 'testcafe';

export default class DistanceRangeModal{
    constructor(){
        this.root = Selector('div.modal-dialog');
        this.unitDropdown = this.root.find('div.dropdown-arrow').nth(0);
        this.unitDropdownOptions = this.unitDropdown.find('p');
        this.rateInput = this.root.find('input[formcontrolname="rate"]');
        this.currencyDropdown = this.root.find('div.dropdown-arrow').nth(1);
        this.currencyDropdownOptions = this.currencyDropdown.find('p');
        this.perInput = this.root.find('input[formcontrolname="per"]');
        this.datePicker = this.root.find('input[name="dp1"]');
        this.saveButton = this.root.find('button.btn.btn-primary');
        this.closeButton = this.root.find('button.btn:not(.btn-primary)');
    }
}