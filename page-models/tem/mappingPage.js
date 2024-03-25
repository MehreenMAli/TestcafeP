import { Selector } from 'testcafe';

export default class MappingPage{
    constructor(){
        this.closeButton = Selector('#close-button');
        this.mappingNameInput = Selector('input').nth(0);
        this.fileTypeDropdown = Selector('#file-types-dropdown');
        this.groupTypeDropdown = Selector('#group-types-dropdown');
        this.hasHeadersCheckbox = Selector('cor-checkbox');
        this.commentsTextarea = Selector('textarea');
        this.fileNameInput = Selector('input').nth(4);
        this.uploadFileFieldsButton = Selector('#upload-button');
        this.mappingContainer = Selector('#mapping-container');
        this.testButton = Selector('#test-button');
        this.clearFileButton = Selector('#clear-button');
        this.saveButton = Selector('#close-button');
        this.importButton = Selector('#import-button');
    }
}