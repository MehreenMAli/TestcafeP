import { Selector } from 'testcafe';

export default class ImportGLPage{
    constructor(){
        this.businessEntityDropdown = Selector('#entities');
        this.communityDropdown = Selector('#communities');
        this.offeringDropdown = Selector('#offerings');
        this.mappingNameInput = Selector('#mapping-name');
        this.fileTypeDropdown = Selector('#file-type');
        this.hasHeaderCheckbox = Selector('#has-header');
        this.uploadInput = Selector('#file-upload');
        this.testButton = Selector('#test');
        this.clearButton = Selector('#clear');
        this.saveButton = Selector('#save');
        this.importButton = Selector('#import');
        this.textArea = Selector('#tests');
    }
}