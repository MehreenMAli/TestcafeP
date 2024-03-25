import Modal from './../modal';

export default class UploadModal extends Modal{
    constructor(){
        super();
        this.closeButton = this.body.find('button');
    }   
} 