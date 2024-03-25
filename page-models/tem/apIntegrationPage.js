import { Selector } from 'testcafe';

export default class APIntegration{
    constructor() {
        this.checkboxSend = Selector('input[formcontrolname="ap_integration_option_id"]').nth(0);
        this.checkboxApprove = Selector('input[formcontrolname="ap_integration_option_id"]').nth(1);
        this.checkboxApproveAndSend = Selector('input[formcontrolname="ap_integration_option_id"]').nth(2);
        this.inputFile = Selector('input[formcontrolname="cor360_invoice_drop_file_folder"]');
        this.checkBoxLabels = Selector('label');
        this.saveButton = Selector('#save_btn');
        this.form = Selector('form');
        this.selectSpan = this.form.find('span').nth(0);
        this.inputSpan = this.form.find('span').nth(1);

    }

}