import { Selector } from 'testcafe';
//COR360 Page
export default class ExceptionQueuePage{
    constructor(){
        this.excelButton = Selector('i[class="fa fa-file-excel-o"]');
        this.downloadButton = Selector('i[class="fa fa-download"]');
        this.assignToUserDropdown = Selector('select');
        this.assignToUserDropdownOptions = this.assignToUserDropdown.find('option');
        this.releaseButton = Selector('button[class="btn btn-secondary pull-right"]');
        this.assignButton = Selector('button[class="btn btn-primary pull-right"]');

        //All tab
        this.allTab = Selector('#all');
        this.allTable = Selector('#table-all_orphanedDoc');
        this.allTableNumberInput = this.allTable.find('#number');
        this.allTableTypeInput = this.allTable.find('#type');
        this.allTableDateInput = this.allTable.find('#date');
        this.allTableMinInput = this.allTable.find('#amount-start');
        this.allTableMaxInput = this.allTable.find('#amount-end');
        this.allTableVendorInput = this.allTable.find('#vendor');
        this.allTableVendorNameInput = this.allTable.find('#vendor_name');
        this.allTableCommentsInput = this.allTable.find('#comments');
        this.allTableAssignInput = this.allTable.find('#assign');
        this.allTableResetButton = this.allTable.find('#reset-button-all_orphanedDoc');

        this.assignedTab = Selector('#assigned');
        this.pendedTab = Selector('#pended');
        this.unassignedTab = Selector('#unassigned');
    }
}