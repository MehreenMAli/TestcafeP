import { Selector } from 'testcafe';

export default class Modal{
    constructor(){
        this.root = Selector('modal.fade.in');
        this.body = this.root.find('div.modal-body');
        this.footer = this.root.find('div.modal-footer');
        this.footerButtons = this.footer.find('button');
    }
}