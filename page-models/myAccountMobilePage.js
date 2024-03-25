import { Selector } from 'testcafe';
import MyAccountPage from './myAccountPage';

export default class MyAccountMobilePage extends MyAccountPage {
    constructor () {
        super();
        this.dropdownPhoneButton = Selector('#phone-dropdown');
        this.dropdownPhoneOptions = Selector('#phone-dropdown-options li');
    }
}
