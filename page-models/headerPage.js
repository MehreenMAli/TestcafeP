import { Selector } from 'testcafe';
import { visible } from '../utils/helperFunctions';

export default class HeaderPage {
    constructor () { 
		this.logoIcon = Selector('#navbar-brand');
		this.hambMenu = visible(Selector('#hamb-menu'));
		this.navBarToggler = visible(Selector('#hamb-menu'));
		this.userAvatar = Selector('#img-avatar');
		this.plusReport = Selector('#plus-report');
		this.plusExpense = Selector('#plus-expense');
		this.plusReceipt = Selector('#plus-receipt');
		this.collapserPlusButton = Selector('button.btn.collapser');
		this.collapserPlusExpense = Selector('button.btn.btn-block.btn-accent').nth(1);
		this.collapserPlusReport = Selector('button.btn.btn-block.btn-accent').nth(0);
		this.collapserPlusReceipt = Selector('button.btn.btn-block.btn-accent').nth(2);
	}
}