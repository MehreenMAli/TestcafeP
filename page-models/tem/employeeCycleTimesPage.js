import { Selector } from 'testcafe';

export default class employeeCycleTimesPage{
    constructor(){
        this.periodDropdown = Selector('#periods');
        this.startDatePicker = Selector('#start-date-picker');
        this.endDatePicker = Selector('#end-date-picker');
        this.updateButton = Selector('.btn-primary');
        this.departamentDropdown = Selector('#filter');
        this.labelsPage = Selector('label.legend');
        this.departamentOptions = Selector('.dropdown-item');
        this.canvas = Selector('canvas');
        this.stackedCheckbox = Selector('#unchecked');
        this.question = Selector('.fa-question-circle');
        this.labelCheckbox = Selector('.lbl');
    }
}