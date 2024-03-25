import { Selector, t } from 'testcafe';
import { Criteria, textInCell, visible } from '../../utils/helperFunctions';
import InboxMobileTable from './inboxTable';

let checkDocumentInTable = async function(firstRow,dateRow,amountRow){
    let firstRowCells = await firstRow.find('td');
    let dateRowCells = await dateRow.find('td');
    let amountRowCells = await amountRow.find('td');
    //First Row. 
    //Type.
    let type = await firstRowCells.nth(0).innerText;
    //console.log(`type: ${type.trim()} element: ${this.element.document_type_name}`);
    if(type.trim() !== this.element.document_type_name)
        return false;
    //Number.
    let number = await firstRowCells.nth(1).innerText;
    //console.log(`number: ${number} element: ${this.element.document_id_display}`);
    if(number.trim() !== this.element.document_id_display)
        return false;
    //Status
    let status = await firstRowCells.nth(2).innerText;
    //console.log(`status: ${status.toLowerCase()} element: ${this.element.status_type}`);
    if(status.trim().toLowerCase() !== this.element.status_type)
        return false;  

    //Date Row.
    /*
    let date = new Date(await dateRowCells.nth(1).innerText).toLocaleDateString('en-US');
    let elementDate = new Date(this.element.date).toLocaleDateString('en-US');
    console.log(`date: ${date} element: ${elementDate}}`);
    if(date.trim() !== elementDate)
        return false;
    */

    //Amount Row.
    let amount = await amountRowCells.nth(1).innerText;
    //console.log(`amount: ${amount} element: ${this.element.amount.toLocaleString()}`);
    if(!amount.includes(this.element.amount.toLocaleString()))
        return false;

    return true;
}

let workOnElement = async function(row){
    let workButton = await row.find(".fa-file-text-o");
    await t
        .click(workButton);
};

let viewElement = async function(row){
    let viewButton = await row.find('.fa.fa-eye.invoice-view-details');
    await t
        .click(viewButton);
};


export default class InboxPage {
    constructor () {
        this.title = Selector('#breadcrumb-title');
        this.statusDropdown = Selector('#phone-dropdown');
        this.statusDropdownOptions = Selector('#phone-dropdown-options').find('li');
        this.type = Selector('.icon-with-text-circle');
        this.number = Selector('span'); //TODO add id.
        this.status = Selector('.status-invoice');
        this.view = Selector('button[title="View Details"]');
        this.work = Selector('button[title="Invoice"]');

        //TODO: assing id to table.
        this.table = new InboxMobileTable(visible(Selector('table[class="table cor360-table cor360-phone-table"')));
    }

    async workOnDocument(document){
        let criteria = new Criteria(document,textInCell,workOnElement);
        return await this.table.findElement(criteria);
    }

    async viewDocument(document){
        let criteria = new Criteria(document,textInCell,viewElement);
        return await this.table.findElement(criteria);
    }

    async findDocument(document){
        let criteria = new Criteria(document,textInCell);
        return await this.table.findElement(criteria);
    }

    async checkDocumentData(document,i){
        let criteria = new Criteria(document,checkDocumentInTable);
        return await this.table.checkElement(criteria,i);
    }

    async existDocumentType(document,j){
        for(let i=0; i<document.total; i++){
            if(document.items[i].document_type == j){
                return true;
            }
        }
        return false;
    }
}
