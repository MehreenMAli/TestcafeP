import { Selector } from 'testcafe';

export default class ManagerCycleTimesPage{
    constructor(){
        this.periodDropdown = Selector('#periods');
        this.startDatePicker = Selector('#cycle-start-date');
        this.endDatePicker = Selector('#cycle-end-date');
        this.updateButton = Selector('.btn-primary');
        this.departamentDropdown = Selector('#filter');
        this.labelsPage = Selector('label.legend');
        this.departamentOptions = Selector('.dropdown-cat-div');
        this.canvas = Selector('canvas');
        this.stackedCheckbox = Selector('#unchecked');
        this.question = Selector('.fa-question-circle');
        this.labelCheckbox = Selector('.lbl');
    }
}