import { Selector } from 'testcafe';
import Table from '../table';

export default class PaymentsPage{
	constructor(){
        this.companiesDropdown = Selector('#companies');
        this.companiesDropdownOptions = this.companiesDropdown.find('p');
        this.checkCompany = Selector("(//input[@id='category_name'])");

        //Pending Tab
        this.pendingTab = Selector('#pending');
        this.releaseButton = Selector('#release-button');
        this.pendingTable = Selector('#table-pending-transactions');
        this.pendingTableHeaders = this.pendingTable.find('th');
        this.pendingNameInput = this.pendingTable.find('#client_name');
        this.pendingStartInput = this.pendingTable.find('#check_range-start');
        this.pendingEndInput = this.pendingTable.find('#check_range-end');
        this.pendingPaymentRangepicker = Selector('#pending-transactions-daterangePicker2');
        this.pendingAchRangepicker = Selector('#pending-transactions-daterangePicker3');
        this.pendingMinAmountInput = this.pendingTable.find('#total_amount-start');
        this.pendingMaxAmountInput = this.pendingTable.find('#total_amount-end');
        this.pendingBatchDropdown = this.pendingTable.find('div.dropdown-arrow');
        this.pendingBatchDropdownOptions = this.pendingBatchDropdown.find('p');
        this.pendingResetButton = Selector('#reset-button-pending-transactions');
        
        this.tablePendingRow = Selector('tbody').child('tr').find('td').nth(2);
        this.titleDetail = Selector('div.phone-subtitle-1.hidden-md-up.sm-collapse');
        this.tableDetail = Selector('table.table.cor360-table');
        this.returnDetail = Selector('i.fa.fa-angle-left');
           
        //Processed Tab
        this.processedTab = Selector('#processed');
        this.processedTable = Selector('#table-processed-transactions');
        this.processedTableHeaders = this.processedTable.find('th');
        this.processedTransDatepicker = Selector('#processed-transactions-daterangePicker0');
        this.processedTransInput = this.processedTable.find('#client_name');
        this.processedStartInput = this.processedTable.find('#check_range-start');
        this.processedEndInput = this.processedTable.find('#check_range-end');
        this.processedPaymentDatepicker = Selector('#processed-transactions-daterangePicker3');
        this.processedMinAmountInput = this.processedTable.find('#total_amount-start');
        this.processedMaxAmountInput = this.processedTable.find('#total_amount-end');
        this.processedBatchDropdown = this.processedTable.find('div.dropdown-arrow').nth(0);
        this.processedBatchDropdownOptions = this.processedBatchDropdown.find('p');
        this.processedPaymentTypeDropdown = this.processedTable.find('div.dropdown-arrow').nth(1);
        this.processedPaymentTypeDropdownOptions = this.processedPaymentTypeDropdown.find('p');
        this.processedPaymentStatusDropdown = this.processedTable.find('div.dropdown-arrow').nth(2);
        this.processedPaymentStatusDropdownOptions = this.processedPaymentStatusDropdown.find('p');
        this.processedClearedDatepicker = Selector('#processed-transactions-daterangePicker8');
        this.processedClearedMinAmountInput = this.processedTable.find('#cleared_amount-start');
        this.processedClearedMaxAmountInput = this.processedTable.find('#cleared_amount-end');
        this.processedResetButton = Selector('#reset-button-processed-transactions');
        this.checkCompanyProcessed = Selector('input.form-control.ng-untouched.ng-valid.ng-dirty');

        //Processed Tab
        this.processedDetailTab = Selector('#processed-detail');
        this.processedDetailTable = Selector('#table-processed-detail-transactions');
        this.processedDetailTableHeaders = this.processedDetailTable.find('th');
        this.processedDetailTransDatepicker = Selector('#processed-detail-transactions-daterangePicker0');
        this.processedDetailPayeeInput = this.processedDetailTable.find('#payee');
        this.processedDetailCustomerInput = this.processedDetailTable.find('#customer');
        this.processedDetailPaymentTypeDropdown = this.processedDetailTable.find('div.dropdown-arrow').nth(0);
        this.processedDetailPaymentTypeDropdownOptions = this.processedDetailPaymentTypeDropdown.find('p');
        this.processedDetailMinAmountInput = this.processedDetailTable.find('#amount-start');
        this.processedDetailMaxAmountInput = this.processedDetailTable.find('#amount-end');
        this.processedDetailStartInput = this.processedDetailTable.find('#payment_number-start');
        this.processedDetailEndInput = this.processedDetailTable.find('#payment_number-end');
        this.processedDetailPaymentDropdown = this.processedDetailTable.find('div.dropdown-arrow').nth(1);
        this.processedDetailPaymentDropdownOptions = this.processedDetailPaymentDropdown.find('p');
        this.processedDetailClearedDatepicker = Selector('#processed-detail-transactions-daterangePicker7');
        this.processedDetailClearedMinAmountInput = this.processedDetailTable.find('#cleared_amount-start');
        this.processedDetailClearedMaxAmountInput = this.processedDetailTable.find('#cleared_amount-end');
        this.processedDetailResetButton = Selector('#reset-button-processed-detail-transactions');
        this.checkCompanyProcessedDetail = Selector('input.form-control.ng-untouched.ng-valid.ng-dirty');

        this.processedDetailFilterFrom = Selector('#dateFrom');
        this.processedDetailFilterTo = Selector('#dateTo');
	}
}