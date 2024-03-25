import { Selector } from 'testcafe';
import ApprovalsPage from './approvalsPage';

export default class ApprovalsMobilePage extends ApprovalsPage {
    constructor(){
        super();
        this.tabsDropdown = Selector('#phone-dropdown');
        this.tabsDropdownOptions = Selector('#phone-dropdown-options').find('li');
        this.allTable = Selector('table.table.cor360-table.cor360-phone-table').nth(0);
        this.pendingTable = Selector('table.table.cor360-table.cor360-phone-table').nth(1);
        this.rejectedTable = Selector('table.table.cor360-table.cor360-phone-table').nth(2);
        this.approvedTable = Selector('table.table.cor360-table.cor360-phone-table').nth(3);
        this.paidTable = Selector('table.table.cor360-table.cor360-phone-table').nth(4);
    }
}