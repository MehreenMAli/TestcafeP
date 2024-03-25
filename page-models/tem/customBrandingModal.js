import { Selector } from 'testcafe';

export default class CustomBrandingModal{
    constructor(){
        this.paletteNameInput = Selector('#palette-name');
        this.primaryInput = Selector('#palette-primary');
        this.secondaryInput = Selector('#palette-secondary');
        this.accentInput = Selector('#palette-accent');
        this.cancelButton = Selector('#palette-cancel');
        this.saveButton = Selector('#palette-save');
    }
}