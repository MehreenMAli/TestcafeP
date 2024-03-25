import { Selector } from 'testcafe';
import Table from '../../table';

export default class GLMappingPage{
    constructor(){
        this.label = Selector('label.legend');
        this.categoryDropdown = Selector('#categories');
        this.datePicker = Selector('#effective-date');
        this.pieChart = Selector('#pie-chart');
        this.actionsDropdown = Selector('#temDistanceRateActions');
        this.addNewButton = Selector('#add');
        this.uploadExcelButton = Selector('button.btn.btn-primary').nth(1);
        this.fieldLabel = Selector('div label');
        this.importButton = Selector('#import');

        //Tab All
        this.tabAll = Selector('#all');
        this.tableAll = new Table(Selector('#table-all'));
        this.categoryNameFilter = Selector('#category_name');
        this.dateFilter = Selector('#all-daterangePicker2');
        this.resetButtonFilter = Selector('#reset-button-all');

        //Tab Active
        this.tabActive = Selector('#active');
        this.tableActive = new Table(Selector('#table-active'));
        this.categoryNameActiveFilter = Selector('#category_name').nth(1);
        this.dateFilterActive = Selector('#active-daterangePicker2');
        this.resetButtonActiveFilter = Selector('#reset-button-active');

        //Tab Inactive
        this.tabInactive = Selector('#inactive');
        this.tableInactive = new Table(Selector('#table-inactive'));
        this.categoryNameInactiveFilter = Selector('#category_name').nth(2);
        this.dateFilterInactive = Selector('#inactive-daterangePicker2');
        this.resetButtonInactiveFilter = Selector('#reset-button-inactive');
    }   

    async checkField(label,inputType){
        let fieldLabel = await this.fieldLabel.withText(label);
        let fieldInput = await fieldLabel.sibling(0).find('input'); //Dropdown
      
        console.log(await fieldInput.exists);
        if(inputType && inputType === 2){
            //Text input.
            fieldInput = await fieldLabel.sibling('cor-dropdown input');
        }

        return (fieldLabel.exists && fieldInput.exists);
    };
}
