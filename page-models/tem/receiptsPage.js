import { Selector } from 'testcafe';
import Pagination from '../pagination';
import RangeDatePicker from '../rangeDatePicker';

export default class ReceiptsPage{
	constructor(){
                this.pagination = new Pagination();
                this.uploadInput = Selector('#file-upload');
                this.gridButton = Selector('#gridView');
                this.listButton = Selector('#listView');
                this.filterInput = Selector('#input-search');
                this.allButton = Selector('div.attach-filter').find('button.btn.btn-primary').nth(0);
                this.unattachedButton = Selector('div.attach-filter').find('button.btn.btn-primary').nth(1);
                this.attachedButton = Selector('div.attach-filter').find('button.btn.btn-primary').nth(2);
                this.labels = Selector('label');
                this.receipts = Selector('div.img-wrapper');
                this.receiptsTable = Selector('#table-receipts_all');
                this.receiptsTableHeaders = this.receiptsTable.find('th');
                this.firstDeleteButton = Selector('i.fa-trash');
                this.modalDeleteConfirm = Selector('modal-footer.modal-footer');
                this.modalUpload = Selector('modal.modal.fade.in');
                this.createReport = Selector('button.btn.btn-primary.btn-block.text-uppercase');
                this.addImage = Selector('i.fa.fa-camera');
                this.dateMonth = Selector('div.datepicker__calendar__month');
                this.applyButton = Selector('#apply-range-dp');
                this.datePicker = new RangeDatePicker("[class='rang-daterange-picker']");
                this.datePickerInput = Selector('.range-calendar-label');
                this.caledarToggleButton = this.datePickerInput.find('i.fa.fa-calendar');
	}
}