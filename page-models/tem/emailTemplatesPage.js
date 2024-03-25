import { Selector } from 'testcafe';
import Table from '../table';
import {textInCell, Criteria, deleteElement, editElement } from '../../utils/helperFunctions';

export default class EmailTemplatesPage{
    constructor(){
        this.table = new Table(Selector('#table-email-templates'));
        this.addNewButton = Selector('#add-new', {visibility: true});

        //New Email Template Elements
        this.templateNameInput = Selector('input[formcontrolname="templateName"]');
        this.emailSenderDropdown = Selector('div.dropdown-arrow').nth(0);
        this.emailSenderDropdownOptions = this.emailSenderDropdown.find('p');
        this.subjectInput = Selector('input[formcontrolname="emailSubject"]');
        this.businessObjectsDropdown = Selector('div.dropdown-arrow').nth(1);
        this.businessObjectsDropdownOptions = this.businessObjectsDropdown.find('p');
        this.editor = Selector('quill-editor');
        this.editorTextArea = this.editor.find('div.ql-editor.ql-blank');
        this.fields = Selector('ul.field-list');
        this.fieldsItems = this.fields.find('li');
        this.cancelButton = Selector('#cancel-btn');
        this.saveButton = Selector('#save');
        this.editButton = Selector('i.fa.fa-pencil');
        
        this.filterTemplateName = Selector('#email_template_name');
        this.filterTemplateSubjet = Selector('#subject');
        this.filterReset = Selector('#reset-button-email-templates');
    }

    async deleteTemplate(templateName){
        let criteria = new Criteria(templateName, textInCell, deleteElement);
        return await this.table.findElement(criteria);
    }

    async editTemplate(templateName){
        let criteria = new Criteria(templateName, textInCell, editElement);
        return await this.table.findElement(criteria);
    }

    async existsTemplate(templateName){
        let criteria = new Criteria(templateName, textInCell);
        return await this.table.findElement(criteria);
    }
}