import { Selector } from 'testcafe';

export default class PaymentAccountsPage {
    constructor () { 
        this.accountsDropdown = Selector('div.dropdown-arrow');
        this.accountsDropdownOptions = this.accountsDropdown.find('p');
        this.editButton = Selector('#edit-payment-account');
        this.addNewButton = Selector('#new-payment-account');
        this.deleteButton = Selector('#delete-payment-account');

        this.deleteModal = Selector('#delete-payment-account-act');
        this.cancelModal = Selector('#cancel-delete');
        
        this.accounts = Selector('input.filters.ng-pristine.ng-valid.ng-touched');

    }
}