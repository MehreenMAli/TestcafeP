import Modal from './modal';

export default class InfoModal extends Modal{
    constructor(){
        super();
        this.header = this.root.find('div.modal-header'); 
        this.title = this.header.child('h2');
        this.message = this.body.child('p');
        this.closeButton = this.header.find('button');
        this.footer = this.root.find('div.modal-footer');
        this.buttonClose = this.footer.find('button');
    }
}