import { Selector } from 'testcafe';
import { visible } from '../../utils/helperFunctions';

export default class ViewPage {
    constructor () {
        
        this.title = Selector('#breadcrumb-title');
        this.header = Selector(".work-invoice-header");
        this.tabs = Selector(".work-invoice-tabs");
        this.pendIcon = Selector('.fa-clock-o');
        this.routeIcon = Selector('.fa-forward');
        this.ccIcon = Selector('.fa-files-o');
        this.backIcon = Selector('.fa-times');
        this.labelLegend = Selector('label.legend');
        this.dropdownOptions = Selector('p.dropdown-option');
        this.mobileDropdownOptions = Selector('ul.dropdown-menu span');

        //Actions: general elements
        this.actionTitle = visible(Selector('.work-invoice-rd-header'));
        this.button = Selector('.btn.btn-primary');
        this.label = visible(Selector('label'));
        this.text = Selector('div');
        this.commentArea = Selector('#decline-comments-textarea');

        //Documents tab.
        this.documentImage = Selector('.pdf-viewer');

        //Line Items tab.
        this.lineItem = Selector('.line-items');
        this.lineItemHeader = Selector('.work-lineitems-header');

        //Allocations tab
        this.allocationItemHeader = Selector('a.work-allocations-header');
        this.allocationDescription = Selector('div.collapse');

        //Pend
        this.itemDaysInput = Selector('input[formcontrolname="pend_item_for_days"]');
        this.pendReasonDropdown = Selector('#pend-items-dropdown');
        this.pendComment = Selector('#pend-comments-textarea');
        this.pendOkButton = Selector('#pend-ok-button');

        //Route
        this.routeToUserDropdown = Selector('#route-types-dropdown input');
        this.selectUserDropdown = Selector('#route-item-dropdown input');
        this.routeComment = Selector('#route-comments-textarea');
        this.routeOkButton = Selector('#route-ok-button');

        //CC
        this.copyToUserDropdown = Selector('#cc-route-types-dropdown input');
        this.filterInput = Selector('input[formcontrolname="filter_item"]');
        this.leftUserList = Selector('#switcher-left');
        this.rightUserList = Selector('#switcher-right');
        this.leftArrow = Selector('.fa-arrow-left');
        this.rightArrow = Selector('.fa-arrow-right');
        this.ccComment = Selector('#cc-comments-textarea');
        this.ccOkButton = Selector('#cc-ok-button');
        
    }
}