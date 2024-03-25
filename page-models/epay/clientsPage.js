import { Selector } from 'testcafe';
import { Criteria, textInCell, deleteElement, holdElement, unHoldElement, editElement } from '../../utils/helperFunctions';
import Table from '../../page-models/table';

export default class ClientsPage{
	constructor(){
        this.addClientButton = Selector('#add-client');
        this.displayDropdown = Selector('#dropdownToggle');
        this.restoreToDefaultButton = Selector('#restoreDefault');
        this.clientsTable = new Table(Selector('#table-epay-clients'));
    }

    async deleteClient(client){
        let criteria = new Criteria(client,textInCell,deleteElement,1);
        return await this.clientsTable.findElement(criteria); 
    }

    async editClient(client){
        let criteria = new Criteria(client,textInCell,editElement);
        return await this.clientsTable.findElement(criteria); 
    }

    async existsClient(customerName,allClients){
        for(let i=0; i<allClients.length;i++){
            if(allClients[i].customer_name === customerName){
                return true;
            }
        }
        return false;
    }

    async holdClient(client){
        let criteria = new Criteria(client,textInCell,holdElement);
        return await this.clientsTable.findElement(criteria); 
    }

    async unHoldClient(client){
        let criteria = new Criteria(client,textInCell,unHoldElement);
        return await this.clientsTable.findElement(criteria); 
    }

    async getClient(customerId,allClients){
        for(let i=0; i<allClients.length;i++){
            if(allClients[i].customer_id === customerId){
                return allClients[i];
            }
        }
        return null;
    }

    async getIdClient(customer,allClients){
        for(let i=0; i<allClients.length;i++){
            if(allClients[i].customer_name === customer){
                return allClients[i].customer_id;
            }
        }
        return null;
    }

}
    