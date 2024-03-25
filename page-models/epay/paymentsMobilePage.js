import { Selector } from 'testcafe';
import PaymentsPage from './paymentsPage';

export default class PaymentsMobilePage extends PaymentsPage{
	constructor(){
        super();
        this.tabsDropdown = Selector('#phone-dropdown');
        this.tabsDropdownItems = this.tabsDropdown.sibling('ul').child('li');
        this.searchCheckInput = Selector('#epay-pending-trans').find('input');
	}
}