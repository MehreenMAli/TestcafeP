import { Selector } from 'testcafe';
import { textInCell, Criteria, deleteElement, editElement } from '../../utils/helperFunctions';
import Table from '../table';

export default class SetupPage{
    constructor(){
       this.table =  new Table(Selector('#table-offering'));
       this.tableHeaders = Selector('tr.list-group');
       this.addOffering = Selector('#add-offering-button');

        //Tabs
        this.offeringTab = Selector('#offering-tab');
        this.communityTab = Selector('#community-tab');
        this.bussinesEntityTab = Selector('#bussines-entity-tab');
        this.activityTab = Selector('#activity-tab');

        //Tabs Mobile
        this.buttonTab = Selector('#phone-dropdown');
        this.buttonTabOptions = Selector('#phone-dropdown-options');
        
        //Tab Bussines Entity
        this.tableBE = Selector('#table-business_entities');
        this.tableHeadersBE = this.tableBE.find('tr');

        //Tab Activity
        this.tableActivity = Selector('#table-activity-list');
        this.tableHeadersAct = this.tableActivity.find('tr');

        //Create Offering
        this.shortNameInput = Selector('input[formcontrolname="offering_short_name"]');
        this.longNameInput = Selector('input[formcontrolname="offering_long_name"]');
        this.saveButton = Selector('#save-button');
        this.cancelButton = Selector('#cancel-button');
        this.modaConfirmation = Selector('modal.modal.fade.in');
        
    }


    async deleteOffering(shortName){
        let criteria = new Criteria(shortName, textInCell, deleteElement);
        return await this.table.findElement(criteria);
    }
    
    async existsOffering(shortName){
        let criteria = new Criteria(shortName, textInCell);
        return await this.table.findElement(criteria);
    }
    
    async editOffering(shortName){
        let criteria = new Criteria(shortName, textInCell, editElement);
        return await this.table.findElement(criteria);
    }

    async get_idOffering(shortName, allOffering){
        let idOffering = 0;
        for(let i=0; i < allOffering.length; i++){
            if(allOffering[i].offering_short_name === shortName){
                return allOffering[i].offering_id;
            }
        }
        return idOffering;
    }
    
}