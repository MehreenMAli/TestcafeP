import { Selector, t } from 'testcafe';
import Table from '../../table';
import { paste, Criteria, deleteElement, editElement } from '../../../utils/helperFunctions';

let nameInRow = async function(row){
    let cells = await row.find('td');
    let firstNameFound = '';
    let lastNameFound = '';
    if (await cells.count>2){
        firstNameFound = await cells.nth(0).innerText;
        lastNameFound = await cells.nth(1).innerText;
        return (firstNameFound.includes(this.element.firstName)&&lastNameFound.includes(this.element.lastName));
    }
    return false;
};

export default class ManageUsersPage{
    constructor(){
        this.addUserButton = Selector('#add-user');
        this.table = new Table(Selector('#table-tem-manager-user'));
        this.firstNameInput = Selector('#first_name');
        this.lastNameInput = Selector('#last_name');
        this.emailInput = Selector('#email');
        this.statusInput = Selector('#status_name');
        this.resetButton = Selector('#reset-button-tem-manager-user');
        this.editUserButton = Selector('i.fa.fa-pencil');

        this.editUser = Selector('i.fa.fa-pencil');
        this.saveButton = Selector('#save-user');

        //Tabs into User
        this.personalTab = Selector('i.fa.fa-times');
        this.glTab = Selector('#tem-gl');
        this.userRoleTab = Selector('#tem-roles');
        this.notificationTab = Selector('#tem-notification');
        this.approvalLimitTab = Selector('#tem-limits');
        this.activityTab = Selector('#tem-activity');

        // GL Tags Tab
        this.segmentInput = Selector('#segment-name-input');
        this.segmentValueInput = Selector('#segment-value-input');
        this.addTagButton = Selector('#tag-button');
        this.segmentTable = new Table(Selector('#table-user_tags_datatable'));

        // User Role Tab
        this.roleLeft = Selector('#switcher-left');
        this.faRight = Selector('i.fa.fa-arrow-right.fa-2x');
        this.roleRight = Selector('#switcher-right');
        this.faLeft = Selector('i.fa.fa-arrow-left.fa-2x');
        this.rolesOnLeft = this.roleLeft.find('tr')

        // Notifications Tab
        this.notificationTable = Selector('table.table.table-bordered.table-striped');
        this.deliveryType = Selector('div.dropdown-arrow');

        // Approval Limit Tab
        this.approvalLimitInput = Selector('#approval-limit');
        this.approvalLimitUpdateButton = Selector('#update-input');

        // Activity Tab
        this.activityTable = new Table(Selector('#table-activities'));

    }

    async deleteUser(firstName,lastName){
        let user = {
            firstName: firstName,
            lastName: lastName
        }
        let criteria = new Criteria(user,nameInRow,deleteElement);
        await t.expect(await this.searchUser(firstName,lastName)).ok();
        return await this.table.findElement(criteria);
    }

    async editUser(firstName,lastName){
        let user = {
            firstName: firstName,
            lastName: lastName
        }
        let criteria = new Criteria(user,nameInRow,editElement);
        await t.expect(await this.searchUser(firstName,lastName)).ok();
        return await this.table.findElement(criteria);
    }

    async openUser(firstName,lastName,emailUser){
        let user = {
            firstName: firstName,
            lastName: lastName
        }
        let criteria = new Criteria(user,nameInRow,editElement);
        await this.searchbyUserEmail(emailUser);
        return await this.table.findElement(criteria);
    }

    async searchbyUserEmail(emailUser){
        await t
            .typeText(this.emailInput,emailUser,paste)
            .pressKey('enter')
            .wait(2000)
            .click(Selector('body'));
        return true;
    }

    async searchUser(firstName,lastName){
        await t
            .typeText(this.firstNameInput,firstName,paste)
            .typeText(this.lastNameInput,lastName,paste)
            .pressKey('enter')
            .wait(2000)
            .click(Selector('body'));
        return true;
    }

    async existsUser(total){
        if(total == 1){
            return true;
        }else{
            return false;
        }
    }

    async addRoles(roleName){
        let roles = await this.rolesOnLeft;
        for(let i=0; i < await roles.count; i++){
            let rol = await roles.nth(i);
            if(await rol.find('td').innerText == roleName){
                await t
                    .click(rol)
                    .click(this.faRight);
                return
            }
        }
    }

}