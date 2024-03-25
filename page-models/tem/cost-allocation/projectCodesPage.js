import { Selector, t } from 'testcafe';
import Pagination from '../../pagination';
import Table from '../../table';
import { Criteria, textInCell, deleteElement, editElement } from '../../../utils/helperFunctions';
import Dropdown from '../../dropdown';
import Modal from '../../modal';

export default class ProjectCodesPage{
    constructor () {
        this.projectNameInput = Selector('input[formcontrolname="project_name"]', {visibility: true});
        this.projectCodeInput = Selector('input[formcontrolname="project_code"]', {visibility: true});
        this.addNewButton = Selector('#add-new');
        this.datePicker = Selector('#effective-date');
        this.table = new Table(Selector('#table-projects-codes-setup'));
        this.tableRows = this.table.find('tr');
        this.tableHeaders = this.table.find('th');
        this.pagination = new Pagination();
        this.modal = Selector('modal.info-modal');
        this.modalEdit = Selector('modal.modal');
        this.projectNameModal = this.modalEdit.find('input');
        this.projectCodeModal = this.modalEdit.find('input').nth(1);
        this.saveModal = Selector('form i.fa-check');
        this.saveButton = Selector('#save_button');
        this.cancelButton = Selector('#cancel_button');
        this.comboProjectCodeDisplayMode = Selector('#show-project-code-dropdown')
        this.dropDownButton = this.comboProjectCodeDisplayMode.find('i.fa.fa-sort-down')
        this.dropDownOptions = this.comboProjectCodeDisplayMode.find('p.dropdown-option')
        this.confirmationModal = new Modal();
        this.confirmationModalSaveButton = this.confirmationModal.footerButtons.find('i.fa.fa-check');
        this.confirmationModalCancelButton = this.confirmationModal.footerButtons.find('i.fa.fa-times');
        this.labels = Selector('label');
        this.firstEditButton = Selector('button.btn-action').nth(0);
    }

    async deleteProjectCode(projectCode){
        let criteria = new Criteria(projectCode,textInCell,deleteElement);
        return await this.table.findElement(criteria);
    }

    async searchProjectCode(projectCode){
        let criteria = new Criteria(projectCode, textInCell);
        return await this.table.findElement(criteria);
    }

    async editProjectCode(projectCode){
        let criteria = new Criteria(projectCode,textInCell,editElement);
        return await this.table.findElement(criteria);
    }
}