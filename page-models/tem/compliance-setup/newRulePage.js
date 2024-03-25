import { Selector, t } from 'testcafe';
import { error } from '../../../utils/helperFunctions';

export default class NewRulePage{
    constructor(){
        this.ruleNameInput = Selector('input[formcontrolname="rule_name"]');
        this.ruleNameInput.error = error(this.ruleNameInput);
        this.ruleMessageTextarea = Selector('textarea[formcontrolname="rule_message"]');
        this.ruleMessageTextarea.error = error(this.ruleMessageTextarea);
        this.severityTypeDropdown = Selector('div.dropdown-arrow').nth(0);
        this.severityTypeDropdownOptions = this.severityTypeDropdown.find('p');
        this.typeDropdown = Selector('div.dropdown-arrow').nth(1);
        this.typeDropdownOptions = this.severityTypeDropdown.find('p');
        this.aggregationDropdown = Selector('#aggregation-criteria');
        this.aggregationDropdownOptions = this.aggregationDropdown.find('p');
        this.saveButton = Selector('#save-rule');
        this.cancelButton = Selector('#cancel-rule');
    }
}