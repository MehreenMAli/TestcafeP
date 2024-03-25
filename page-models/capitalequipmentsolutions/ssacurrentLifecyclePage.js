import { Selector } from "testcafe";
import Table from '../table';

export default class SSACurrentLifecyclePage {
    constructor() {
        this.label = Selector('label.legend');

        this.saveButton = Selector('#submit-button');
        this.submitButton = Selector('button.btn.btn-primary.top-32');
        this.addButton = Selector('button.btn.btn-primary.pull-right');
        this.monthsInput = Selector('#currentLifecycleMonthsInput');
        this.table = Selector('table.table.cor360-table');

        this.tableYears = new Table(this.table.nth(0));
        this.tableMonths = new Table(this.table.nth(1));

        this.dropdownOptions = Selector('div.dropdown-options');

        this.labelError = Selector('div.errors');

        this.modal = Selector('modal.confirm-modal.modal.fade.in');
    }
}