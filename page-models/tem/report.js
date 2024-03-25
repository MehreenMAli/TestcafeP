import { Selector } from 'testcafe';
import Datepicker from '../datePicker';
import { error, textInCell, Criteria, deleteElement } from '../../utils/helperFunctions';
import Table from '../table';

export default class Report{
    constructor(){
        this.fromCalendar = new Datepicker(Selector('#start-date'));
        this.toCalendar = new Datepicker(Selector('#end-date'));
        this.saveButton = Selector('#save');
        this.cancelButton = Selector('#cancel');
        this.reportNameInput = Selector('input[formcontrolname="report_name"]');
        this.reportNameInput.error = error(this.reportNameInput);
        this.businessPurposeInput = Selector('#business-purpose-textarea');
        this.businessPurposeInput.error = error(this.businessPurposeInput);
        this.badge = Selector('div[class=status-badge]');
        this.legends = Selector('label[class=legend]');
        this.textArea = Selector('textarea[formcontrolname=newNote]');
        this.reportName = Selector('#reportName');
        this.businessPurpose = Selector('#businessPurpose');
        this.detailsfromDate = this.legends.nth(2).sibling('label');
        this.detailstoDate = this.legends.nth(3).sibling('label');
        this.fromDate = Selector('#start-date');
        this.fromDate.error = error(this.fromDate);
        this.toDate = Selector('#end-date');
        this.toDate.error = error(this.toDate);
        this.resetButton = Selector('#resetNote'),
        this.postButton = Selector('#postNote');
        this.noteItem = Selector('div[class="note-item"]');
        this.noteComment = this.noteItem.find('div[class="note note-user"]');
        this.noteImage = this.noteItem.find('img');
        this.total = Selector('p.total_list_sum');
        this.addExpenseButton = Selector('#add-expense-button');
        this.selectFromLibraryButton = Selector('#fromLibrary');
        this.selectFromLibraryButtonPhone = Selector('#fromLibraryPhones');
        this.submitReportButton = Selector('#submit-report');
        this.recallReportButton = Selector('#recall-report');
        this.closeButton = Selector('#close-report');
        this.table = new Table(Selector('#table-reports_all'));
        this.reportNameSearch = Selector('#report_name');
        this.resetButtonSearch = Selector('#reset-button-reports_all');
        this.statusSearch = Selector('#status_name');
        this.projectCodeDropDown = Selector('#project-code-dropdown') 
        this.commentDetail = Selector('i.fa.fa.fa-angle-right');
        this.commentBack = Selector('i.fa.fa-angle-left');
        this.expensesTable = new Table(Selector('table.table.cor360-table').nth(0));
        this.saveAsDraftButton = Selector('#draft-report');
        this.commentGloveIcon = Selector('div[aria-label="Basic example - Left Icons"]');
    }

    async existsReport(reportName){
        let criteria = new Criteria(reportName, textInCell);
        return await this.table.findElement(criteria);
    }

    async deleteReport(reportName){
        let criteria = new Criteria(reportName, textInCell, deleteElement);
        return await this.table.findElement(criteria);
	}
}