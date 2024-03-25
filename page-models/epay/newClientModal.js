import { Selector } from 'testcafe';
import { error } from '../../utils/helperFunctions';

export default class NewClientModal {
    constructor () { 
        this.accountNameInput = Selector('input[formcontrolname="account_name"]');
        this.accountNameInput.error = error(this.accountNameInput);
        this.customerNameInput = Selector('input[formcontrolname="customer_name"]');
        this.customerNameInput.error = error(this.customerNameInput);
        this.gpVendorIdInput = Selector('input[formcontrolname="gp_vendor_id"]');
        this.gpVendorIdInput.error = error(this.gpVendorIdInput);
        this.clientNotifyEmailInput = Selector('input[formcontrolname="client_notify_email"]');
        this.clientNotifyEmailInput.error = error(this.clientNotifyEmailInput);
        this.routingInput = Selector('input[formcontrolname="routing"]');
        this.bankAccountInput = Selector('input[formcontrolname="bank_account"]');
        this.urlInput = Selector('input[formcontrolname="url"]');
        this.urlInput.error = error(this.urlInput);
        this.testCheckbox = Selector('#test-mode-checkbox');
        this.suppressNachaCheckbox = Selector('#suppress-nacha-checkbox');
        this.autoReleaseCheckbox = Selector('#enable-auto-release-checkbox');
        this.currencyTypeDropdown = Selector('div.dropdown-arrow').nth(0);
        this.currencyTypeDropdownOptions = this.currencyTypeDropdown.find('p');
        this.paymentPartnerDropdown = Selector('div.dropdown-arrow').nth(1);
        this.paymentPartnerDropdownOptions = this.paymentPartnerDropdown.find('p');
        this.paymentFilenameInput = Selector('input[formcontrolname="payment_account_filename"]')
        this.paymentFilenameInput.error = error(this.paymentFilenameInput);
        this.clientCodeInput = Selector('input[formcontrolname="customer_code"]');
        this.clientCodeInput.error = error(this.clientCodeInput);
        this.clientCheckStringInput = Selector('input[formcontrolname="check_string"]');
        this.clientCheckStringInput.error = error(this.clientCheckStringInput);
        this.corBankAccountDropdown = Selector('div.dropdown-arrow').nth(2);
        this.corBankAccountDropdownOptions = this.corBankAccountDropdown.find('p');
        this.saveButton = Selector('#save-cte');
        this.closeButton = Selector('#close');
    }
}