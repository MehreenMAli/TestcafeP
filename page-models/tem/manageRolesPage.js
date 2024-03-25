import { Selector, t } from 'testcafe';
import Table from '../table';
import { textInCell, textInCellChecked, Criteria, visible, clickElement, selectElement, deleteElement } from '../../utils/helperFunctions';

export default class ManageRolesPage{
    constructor(){
        this.rolesTable = new Table(Selector('#table-roles-table'));
        this.categoriesTab = Selector('#categories');
        this.rolesTab = Selector('#roles');
        this.groupTypeDropdown = visible(Selector('.dropdown-arrow'));
        this.addRoleButton = Selector('#add-new-role-button');
        this.dropdownOptions = Selector('.dropdown-options').child('p');

        //Categories tab.
        this.rolesDropdown = Selector('#roles-dropdown input');
        this.boxRolesDropdown = Selector('#boxed-roles-dropdown input');
        this.boxCategoryDropdown = Selector('#boxed-category-dropdown input');
        this.savePermissionsButton = Selector('#save-permissions-button');
        this.categoriesTable = new Table(Selector('#table-permissions-table'));
        this.applyButton = Selector('#apply-button');
        this.permissionsBox = Selector('.permissions-box');
        this.permissionsBoxElements = this.permissionsBox.find('li input');

    }

    async deleteRole(roleName){
        let criteria = new Criteria(roleName,textInCell,deleteElement);
        return await this.rolesTable.findElement(criteria);
    }

    async selectRole(roleName){
        let criteria = new Criteria(roleName,textInCell,clickElement);
        return await this.rolesTable.findElement(criteria);
    }

    async selectCategory(roleName){
        let criteria = new Criteria(roleName,textInCell,selectElement);
        return await this.categoriesTable.findElement(criteria);
    }

    async selectGroup(groupName){
        let criteria = new Criteria(groupName,textInCell,selectElement);
        return await this.table.findElement(criteria);
    }

    async findRole(roleName){
        let criteria = new Criteria(roleName,textInCell);
        return await this.rolesTable.findElement(criteria);
    }

    async isDefault(roleName){
        let criteria = new Criteria(roleName,textInCellChecked);
        return await this.rolesTable.findElement(criteria);
    }

    async comparePermissions(roles1, roles2){
        if(roles1.length == roles2.length){
            for(let i=0; i<roles1.length; i++){
                if( (roles1[i]['menu_id'] != roles2[i]['menu_id']) ||
               // (roles1[i]['has_access'] != roles2[i]['has_access']) ||
                (roles1[i]['title'] != roles2[i]['title'])
                ){
                    return await false;
                }
            }
        }
        return await true;
    }
}