import { Selector } from 'testcafe';
import { error } from '../../utils/helperFunctions';

export default class BankAccountModal {
    constructor () {
        this.bankNameInput = Selector('input[formcontrolname="bank_name"]');
        this.bankNameInput.error = error(this.bankNameInput);
        this.bankAccountNameInput = Selector('input[formcontrolname="bank_account_name"]');
        this.bankAccountNameInput.error = error(this.bankAccountNameInput);
        this.accountNumberInput = Selector('input[formcontrolname="account_number"]');
        this.accountNumberInput.error = error(this.accountNumberInput);
        this.routingNumberInput = Selector('input[formcontrolname="routing_number"]');
        this.routingNumberInput.error = error(this.routingNumberInput);
        this.gpCheckbookIdInput = Selector('input[formcontrolname="gp_checkbook_id"]');
        this.gpCheckbookIdInput.error = error(this.gpCheckbookIdInput);
        this.currencyDropdown = Selector('div.dropdown-arrow');
        this.currencyDropdownOptions = this.currencyDropdown.find('p');
        this.datePicker = Selector('#effective-date');
        this.datePicker.error = error(this.datePicker);
        this.description = Selector('textarea[formcontrolname="description"]');
        this.saveButton = Selector('#bank-save');
        this.deactivateButton = Selector('#bank-deactivate');
        this.cancelButton = Selector('#bank-cancel');

        //Modal confirm
        this.modalConfirm = Selector('modal.confirm-modal.modal');

        //Modal Info
        this.modalInfoEdit = Selector('modal.info-modal.modal');

        this.modalTitle = Selector('modal[class="modal fade in"]').find('h4');
        this.cancelAuditTrailButton = Selector('modal[class="modal fade in"]').find('button');

    }
}

