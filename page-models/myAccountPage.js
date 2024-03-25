import { Selector } from 'testcafe';
import { visible } from './../utils/helperFunctions';
import Table from '../page-models/table';

export default class MyAccountPage {
    constructor () {
        this.saveButton = Selector('#save-account');
        this.cancelButton = Selector('#close-account');
        this.label = Selector('label.legend');
        this.dropdownOptions = Selector('.dropdown-option');

        //Personal Info Tab
        this.personalInfoTab = Selector('#personal-info');
        this.usernameInput = Selector('#username');
        this.firstnameInput = Selector('#fisrt-name');
        this.middlenameInput = Selector('#middle-name');
        this.lastnameInput = Selector('#last-name');
        this.titleInput = Selector('input[formcontrolname="title"]');
        this.phoneNumberInput = Selector('input[formcontrolname="phone"]');
        this.emailInput = Selector('input[formcontrolname="email"]');
        this.uploadFileInput = Selector('#file-upload'); //Hidden
        this.resetPasswordButton = Selector('#reset-pass');

        //Profile Language Tab
        this.profileLanguageTab = Selector('#profile-language');
        this.languageDropdown = visible(Selector('div.dropdown-arrow'));
        this.languageDropdownChinese = Selector('p[value="zh-CN"]');
        this.languageDropdownEnglish = Selector('p[value="en-US"]');
        this.languageDropdownSpanish = Selector('p[value="es-AR"]');

        //Profile Notifications Tab
        this.profileNotificationsTab = Selector('#profile-notification');
        this.notificationsTable = new Table(visible(Selector('.table')));

        //Profile Activity Tab
        this.profileActivityTab = Selector('#profile-activity');
        this.profileActivityTable = new Table(Selector('#table-activities'));
        
    }
}
