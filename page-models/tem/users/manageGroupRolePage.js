import { Selector, t } from 'testcafe';
import Table from '../../table';
import Dropdown from '../../dropdown'
import { paste, Criteria, clickOption, deleteElement, visible, textInOption, clickElement, clickToggle } from '../../../utils/helperFunctions';
import ConfirmModal from '../../confirmModal';

let exactTextInRow = async function(row){
    let cells = await row.find('td');
    let textFound = '';
    let cellsCount = await cells.count;
    
    if (cellsCount>0) {
        for (let i = 0; i<cellsCount; i++) {
            textFound = await cells.nth(i).innerText;
            if (textFound === this.element)
                return true;
        }
    }
    return false;
};

let membershipInRow = async function(row){
    let cells = await row.find('td');
    let groupName = '';
    let role = '';
    let cellsCount = await cells.count;
    
    if (cellsCount>0) {
        groupName = await cells.nth(0).innerText;
        role = await cells.nth(1).innerText;
        if (groupName.trim() === this.element.groupName && role.trim() === this.element.roleName)
            return true;
    }
    return false;
};

let defaultMembershipInRow = async function(row){
    let cells = await row.find('td');
    let cellsCount = await cells.count;
    
    if (cellsCount>0) {
        let isDefault = await cells.nth(2).find('input[type="radio"]').checked;
        if (isDefault){
            let groupName = (await cells.nth(0).innerText).trim();
            let roleName = (await cells.nth(1).innerText).trim();
            return { groupName: groupName, roleName: roleName }
        }
    }
    return;
}

export const closeModalDeleteElement = async function(row){
    let deleteButton = row.find('i[class="fa fa-trash"]');
    let confirmModal = new ConfirmModal();
    await t
        .click(deleteButton)
        .click(confirmModal.closeButton);
};

export default class ManageUsersPage{
    constructor(){
        this.searchInput = Selector('.form-control');
        this.usersTable = new Table(Selector('table[class="table"]'));
        this.groupTypeDropdown = Selector('#group-type-dropdown input');
        this.groupDropdown = Selector('#group-list-dropdown');
        this.roleDropdown = Selector('#roles-dropdown input');
        this.addButton = Selector('button[id="add-button"]');
        this.dropdownOptions = visible(Selector('.dropdown-options'));
        this.membershipsTable = new Table(Selector('table[id="table-group-roles-table"]'));
    }

    async searchUser(user){
        await t
            .typeText(this.searchInput,user,paste);
        let criteria = new Criteria(user,exactTextInRow,clickElement);
        return await this.usersTable.findElement(criteria);
    };

    async isMembership(membership){
        let criteria = new Criteria(membership,membershipInRow);
        return await this.membershipsTable.findElement(criteria);
    };

    async deleteMembership(membership){
        let criteria = new Criteria(membership,membershipInRow,closeModalDeleteElement);
        return await this.membershipsTable.findElement(criteria);
    };

    async clickGroupOption(groupName){
        let criteria = new Criteria(groupName,textInOption,clickOption);
        let dropdown = new Dropdown(this.groupDropdown);
        return await dropdown.findOption(criteria);
    }

    async getDefaultMembership(){
        let criteria = new Criteria({},defaultMembershipInRow);
        return await this.membershipsTable.getElement(criteria);
    }

    async setDefaultMembership(membership){
        let criteria = new Criteria(membership,membershipInRow,clickToggle);
        return await this.membershipsTable.findElement(criteria);
    }
    
}