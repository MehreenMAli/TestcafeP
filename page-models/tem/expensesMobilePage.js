import { Selector } from 'testcafe';
import ExpensesPage from './expensesPage';

export default class ExpensesMobilePage extends ExpensesPage{
	constructor(){
		super();
		
		this.tabsDropdown = Selector('#phone-dropdown');
		this.tabsDropdownOptions = Selector('#phone-dropdown-options').find('li');
		this.allocationComboBox = Selector('#phone-dropdown');
		this.labelPercentageAllocation = Selector("label[class='notEditable']");
	}
}