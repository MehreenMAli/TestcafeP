import { Selector } from 'testcafe';
import Table from '../table';

export default class RecurringInvoicePage {
    constructor () {
        
        this.title = Selector('#breadcrumb-title');
        this.addInvoice = Selector('#new');
        this.exportExcel = Selector('i.fa.fa-file-excel-o');
        
        //tabs
        this.allTab = Selector('#all');
        this.nonPOBased = Selector('#nonPo');
        this.poBased = Selector('#po');    
        
        //Tables
        this.tableAll = new Table(Selector('#table-all'));
        this.tableNonP =  new Table(Selector('#table-nonPo'));
        this.tablePo =  new Table(Selector('#table-po'));

        this.tableAllHeaders = this.tableAll.find('tr.list-group');
        this.tableNonPoHeaders = this.tableNonP.find('tr.list-group');
        this.tablePOHeaders = this.tablePo.find('tr.list-group');

    }
}