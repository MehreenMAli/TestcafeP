import { Selector } from 'testcafe';
import ReceiptsPage from './receiptsPage';

export default class ReceiptsMobilePage extends ReceiptsPage{
	constructor(){
		super();
		this.cameraUploadButton = Selector('label[for="cam-upload"]'); //This is the button
		this.cameraUploadInput = Selector('#cam-upload'); //This is the input to send a path
		this.createReportButton = Selector('button.btn.btn-primary.btn-block.text-uppercase'); //Add ID
		this.gridView = Selector('div.infinitescroll');
	}
}