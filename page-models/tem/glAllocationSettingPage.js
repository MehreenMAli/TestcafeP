import { Selector } from 'testcafe';
import Dropdown from '../dropdown';

export default class GlAllocationSettingPage{
    constructor(){
        this.saveButton = Selector('#save');
        this.inputFilter = Selector('input');
        this.dropdownGL = new Dropdown(Selector('div.dropdown-arrow'));
        this.dropdownsGL = Selector('i.fa.fa-sort-down');
        this.dropdownGLPerExpense = this.dropdownsGL.nth(1);
        this.modalConfirm = Selector('modal-header.sev-info');
        this.labelsPage = Selector('span');
        this.dropdownOptionsGLPerExpense = Selector('dropdown-options');
    }

    async checkAllOptions(optionsDropdown){
        for(let i=0; i<optionsDropdown.count; i++){
            if((optionsDropdown[i].gl_allocation_method !== this.dropdownGL.rows.nth(i).innerText)){
                return false;
            }
        }
        return true;
    }

   
}