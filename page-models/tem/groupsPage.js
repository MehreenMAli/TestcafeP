import { Selector } from 'testcafe';
import { Criteria, deleteElement, visible, textInOption, clickOption, exactTextInRow, clickElement, editElement} from '../../utils/helperFunctions';
import Table from '../table';
import Dropdown from '../dropdown';

export default class GroupsPage{
    constructor(){
        
        this.labelLegend = visible(Selector('label.legend'));
        this.tabs = visible(Selector('li.tab'));
        this.assignPolicyToGroupTab = visible(Selector('#assignPolicyToGroup'));
        this.assignUserToGroupTab = Selector('#assignUserToGroup');
        this.assignApprovalLimitTab = Selector('#approvalLimit');
        this.button = visible(Selector('button.btn.btn-primary'));
        this.dropdownOptions = Selector('div.dropdown-options p');
        this.switchActionLabel = Selector('div.action-switch label');

        this.groupID = Selector('label.group-id');
        this.switcherRight = new Table(Selector('#switcher-right'));
        this.switcherLeft = new Table(Selector('#switcher-left'));
        this.leftArrow = Selector('.fa-arrow-left');
        this.rightArrow = Selector('.fa-arrow-right');

        this.firstPage = Selector('.ngx-pagination');

        //Add/Edit Groups
        this.groupTypeDropdown = Selector('#group-type-dropdown input');
        this.groupsTable = new Table(Selector('#table-group-table'));

        //Assign Policy to Group
        this.assignPolicyGroupTypeDropdown = Selector('#assign-policy-group-type-dropdown');
        this.assignPolicyGroupsDropdown = Selector('#assign-policy-groups-dropdown');
        this.assignPolicySearchInput = Selector('#assign-policy-typeahead-input');

        //Assign User to Group
        this.assignUserGroupTypeDropdown = Selector('#assign-user-group-type-dropdown');
        this.assignUserGroupsDropdown = Selector('#assign-user-groups-dropdown');
        this.assignUserSearchInput = Selector('#assign-user-typeahead-input');
        
        //Assign Approval Limit
        this.approvalLimitTable = new Table(Selector('#table-approval-table'));
        this.assignGroupTypeDropdown = Selector('#assign-group-type-dropdown');
    }

    async groupInRow(row){
        let cells = await row.find('td');
        let cellsCount = await cells.count;

        if(cellsCount>0){
            let groupName = (await cells.nth(1).innerText).trim();
            let parentName = (await cells.nth(4).innerText).trim();
            if (groupName === this.element.groupName && parentName === this.element.parentName)
                return true;
        }

        return false;
    };

    async deleteGroup(group){
        let criteria = new Criteria(group,this.groupInRow,deleteElement);
        return await this.groupsTable.findElement(criteria);
    }

    async editGroup(group){
        let criteria = new Criteria(group,this.groupInRow,editElement);
        return await this.groupsTable.findElement(criteria);
    }

    async checkGroup(groupName,parentName,allGroups){
        for(let i=0; i<allGroups.total; i++){
            if((allGroups.items[i].group_name == groupName) && (allGroups.items[i].parent_group_name == parentName)){
                return true;
            }
        }
        return false;
    }
    
    async existsGroup(group){
        let criteria = new Criteria(group,this.groupInRow);
        return await this.groupsTable.findElement(criteria);
    }

    async clickGroupOption(groupName,dropdownSelector){
        let criteria = new Criteria(groupName,textInOption,clickOption);
        let dropdown = new Dropdown(dropdownSelector);
        return await dropdown.findOption(criteria);
    }

    async clickInSearchList(element){
        let criteria = new Criteria(element,exactTextInRow,clickElement);
        return await this.switcherLeft.findElement(criteria);
    };

    async searchAddedElement(element){
        let criteria = new Criteria(element,exactTextInRow);
        return await this.switcherRight.findElement(criteria);
    };

    async clickAddedElement(element){
        let criteria = new Criteria(element,exactTextInRow,clickElement);
        return await this.switcherRight.findElement(criteria);
    };
}