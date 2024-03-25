import { Selector } from 'testcafe';

export default class ManageQueuePage{
    constructor(){
        this.communityInput = Selector('input[typeaheadoptionfield="community_name"]');
        // filter input
        this.allRadioButton = Selector('#all');
        this.oneDayRadioButton = Selector('input').withAttribute('id', '1_day');
        this.oneWeekRadioButton = Selector('input').withAttribute('id', '1_week');
        this.otherRadioButton = Selector('#other');
        this.docNumerRadioButton = Selector('#docNumber');
        this.docNameRadioButton = Selector('#docName');
        this.leftDatepicker = Selector('input[name="dp1"]').nth(0); 
        this.rightDatepicker = Selector('input[name="dp1"]').nth(1);
        this.labels = Selector('label');
        
        this.reloadButton = Selector('button.btn-primary[type="button"]');
        this.table = Selector('#table-inbox_all');
        this.tableHeaders = this.table.find('th');
        
        this.lightBlueDiv = Selector('div.row.light-blue-box');
        this.paddingDiv = Selector('div.row.padding-box');
        this.buttonDiv = Selector('div.row.button-row');
       
    }
}