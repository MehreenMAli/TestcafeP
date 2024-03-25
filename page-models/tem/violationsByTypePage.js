import { Selector } from 'testcafe';

export default class ViolationsByTypePage{
    constructor(){
        this.periodDropdown = Selector('#periods');
        this.startDatePicker = Selector('#start-date');
        this.endDatePicker = Selector('#end-date');
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