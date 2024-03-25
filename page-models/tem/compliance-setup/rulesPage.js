import { Selector, t } from 'testcafe';
import { textInCell, deleteElement, Criteria, editElement } from '../../../utils/helperFunctions';
import Table from '../../table';

export default class RulesPage{
    constructor(){
        this.rulesListTab = Selector('#rules-list');
        this.rulesListTable = new Table(Selector('#table-tem-rules'));
        this.rulesActivityTab = Selector('#rules-activity');
        this.rulesActivityTable = Selector('#table-tem-rules');
        this.rulesActivityTableHeaders = this.rulesActivityTable.find('th');
        this.addNewRuleButton = Selector('#add-new-rule', { visibilityCheck: true });
        this.ruleNameInput =  Selector('input[formcontrolname="rule_name"]');
        this.ruleMessageTextarea =  Selector('textarea[formcontrolname="rule_message"]');
        this.ruleCriteriaDropdown = Selector('div.col-md-3.col-lg-3.box-rule-criteria');
        this.saveButton =  Selector('#save-rule');
        this.cancelButton = Selector('#cancel-rule');
    }

    async deleteRule(ruleName){
        let criteria = new Criteria(ruleName, textInCell, deleteElement);
        await t.click(this.rulesListTab).wait(2000);
        return await this.rulesListTable.findElement(criteria);
    }

    async existsRule(ruleName){
        let criteria = new Criteria(ruleName, textInCell);
        await t.click(this.rulesListTab).wait(2000);
        return await this.rulesListTable.findElement(criteria);
    }

    async editRule(ruleName){
        let criteria = new Criteria(ruleName, textInCell, editElement);
        await t.click(this.rulesListTab).wait(2000);
        return await this.rulesListTable.findElement(criteria);
    }
}