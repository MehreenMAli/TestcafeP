import { Selector } from 'testcafe';
import Table from '../table';
import {textInCell, Criteria, deleteElement, editElement } from '../../utils/helperFunctions';

export default class UsersPage{
    constructor(){
        this.table = new Table(Selector('#table-users'));
        this.tableHeaders = Selector('tr.list-group');
        this.roleMembershipGroup = Selector('div.form-group');
        this.roleMembershipDropdown = Selector('#companies-dropdown');
        this.addUserButton = Selector('#add-user-button');
        this.resetFilter = Selector('#reset-button-users');
        this.editUserIcon = Selector('i.fa.fa-pencil');

        //Filter Table
        this.emailFilter = Selector('#email');
        this.firstNameFilter = Selector('#first_name');
        this.lastNameFilter = Selector('#last_name');
        this.dateFilter = Selector('#users-daterangePicker2');

        //Tabs
        this.personalInfoTab = Selector('#personal-info');
        this.membershipTab = Selector('#membership');
        this.activityTab = Selector('#activity');

        //Add Users Page
        this.usernameInput = Selector('input[formcontrolname="user_name"]');
        this.firstnameInput = Selector('input[formcontrolname="first_name"]');
        this.middlenameInput = Selector('input[formcontrolname="middle_name"]');
        this.lastnameInput = Selector('input[formcontrolname="last_name"]');
        this.emailInput = Selector('input[formcontrolname="email"]');
        this.phoneInput = Selector('input[formcontrolname="phone"]');
        this.passwordExpire = Selector('input[name="dp1"]');
        this.companyDropdown = Selector('#companies-dropdown');
        this.companyOptions = Selector('p.dropdown-option');
        this.statusDropdown = Selector('#status-dropdown');
        this.statusDropdownOptions = this.statusDropdown.find('p');
        this.labelsPage = Selector('label.legend');
        this.day = Selector('div.btn-secondary');

        this.saveButton = Selector('#submit-button'); 
        this.cancelButton = Selector('#cancel-button');
        this.okButton = Selector('#ok-button', {visibility: true});

        this.closeButtonE = Selector('modal.info-modal');
        
        //Modal Confirm
        this.modalConfirm = Selector('div.modal-content');
        this.acceptButton = Selector('modal.confirm-modal.modal.fade.in').find('button').nth(1);
        this.cancelModalButton = Selector('modal.confirm-modal.modal.fade.in').find('button').nth(2);
        this.modalFooter = Selector('modal-footer');

        this.editClientMobile = Selector('button.btn.btn-primary.btn-block.custompaddingpopover');
        this.deleteClientMobile = Selector('button.btn.btn-primary.btn-block.custompaddingpopover').nth(1);

        // Membership Tab
        this.applicationDropdown = Selector('i.fa.fa-sort-down');
        this.role = Selector('div.options-switcher');
        this.addArrow = Selector('i.fa.fa-arrow-right.fa-2x');
        this.removeArrow = Selector('i.fa.fa-arrow-left.fa-2x');

        // Activity Tab
        this.activityTable = new Table(Selector('#table-activity-list'));

        //MOBILE LOCATORS
        this.tabSelectorCombo = Selector('#phone-dropdown');
        this.tabSelectorComboOptions = Selector('#phone-dropdown-options');
        
    }

    async deleteUser(Username){
        let criteria = new Criteria(Username, textInCell, deleteElement);
        return await this.table.findElement(criteria);
    }

    async existUser(Username){
        let criteria = new Criteria(Username, textInCell);
        return await this.table.findElement(criteria);
    }

    async editUser(Username){
        let criteria = new Criteria(Username, textInCell, editElement);
        return await this.table.findElement(criteria);
    }

    async getIdUser(userName,allUsers){
        let idUser = 0;
        for(let i=0; i < allUsers.length; i++){
            if(allUsers[i].user_name === userName){
                return allUsers[i].user_id;
            }
        }
        return idUser;
    }

    async userNotExist(allUsers, name) {
        let user = allUsers.items.find(element => element.first_name === name)
        if(user == null){
            return true;
        } else {
            return false;
        }
    }

    async getClientSessionInfo(clients, environment) {
        let clientData='';
        if(clients != null) {
            if(environment == 'uat') {
                clientData = clients.find(element=> element.client_name === 'PRO');
            } else if (environment == 'prod') {
                clientData = clients.find(element => element.client_name === 'Corcentric');
            } else {
                clientData = clients.find(element => element.client_name === 'DEV');
            }
        }
        return clientData;
    }
}
