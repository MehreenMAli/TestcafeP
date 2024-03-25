import { Selector, t } from 'testcafe';
import { visible, paste, textInCell, Criteria, deleteElement, clickElement } from '../../utils/helperFunctions';
import Table from '../table';

export default class ExpensesPage{
	constructor(){
		
		this.displayButton = visible(Selector('i.fa-ellipsis-v').nth(0));
		this.restoreToDefaultButton = visible(Selector('#expenses_all-restore-default'));
		this.displayDiv = visible(Selector('div[class="dropdown-cor-columns"]'));
		this.displayItems = this.displayDiv.find('div.row').filter('div:not(.dropdown-cor-columns-title)').find('label');
		this.displayCheckboxes = this.displayDiv.find('div.row').filter('div:not(.dropdown-cor-columns-title)').find('label.cor-checkbox');
		this.displayItemsCheckboxes = this.displayItems.find('input');
		this.applyButton = Selector('#expenses_all-apply-button');
		this.projectCodeComboBoxEditionMode = Selector('#accounts-dropdown');
		
		//Filters
		this.rangePicker = visible(Selector('div.customdatepickerrangepicker'));
		this.categoryInput = visible(Selector('#category_name'));
		this.reportInput = visible(Selector('#report_name'));
		this.businessPurposeInput = visible(Selector('#business_purpose'));
		this.amountStartInput = visible(Selector('#amount-start'));
		this.amountEndInput = visible(Selector('#amount-end'));
		this.accountInput = visible(Selector('#account_name'));
		this.complianceDropdown = visible(Selector('div.dropdown-arrow'));
		this.complianceDropdownOptions = this.complianceDropdown.find('p');

		//All Tab
		this.allTab = Selector('#expenses_all');
		this.allTable = new Table(Selector('#table-expenses_all'));
		this.allResetButton = Selector('#reset-button-expenses_all');
		this.allDate = Selector('#expenses_all-daterangePicker0');
		this.allCategory = Selector('#category_name');
		this.allReport = Selector('#report_name');
		this.allBusinessPurpose = Selector('#business_purpose');
		this.allMinAmount = Selector('#amount-start');
		this.allMaxAmount = Selector('#amount-end');
		this.allProjectCode = Selector('#account_name');
		this.allCompliance = Selector('#compliance_id');
		
		//Unclaimed Tab
		this.unclaimedTab = Selector('#expenses_unclaimed');
		this.unclaimedTable = new Table(Selector('#table-expenses_unclaimed'));
		this.unclaimedResetButton = Selector('#reset-button-expenses_unclaimed');
		
		//Not submitted Tab
		this.notSubmittedTab = Selector('#expenses_not_submitted');
		this.notSubmittedTable = new Table(Selector('#table-expenses_not_submitted'));
		this.notSubmittedResetButton = Selector('#reset-button-expenses_not_submitted');
	
		//Submitted Tab
		this.submittedTab = Selector('#expenses_submitted');
		this.submittedTable = new Table(Selector('#table-expenses_submitted'));
		this.submittedResetButton = Selector('#reset-button-expenses_submitted');

		//Add Expenses
		this.labelsPage = Selector('label.legend');
		this.saveButton = Selector('#save-edit-expense');
		this.receiptButton = Selector('#add-receipt');
		this.cancelButton = Selector('#cancel-edit-expense');
		this.datepickerInput = Selector('input[name="dp1"]');
		this.currencyDropdown = Selector('#currency-dropdown');
		this.amountInput = Selector('#amount-input');
		this.categoryDropdown = Selector('#category-dropdown');
		this.projecCodeDropdown = Selector('#project-code-dropdown'); 
		this.businessPurposeTextarea = Selector('#business-purpose-textarea');
		this.commentTextarea = Selector('#add-comment-textarea');
		this.questionIcon = Selector('.fa-question-circle'); 
		this.addReceiptsModal = Selector('.modal');
		this.addReceiptsModalDoneButton = Selector('#done-button');
		this.billable = Selector('input.cbx.hidden');
		this.billableCheck = Selector('label.lbl');

		// Tab Allocation
		this.allocationTab = Selector('#allocations-tab');
		this.addAllocationButton = Selector('div.col-md-2.text-center > button.btn.btn-primary');
		this.gridAllocation = Selector('div.greyRectangle');
		this.allocationAmountInputs = Selector('input[type="number"]');
		this.plusButtons = Selector("[class='fa fa-plus fa-fw action-icon']");
		this.trashCanButtons = Selector("[class='fa fa-trash action-icon']");

		this.gridAllocationAmoun = Selector('div.rowAmount');
		this.gridAllocationPercentage = Selector('div.rowPercentage');
		this.gridAllocationButtons = Selector('div.rowButtons');
		
		//Edition mode buttons 
		this.editPencilButton = Selector('i.fa.fa-pencil.fa-fw.action-icon.floatRightButton');
		this.greenCheckButton = Selector('i.fa.fa-check.fa-fw.action-icon.greenButton.floatRightButton');
		this.redCancelButton = Selector('i.fa.fa-times.fa-fw.action-icon.redButton.floatRightButton');
		this.firstRowExpensesTable = Selector("#table-expenses_all tr").nth(2);

	}

	async deleteExpense(expenseData){
        let criteria = new Criteria(expenseData, textInCell, deleteElement);
        return await this.allTable.findElement(criteria);
	}
	
	async existsExpense(expenseData){
        let criteria = new Criteria(expenseData, textInCell);
        return await this.allTable.findElement(criteria);
	}
	
	async notExistsExpense(allExpenses,purposeExpend){
		let notExist = true;
		for(let i=0; i<allExpenses.length; i++){
			if(purposeExpend === allExpenses[i].business_purpose){
				notExist = false;
			}
		}
		return notExist;
	}

	async fillAllocationAmounts(totalAmount, totalAllocations) {
		let value = totalAmount/totalAllocations;

	}

	async editExpense(expenseData){
		let criteria = new Criteria(expenseData, textInCell, clickElement);
		return await this.allTable.findElement(criteria);
				
	}
}