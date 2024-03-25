import { Selector, t } from 'testcafe';
import Table from '../table';
import ConfirmModal from '../confirmModal';

export default class ProxyOnBehalfOfPage{
    constructor(){
        this.addProxyButton = Selector('#save');
        this.nameInput = Selector('#proxy_name');
        this.personProxiedInput = Selector('#person_proxied');
        this.effectiveDatepicker = Selector('#userList-daterangePicker2');
        this.endDatepicker = Selector('#userList-daterangePicker3');
        this.resetButton = Selector('#reset-button-userList');
        this.table = new Table(Selector('#table-userList'));
    }

    async deleteProxy(proxyName){
        let confirmModal = new ConfirmModal();
        let deleteIcon = Selector('i[class="fa fa-trash"]');
        await this.searchProxy(proxyName);
        await t
            .click(deleteIcon)
            .click(confirmModal.acceptButton);
        return true;
    }

    async searchProxy(proxyName){
        await t
            .typeText(this.nameInput,proxyName,paste)
            .pressKey('enter');
    }
}