import { Selector } from 'testcafe';

export default class SideBarPage {
	constructor () {
		this.sidebar = Selector('nav[id="sidebarchild"]');
		this.items = this.sidebar.find('a span');
		this.copyright = Selector('#copyright');
	 }
}