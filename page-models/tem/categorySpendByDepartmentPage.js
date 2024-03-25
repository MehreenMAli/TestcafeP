import { Selector } from 'testcafe';

export default class CategorySpendByDepartmentPage{
    constructor(){
        this.periodDropdown = Selector('#periods');
        this.startDatePicker = Selector('#start-date');
        this.endDatePicker = Selector('#end-date');
        this.updateButton = Selector('#update');
        this.divisionsDropdown = Selector('#filter');
        this.canvas = Selector('canvas');
        this.labelsPage = Selector('label.legend');
        this.stackedCheckbox = Selector('#unchecked');
        this.question = Selector('.fa-question-circle');
        this.labelCheckbox = Selector('.lbl');
        this.categoriesOptions = Selector('.dropdown-item');
    }
}