import { Selector } from 'testcafe';
import Table from '../table';
import { Criteria, textInCell, error, clickElement } from '../../utils/helperFunctions';

export default class ReportsPage{
    constructor(){
        this.resetButton = Selector('#reset-button-reports_all');
        this.toggler = Selector('i.fa-angle-left');
        this.displayDropdown = Selector('#dropdownToggle');
        this.restoreDefaultButton = Selector('#restoreDefault');
        
        //All Tab
        this.allTab = Selector('#reports_all');
        this.allTable = new Table(Selector('#table-reports_all'));
        this.allTabRestore = this.allTable.find('#reports_all-restore-default');
        this.allTabApply = this.allTable.find('#reports_all-apply-button');
        this.allNameInput = this.allTable.find('#report_name');
        this.allPeriodDatepicker = Selector('#reports_all-daterangePicker1');
        this.allDateSubmittedDatepicker = Selector('#reports_all-daterangePicker2');
        this.allAmountStartInput = this.allTable.find('#amount-start');
        this.allAmountEndInput = this.allTable.find('#amount-end');
        this.allCompDropdown = this.allTable.find('div.dropdown-arrow').nth(0);
        this.allCompDropdownOptions = this.allCompDropdown.find('p');
        this.allStatDropdown = this.allTable.find('div.dropdown-arrow').nth(1);
        this.allStatDropdownOptions = this.allStatDropdown.find('p');
        this.allResetButton = Selector('#reset-button-reports_all');
        this.firstRowReportsTable = Selector('#table-reports_all tbody tr');

        //Pending Tab
        this.pendingTab = Selector('#reports_pending_approval');
        this.pendingTable = new Table(Selector('#table-reports_pending_approval'));
        this.pendingNameInput = this.pendingTable.find('#report_name');
        this.pendingPeriodDatepicker = Selector('#reports_pending_approval-daterangePicker1');
        this.pendingDateSubmittedDatepicker = Selector('#reports_pending_approval-daterangePicker2');
        this.pendingAmountStartInput = this.pendingTable.find('#amount-start');
        this.pendingAmountEndInput = this.pendingTable.find('#amount-start');
        this.pendingCompDropdown = this.pendingTable.find('div.dropdown-arrow').nth(0);
        this.pendingCompDropdownOptions = this.pendingCompDropdown.find('p');
        this.pendingStatDropdown = this.pendingTable.find('div.dropdown-arrow').nth(1);
        this.pendingStatDropdownOptions = this.pendingStatDropdown.find('p');

        //Approved Tab
        this.approvedTab = Selector('#reports_approved');
        this.approvedTable = new Table(Selector('#table-reports_approved'));
        this.approvedNameInput = this.approvedTable.find('#report_name');
        this.approvedPeriodDatepicker = Selector('#reports_approved-daterangePicker1');
        this.approvedDateSubmittedDatepicker = Selector('#reports_approved-daterangePicker2');
        this.approvedAmountStartInput = this.approvedTable.find('#amount-start');
        this.approvedAmountEndInput = this.approvedTable.find('#amount-start');
        this.approvedCompDropdown = this.approvedTable.find('div.dropdown-arrow').nth(0);
        this.approvedCompDropdownOptions = this.approvedCompDropdown.find('p');
        this.approvedStatDropdown = this.approvedTable.find('div.dropdown-arrow').nth(1);
        this.approvedStatDropdownOptions = this.approvedStatDropdown.find('p');

        //Rejected Tab
        this.rejectedTab = Selector('#reports_rejected');
        this.rejectedTable = new Table(Selector('#table-reports_rejected'));
        this.rejectedNameInput = this.rejectedTable.find('#report_name');
        this.rejectedPeriodDatepicker = Selector('#reports_rejected-daterangePicker1');
        this.rejectedDateSubmittedDatepicker = Selector('#reports_rejected-daterangePicker2');
        this.rejectedAmountStartInput = this.rejectedTable.find('#amount-start');
        this.rejectedAmountEndInput = this.rejectedTable.find('#amount-start');
        this.rejectedCompDropdown = this.rejectedTable.find('div.dropdown-arrow').nth(0);
        this.rejectedCompDropdownOptions = this.rejectedCompDropdown.find('p');
        this.rejectedStatDropdown = this.rejectedTable.find('div.dropdown-arrow').nth(1);
        this.rejectedStatDropdownOptions = this.rejectedStatDropdown.find('p');

        //Paid Tab
        this.paidTab = Selector('#reports_paid');
        this.paidTable = new Table(Selector('#table-reports_paid'));
        this.paidNameInput = this.paidTable.find('#report_name');
        this.paidPeriodDatepicker = Selector('#reports_paid-daterangePicker1');
        this.paidDateSubmittedDatepicker = Selector('#reports_paid-daterangePicker2');
        this.paidAmountStartInput = this.paidTable.find('#amount-start');
        this.paidAmountEndInput = this.paidTable.find('#amount-start');
        this.paidCompDropdown = this.paidTable.find('div.dropdown-arrow').nth(0);
        this.paidCompDropdownOptions = this.paidCompDropdown.find('p');
        this.paidStatDropdown = this.paidTable.find('div.dropdown-arrow').nth(1);
        this.paidStatDropdownOptions = this.paidStatDropdown.find('p');

        //Draft Tab
        this.draftTab = Selector('#reports_draft');
        this.draftTable = new Table(Selector('#table-reports_draft'));
        this.draftNameInput = this.draftTable.find('#report_name');
        this.draftPeriodDatepicker = Selector('#reports_draft-daterangePicker1');
        this.draftDateSubmittedDatepicker = Selector('#reports_draft-daterangePicker2');
        this.draftAmountStartInput = this.draftTable.find('#amount-start');
        this.draftAmountEndInput = this.draftTable.find('#amount-start');
        this.draftCompDropdown = this.draftTable.find('div.dropdown-arrow').nth(0);
        this.draftCompDropdownOptions = this.draftCompDropdown.find('p');
        this.draftStatDropdown = this.draftTable.find('div.dropdown-arrow').nth(1);
        this.draftStatDropdownOptions = this.draftStatDropdown.find('p');

        //Create
        this.labelsPage = Selector('label.legend');
        this.saveButton = Selector('#save');
        this.fromDatepicker = Selector('#start-date');
        this.toDatepicker = Selector('#end-date');
        this.reportNameInput = Selector('#report-name-input'); 
        this.businessPurposeInput = Selector('#business-purpose-textarea');
        this.projectCodeDropdown = Selector('#project-code-dropdown');
        this.projectCodeOptions = Selector('div.dropdown-options');
        this.tooltip = Selector('i.fa.fa-question-circle');
        
        this.reportNameInput.error = error(this.reportNameInput);
        this.businessPurposeInput.error = error(this.businessPurposeInput);
        this.toDatepicker.error = error(this.toDatepicker);

        //Edition mode
        this.pencilEditButton = Selector('i.fa.fa-pencil.fa-fw.action-icon.editButton');
        this.greenCheckButton = Selector('i.fa.fa-check.fa-fw.action-icon.greenButton.editButton');
        this.redCancelButton = Selector('i.fa.fa-times.fa-fw.action-icon.redButton.editButton');

    }

    async findReport(reportName){
        let criteria = new Criteria(reportName,textInCell);
        return await this.allTable.findElement(criteria);
    }

    async editReport(reportName){
        let criteria = new Criteria(reportName, textInCell, clickElement);
        return await this.allTable.findElement(criteria);
    }
}