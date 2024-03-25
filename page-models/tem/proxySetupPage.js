import { Selector } from 'testcafe';
import DatePicker from '../datePicker';

export default class ProxySetupPage{
    constructor(){
        this.cancelButton = Selector('#cancel');
        this.saveButton = Selector('#save');
        this.addButton = Selector('i.fa-arrow-right');
        this.removeButton = Selector('i.fa-arrow-left');
        this.nameInput = Selector('#name');
        this.switcherLeft = Selector('#switcher-left');
        this.switcherLeftItems = this.switcherLeft.find('span');
        this.switcherRight = Selector('#switcher-right');
        this.switcherRightItems = this.switcherRight.find('span');
        this.effectiveDatepicker = new DatePicker(Selector('#effective-date'));
        this.endDatepicker = new DatePicker(Selector('#end-date'));
        this.searchBlock = Selector('div.search-block');
        this.searchBlockItems = this.searchBlock.find('div');
    }
}