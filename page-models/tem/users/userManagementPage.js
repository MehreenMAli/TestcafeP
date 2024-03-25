import { Selector } from 'testcafe';
import Modal from '../../modal';
import Table from '../../table';
import { visible, selectElement } from '../../../utils/helperFunctions';

export default class UserManagementPage {
    constructor () {
        this.saveButton = Selector('#save-user');
        this.cancelButton = Selector('#cancel-user');
        //Personal Info Tab
        this.personalInfoTab = Selector('#personal-info');
        this.usernameInput = Selector('input[formcontrolname="user_name"]');
        this.firstnameInput = Selector('input[formcontrolname="first_name"]');
        this.middlenameInput = Selector('input[formcontrolname="middle_name"]');
        this.lastnameInput = Selector('input[formcontrolname="last_name"]');
        this.titleInput = Selector('input[formcontrolname="title"]');
        this.phoneNumberInput = Selector('input[formcontrolname="phone"]');
        this.emailInput = Selector('input[formcontrolname="email"]');
        this.uploadFileInput = Selector('#file-upload'); //Hidden
        this.resetPasswordButton = Selector('button[class="btn btn-primary"]');
        this.approvalProfileButton = Selector('input[type="button"]');
        this.divisionInput = Selector('input[formcontrolname="custom2"]');
        this.vendorInput = Selector('input[formcontrolname="vendor_id"]');
        this.imageProfile = Selector('img[class="img-thumbnail"]');
        this.resetpasswordModal = new Modal();
        this.footerModal= Selector("modal-footer div[class='modal-footer']");
        this.acceptButonModal = this.footerModal.find('button[class="btn btn-primary"]');
        this.cancelButtonModal = this.footerModal.find('button[class="btn btn-primary"]');

        //labels from Personal Info Tab
        this.labelsPage = Selector('label.legend');
            // Specifics labels from Personal info Tab
            this.personalInfoTabLabel = Selector('#personal-info');
            this.upLoadLabel = Selector('label[class="custom-file-upload"]');
            this.saveButtonLabel = Selector('#save-user span');
            this.cancelButtonLabel = Selector('#cancel-user span');

        //GL Tags Tab
        this.glTagsTab = Selector('#tem-gl');
        this.segmentNameInput = Selector('input[typeaheadoptionfield="segment_name"]');
        this.segmentValue = Selector('input[disabled]');
        this.glTagsTable =  new Table(Selector('#table-user_tags_datatable'));
        this.newTagButton = Selector('#tag-button');

        //User Roles Tab
        this.userRolesTab = Selector('#tem-roles');
        this.fromTable = Selector('.options-switcher-table').nth(0);
        this.toTable = Selector('.options-switcher-table').nth(1);
        this.addButton = Selector('i[class="fa fa-arrow-right fa-2x"]');
        this.removeButton = Selector('i[class="fa fa-arrow-left fa-2x"]');
            //Labels User roles tab
            this.addButtonLabel = Selector('label');
            this.removeButtonLabel = Selector('label');

        //Profile Notifications Tab
        this.notificationsTab = Selector('#tem-notification');
        this.notificationsTable = new Table(visible(Selector('.table')));

        //Approbal tab
        this.approvalTab = Selector('#tem-limits');
        this.approvalLimitInput = Selector('#approval-limit');
        this.updateButton = Selector('#update-input');
        this.approvalLimitInputLabel = Selector('label.legend');
        //Profile Activity Tab
        this.profileActivityTab = Selector('#tem-activity');
        this.profileActivityTable = new Table(Selector('#table-activities'));
    }
}