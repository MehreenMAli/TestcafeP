import { Selector } from 'testcafe';
import Table from '../table';

export default class ExpensesLibraryModal{
    constructor(){
        //this.table = new Table(Selector('#table-expenses_gallery'));
        //this.checkboxes = Selector('input[type="checkbox"]');
        this.expenseLibraryTable = new Table(Selector('#table-expenses_gallery'));
        this.addExpenseToReportButton = Selector('#addToReport');
        this.cancelExpenseToReportButton = Selector('button.close');
        this.modalLibrary = Selector('modal.hidden-sm-down');
        this.addExpensePlus = this.modalLibrary.find('i.fa-plus');
    }
}