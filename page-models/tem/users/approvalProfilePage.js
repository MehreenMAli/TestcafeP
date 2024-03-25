import { Selector } from 'testcafe';

export default class ApprovalProfile{
    constructor(){
        this.saveButton = Selector('button.btn.flLeft.btn-primary').nth(0);
        this.cancelButton = Selector('button.btn.flLeft.btn-primary').nth(1);
        this.defaultCheckbox = Selector('input[name="profileType"]').nth(0);
        this.customCheckbox = Selector('input[name="profileType"]').nth(1);
        this.includeManagerCheckbox = Selector('input[type="checkbox"]');
        this.dropdown = Selector('div.dropdown-arrow').nth(0);
        this.table = Selector('table[id="table-approval"]');
        this.tableHeaders = this.table.find('th');
        this.addButton = Selector('button.btn.btn-primary.pull-right').nth(0);
        
        //Add Approver Modal
        this.findApproverInput = Selector('input[typeaheadoptionfield="approver_name"]');
        this.approverDropdown = Selector('div.dropdown-arrow').nth(1);
        this.saveApproverButton = Selector('button.btn.btn-primary.pull-right').nth(1);
    }
}