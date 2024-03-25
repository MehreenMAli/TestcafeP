import { Selector } from 'testcafe';

export default class UserMappingPage{
    constructor(){
        this.table = Selector("#table-mappingList");
        this.tableHeaders = this.table.find('th');
        this.addNewButton = Selector('#add-new');

        this.closeButton = Selector('.btn.flLeft.btn-primary');
        this.mappingName = Selector('#mapping-name-textbox');
        this.fileType = Selector('#file-type-dropdown');
        this.headers = Selector('#has-header-checkbox');
        this.updateExample = Selector('#upload-file-button');
        this.mapContainr = Selector('#mapping-container');
        this.textArea = Selector('#tests');
        this.addLables = Selector('label.legend');
    }
}   