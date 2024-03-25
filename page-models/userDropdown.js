import { Selector } from 'testcafe';
import { visible } from '../utils/helperFunctions';

export default class UserDropdown{
    constructor(){
        //this.root = visible(Selector('ul.nav.navbar-nav.pull-right.navbar-profile'));
        this.root = visible(Selector('ul.nav.navbar-nav.navbar-profile'));
        this.toggle = this.root.find('a.nav-link');
        this.image = this.root.find('img');
        this.userName = this.root.find('span');
        this.items = this.root.find('a.dropdown-item');
        
        this.changePassword = visible(Selector('a[id="401"]'));
        this.myAccount = visible(Selector('a[id="406"]'));
        this.impersonate = visible(Selector('#proxy-item'));
        this.logout = visible(Selector('#logout'));
        //TEM ONLY
        this.oooDelegation = visible(Selector('a[id="402"]'));
        this.help = visible(Selector('a[id="409"]'));
        this.roles = visible(Selector('a.dropdown-item').withText('Roles')); //TODO add id.
        this.dropdownItem = visible(Selector('a.dropdown-item'));
    }
}    