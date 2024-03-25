import { Selector } from "testcafe";

export default class SSAContactPage {
    constructor() {
        this.imgPage = Selector('img.truck');
        this.titlePage = Selector('h4');
        this.contactText = Selector('div.animated.fadeIn.ssa.contact.row');
        this.infoContact = Selector('div.contact-info.d-block');
        this.imgProfile = Selector('img.img-avatar');
    }
}