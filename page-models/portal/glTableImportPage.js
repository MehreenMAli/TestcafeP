import { Selector } from 'testcafe';

export default class GLTableImport {

    constructor() {
        this.customersDropdown = Selector('cor-dropdown').nth(0);
        this.tablesDropdown = Selector('cor-dropdown').nth(1);
        this.fileDelimiterDropdown = Selector('cor-dropdown').nth(2);
        this.mappingNameInput = Selector('input[type="text"]').nth(2); 
        this.hasHeaderCheckbox = Selector('i.fa-check');
        this.fileNameInput = Selector('input[type="text"]').nth(4);
        this.uploadFileButton = Selector('.btn.btn-primary').nth(1); 
        this.cancelButton = Selector('#cancel');
        this.labels = Selector('label');
    }
}
