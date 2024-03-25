import { Selector } from 'testcafe';

export default class OOODelegationPage{
    constructor(){
        this.toggle = Selector('label[for="unchecked"]');
        this.hiddenCheckbox = Selector('#unchecked');
        this.delegationDropdown = Selector('div.dropdown-arrow');
        this.delegationDropdownOptions = this.delegationDropdown.find('p');
        this.fromDatepicker = Selector('#ooo-from');
        this.toDatepicker = Selector('#ooo-to');
        this.updateButton = Selector('#ooo-update');
    }
}