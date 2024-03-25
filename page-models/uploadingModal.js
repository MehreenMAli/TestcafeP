import { Selector } from 'testcafe';
import { visible } from '../utils/helperFunctions';

export default class UploadingModal{
    constructor(){
        this.body = visible(Selector('div.modal-body'));
        this.message = this.body.find('p');
        this.button = this.body.find('.btn-primary');
        this.doneButton = Selector('#done-button');
    }
}
