import { Selector } from 'testcafe';

export default class Expense {
    constructor () { 
        this.amountInput = Selector('input[formcontrolname="amount"]');
        this.categoryDropdown = Selector('#category-dropdown');
        this.businessPurposeTextarea = Selector('textarea[formcontrolname="business_purpose"]');
        this.currencyDropdown = Selector('div.dropdown-arrow').nth(0);
        this.currencyDropdownOptions = this.currencyDropdown.find('p');
        this.commentTextarea = Selector('textarea[formcontrolname="note"]');
        this.projectCodeComboBox = Selector('#project-code-dropdown');
        this.projectCodeDropdown = Selector('div.dropdown-arrow').nth(1);
        this.projectCodeDropdownOptions = this.projectCodeDropdown.find('p');
        this.addReceiptButton = Selector('#add-receipt');
        this.fileUpload = Selector('#file-upload');
        this.saveButton = Selector('#save-edit-expense');
        this.cancelButton = Selector('#cancel-edit-expense');

        //Mobile
        this.expanseDetailLabel = Selector('tem-expenses-edit-collapse label.label-collapse-value')
    }
}