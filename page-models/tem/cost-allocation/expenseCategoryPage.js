import { Selector } from 'testcafe';
import Table from '../../table';
import {textInCell, Criteria, editElement, selectElement } from '../../../utils/helperFunctions';

export default class ExpenseCategoryPage{
    constructor () {
        this.categoryNameInput = Selector('input[formcontrolname="category_name"]', {visibility: true});
        this.slider = Selector('#slide-vehicle');
        this.categoryDropdown = Selector('#category-icon');
        this.addNewButton = Selector('#add-new');
        this.actionsDropdown = Selector('#actions');
        this.actionsDropdownOptions = this.actionsDropdown.find('p');
        this.table = new Table(Selector('#table-expense-category'));
        this.datePicker = Selector('#effective-date');
        this.closeButton = Selector('#close-account');
        this.dateDay = Selector('td.day');
        this.optionCarIcon = Selector('a.dropdown-item.fa.fa-car');
        this.labels = Selector('label.legend');

        //Edit
        this.categoryNameModalInput = Selector('#edit-category-name-input');
        this.vehicleModal = Selector('#edit-personal-vehicle-input');
        this.saveModalButton = Selector('#edit-save-button');
        this.cancelModalButton = Selector('#edit-close-button');

        //Error Warning
        this.modalWarning = Selector('modal.info-modal.modal.fade.in');
    }

    async selectExpenseCategory(categoryName){
        let criteria = new Criteria(categoryName, textInCell, selectElement);
        return await this.table.findElement(criteria);
    }

    async editExpenseCategory(categoryName){
        let criteria = new Criteria(categoryName, textInCell, editElement);
        return await this.table.findElement(criteria);
    }

    async existsExpenseCategory(categoryName){
        let criteria = new Criteria(categoryName, textInCell);
        return await this.table.findElement(criteria);
    }
    
    async getExpenseCategory(expenseCategory,allExpenseCategory){
        for(let i=0; i<allExpenseCategory.length;i++){
            if(allExpenseCategory[i].category_name === expenseCategory){
                return allExpenseCategory[i];
            }
        }
        return null;
    }
}