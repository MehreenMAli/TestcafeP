import { Selector } from 'testcafe';

export default class ApprovalRoutingPage{
    constructor(){
        this.span = Selector('form span');
        this.radioButtons = Selector('input[formcontrolname="ap_integration_option_id"]');
        this.radioButtonsLabels = this.radioButtons.parent('label');
        this.saveButton = Selector('#save_btn');
    }
}