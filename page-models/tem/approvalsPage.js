import { Selector } from 'testcafe';
import { visible } from '../../utils/helperFunctions';
import Table from '../table';

export default class ApprovalsPage{
    constructor(){
        //Filters
        this.nameInput = visible(Selector('#report_name'));
        this.periodDatepicker = visible(Selector('div.customdatepickerrangepicker')).nth(0);
        this.submittedDatepicker = visible(Selector('div.customdatepickerrangepicker')).nth(1);
        this.minInput = visible(Selector('#amount-start'));
        this.maxInput = visible(Selector('#amount-end'));
        this.complianceDropdown = visible(Selector('div.dropdown-arrow')).nth(0);
        this.complianceDropdownOptions = this.complianceDropdown.find('p');
        this.statusDropdown = visible(Selector('div.dropdown-arrow')).nth(1);
        this.statusDropdownOptions = this.statusDropdown.find('p');
 
        //All Tab
        this.allTab = Selector('#approvals_status_all');
        this.allTable = new Table(Selector('#table-approvals_status_all'));
        this.allReportName = Selector('#report_name');
        this.allSubmittedBy = Selector('#last_name');
        this.allPeriod = Selector('#approvals_status_all-daterangePicker2');
        this.allDateSubmitted = Selector('#approvals_status_all-daterangePicker3');
        this.allMinAmount = Selector('#amount-start');
        this.allMaxAmount = Selector('#amount-end');
        this.allCompliance = Selector('#compliance_id');
        this.allStatus = Selector('#status_name');
        this.allResetButton = Selector('#reset-button-approvals_status_all');
        
        //Pending Tab
        this.pendingTab = Selector('#approvals_status_2');
        this.pendingTable = new Table(Selector('#table-approvals_status_2'));
        this.pendingResetButton = Selector('#reset-button-approvals_status_2');

        //Rejected Tab
        this.rejectedTab = Selector('#approvals_status_3');
        this.rejectedTable = new Table(Selector('#table-approvals_status_3'));
        this.rejectedResetButton = Selector('#reset-button-approvals_status_3');

        //Approved Tab
        this.approvedTab = Selector('#approvals_status_4');
        this.approvedTable = new Table(Selector('#table-approvals_status_4'));
        this.approvedResetButton = Selector('#reset-button-approvals_status_4');

        //Paid Tab
        this.paidTab = Selector('#approvals_status_6');
        this.paidTable = new Table(Selector('#table-approvals_status_6'));
        this.paidResetButton = Selector('#reset-button-approvals_status_6');
    }
}