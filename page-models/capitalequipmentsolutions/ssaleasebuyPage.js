import { Selector } from "testcafe";
import Table from '../table';

export default class SSALeaseBuyPage {
    constructor() {
        this.label = Selector('span.table-title.legend');
        
        //Button
        this.addButton = Selector('button.btn.btn-primary.pull-right.finance-button');
        this.calculateButton = Selector('button.btn.btn-primary.pull-right');
        //Tables
        this.annualizedAfterTaxTable = new Table(Selector('#analysis-table').find('table'));
        this.cashPurchaseTable = new Table(Selector('#cash-table').find('table'));
        this.newLifecycleTable = new Table(Selector('#finance-table').find('table'));
        this.secondAssetTable = new Table(Selector('#equipment-table').find('table'));
        this.leaseTable = new Table(Selector('#lease-table').find('table'));
    }
}