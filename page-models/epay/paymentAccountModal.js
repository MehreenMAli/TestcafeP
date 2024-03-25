import { Selector } from 'testcafe';
import { error } from '../../utils/helperFunctions';
//Same Page Object for "Add New" and "Edit" Payment Accounts

export default class PaymentAccountModal {
    constructor () { 
        this.accountNameInput = Selector('input[formcontrolname="payment_account_name"]');
        this.accountNameInput.error = error(this.accountNameInput);
        this.accountTypeDropdown = Selector('select[formcontrolname="payment_account_type_id"]');
        this.accountTypeDropdownOptions = this.accountTypeDropdown.find('option');
        this.inputDirectoryInput = Selector('input[formcontrolname="payment_account_input_directory"]');
        this.outputDirectoryInput = Selector('input[formcontrolname="payment_account_output_directory"]');
        this.prenoteDirectoryInput = Selector('input[formcontrolname="payment_account_prenote_directory"]');
        this.saveButton = Selector('#save-payment-account');
        this.cancelButton = Selector('#close');
    }
}