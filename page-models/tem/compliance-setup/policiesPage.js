import { Selector, t } from 'testcafe';
import { textInCell, deleteElement, Criteria, editElement } from '../../../utils/helperFunctions';
import Table from '../../table';

export default class PoliciesPage{
    constructor(){
        this.policiesListTab = Selector('#policies-list');
        this.policiesListTable = new Table(Selector('#table-tem-policies-list'));
        
        this.policiesActivityTab = Selector('#policies-activity');
        this.policiesActivityTable = new Table(Selector('#table-tem-policy-activities'));

        this.addNewPolicyButton = Selector('#add-new-policy', {visibility: true});

        //Manage Policy
        this.policyNameInput = Selector('input[formcontrolname="policy_name"]');
        this.saveButton = Selector('#save-policy');
        this.cancelButton = Selector('#cancel-policy');
        this.addRule = Selector('button.btn.flLeft.btn-primary').nth(2);
        this.approvedRadio = Selector('input[formcontrolname="policy_check_type_id"]').nth(0);
        this.submittedRadio = Selector('input[formcontrolname="policy_check_type_id"]').nth(1);

        //Modal
        this.modalSelect = Selector('modal.fade.in');
        this.addRuleLibraryButton = this.modalSelect.find('button').nth(1);
        this.createRuleButton = this.modalSelect.find('button').nth(2);

        this.modalRulesLibrery = Selector('modal.modal.fade.in');
        this.ruleTable = new Table(this.modalRulesLibrery.find('table'));

        //Modal Confirm
        this.modalConfirm = Selector('modal.confirm-modal.modal.fade.in');
        this.buttonConfirmModal = this.modalConfirm.find('button').nth(1);

    }

    async deletePolicy(policyName){
        let criteria = new Criteria(policyName, textInCell, deleteElement);
        await t.click(this.policiesListTab).wait(2000);
        return await this.policiesListTable.findElement(criteria);
    }

    async searchPolicy(policyName){
        let criteria = new Criteria(policyName, textInCell);
        await t.click(this.policiesListTab).wait(2000);
        return await this.policiesListTable.findElement(criteria);
    }

    async editPolicy(policyName){
        let criteria = new Criteria(policyName, textInCell, editElement);
        await t.click(this.policiesListTab).wait(2000);
        return await this.policiesListTable.findElement(criteria);
    }
}