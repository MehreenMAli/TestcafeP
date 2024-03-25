import { Selector, t } from 'testcafe';
import Table from '../../table';

export default class ManageGL{
    constructor(){
        this.manageGLAccess = Selector('#tem-gl-manage').withText('Manage GL');
        this.manageGLTable = new Table(Selector('#table-values'));
        this.labelValue = Selector('label.legend');
        this.filterInputs = Selector('input.filters');

        this.reserButton = Selector('#reset-button-values');
        //Buttons
        this.importGLValuesButton = Selector('i.fa.fa-upload');
        this.clearallGLValuesButton = Selector('i.fa.fa-trash');
        this.addGLValueButton = Selector('i.fa.fa-plus');

        this.addButtons = Selector('button.btn.flLeft.btn-primary');
        this.addButtonsPrimary = Selector('button.btn.btn-primary');
        this.addInputs = Selector('div.col-md-2.left-30');
        
        //Modal confirm discard changes
        this.modalConfirm = Selector('modal.confirm-modal');
        this.modalTitle = Selector('h2.modal-title');
        this.modalBody = Selector('div.modal-body');
        this.modalFooter = Selector('div.modal-footer');
        this.modalHeader = Selector('div.modal-header');
        this.clearButton = this.modalFooter.find('i.fa.fa-check');
        this.cancelButton = Selector('i.fa.fa-times');

        //Modal confirmation new segment

        this.newModal = Selector('div.modal-content').nth(1);
        this.newModalTitle = this.newModal.find('h2.modal-title');
        this.newModalbody = this.newModal.find('div.modal-body');
        this.newModalcloseButton = this.newModal.find('button.close');

        //Modal confirmation delete segment
        this.deleteModalcloseButton = Selector('div.modal-content button.close').nth(1)

        //edition mode
        this.editPencilButton = Selector('i.fa.fa-pencil');
        this.greenCheckButton = Selector('i.fa.fa-check.accent-color');
        this.redCancelButton = Selector('i.fa.fa-times').nth(0);
        this.rowInputs = Selector('input.form-control');

    }

    async getRowSegmentId(segmentName, segmentID, allSegmentsRows){
        for(let i = 0; i < allSegmentsRows.items.length; i++) {
            let element = allSegmentsRows.items[i];
            let value = element.value[segmentID];
            if (value == segmentName){
                return element.row_id
            }
        }  
    }
}