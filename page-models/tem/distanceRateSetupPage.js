import { Selector } from 'testcafe';
import Table from '../table';
import {textInCell, Criteria, deleteElement, editElement } from '../../utils/helperFunctions';

export default class DistanceRateSetupPage{
    constructor(){
        this.unitDropdown = Selector('div.dropdown-arrow').nth(0);
        this.unitDropdownOptions = this.unitDropdown.find('p');
        this.rateInput = Selector('input[formcontrolname="rate"]');
        this.currencyDropdown = Selector('div.dropdown-arrow').nth(1);
        this.currencyDropdownOptions = this.currencyDropdown.find('p');
        this.perInput = Selector('input[formcontrolname="per"]');
        this.datePicker = Selector('input[name="dp1"]');
        this.addNewButton = Selector('#add-new');
        this.actionsDropdown = Selector('#temDistanceRateActions');
        this.actionsDropdownOptions = this.actionsDropdown.find('p');
        this.table = new Table(Selector('#table-distance-rate-setup'));

        //Modal Edit
        this.rateInputModal = Selector('#modal-rate-input');
        this.perInputModal = Selector('#modal-per-input'); 
        this.saveButtonModal = Selector('#modal-save-button');
        this.closeButtonModal = Selector('#modal-close-button');
    }

    async deleteDistanceRate(distanceData){
        let criteria = new Criteria(distanceData, textInCell, deleteElement);
        return await this.table.findElement(criteria);
    }

    async editDistanceRate(distanceData){
        let criteria = new Criteria(distanceData, textInCell, editElement);
        return await this.table.findElement(criteria);
    }

    async existsDistanceRate(distanceData){
        let criteria = new Criteria(distanceData, textInCell);
        return await this.table.findElement(criteria);
    }
}