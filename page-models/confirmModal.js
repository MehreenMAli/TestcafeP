import Modal from './modal';

export default class ConfirmModal extends Modal{
    constructor(){
        super();
        this.header = this.root.find('modal-header'); 
        this.title = this.header.find('h2');
        this.message = this.body.child('p');
        this.errors = this.body.find('div.errors');
        this.textArea = this.body.find('textarea');
        this.footer = this.root.find('modal-footer');
        this.acceptButton = this.footer.find('button.btn.btn-primary');
        this.cancelButton = this.footer.find('button.btn.btn-secondary');
        this.closeButton = this.header.find('button');
        this.discard = this.footer.find('button.btn.btn-primary');
    }
}
