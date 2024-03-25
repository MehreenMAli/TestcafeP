import { Selector } from 'testcafe';
import ReportsPage from './reportsPage';

export default class ReportsMobilePage extends ReportsPage{
	constructor(){
		super();
		let table = Selector('table.cor360-table.cor360-phone-table');
		this.tabsDropdown = Selector('#phone-dropdown');
		this.tabsDropdownOptions = Selector('#phone-dropdown-options').find('li');
		//All table
		this.allTable = table.nth(0);
		this.allTableRows = this.allTable.find('tr');
		//Pending tab
		this.pendingTable = table.nth(1);
		//Approved tab
		this.approvedTable = table.nth(2);
		//Rejected tab
		this.rejectedTable = table.nth(3);
		//Paid tab
		this.paidTable = table.nth(4);
		//Draft tab
		this.draftTable = table.nth(5);
	}
}