import { Selector, t } from 'testcafe';
import  Table  from '../table';
import { textInCell, Criteria, editElement } from '../../utils/helperFunctions';

export default class BankSetupPage {
    constructor () { 
        this.table = new Table(Selector('#table-epay-bank-account'));
        this.addNewButton = Selector('#add-cor-bank-account');
        this.cancelButton = Selector('#cancel--cor-bank-account');
        this.firstAuditIcon = Selector('i[class="fa fa-newspaper-o"]');
    }

    async editBankAccount(bankName){
        return await this.table.findElement(new Criteria(bankName, textInCell, editElement));
    }

    async getIdBankAccount(bankName, bankAccounts){
        let idBankAccount = 0;
        for(let i=0; i < bankAccounts.length; i++){
            if(bankAccounts[i].bank_name === bankName){
                return bankAccounts[i].bank_account_id;
            }
        }
        return idBankAccount;
    }
}