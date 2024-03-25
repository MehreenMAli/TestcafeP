import { Selector } from "testcafe";
import Table from '../table';

export default class SSANewLifecyclePage {
    constructor() {
        this.label = Selector('label.legend');

        this.newOperatingTermInput = Selector('#newLifecycleMonthsInput');
        this.improvement = Selector('div.icon-input-container');
                                                     
        this.saveButton = Selector('#submit-button');
        this.submitButton = Selector('button.btn.btn-primary.top-32');
        this.addButton = Selector('button.btn.btn-primary.pull-right');


        this.elementTable = 
        this.monthsTable = new Table(Selector('#mainTable').find('table'));
        this.monthspaymentsTable = new Table(Selector('#financeTable').find('table'));

        //Controls
        this.labelError = Selector('div.errors');
    }
}