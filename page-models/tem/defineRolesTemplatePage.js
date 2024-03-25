import { Selector } from 'testcafe';
import Table from '../table';
import { textInCell, deleteElement,Criteria } from '../../utils/helperFunctions';

export default class DefineRolesTemplatePage{
    constructor(){
        this.table = new Table(Selector('#table-define-roles-template'));
        this.offeringDropdown = Selector('#offering')
        this.menuesInput = Selector('#menues');
        this.addMenuButton = Selector('#add-menue');
        this.addNewButton = Selector('#add-new');
    }

    async deleteRole(roleName){
        let criteria = new Criteria(roleName,textInCell,deleteElement);
        return await this.table.findElement(criteria);
    }
}