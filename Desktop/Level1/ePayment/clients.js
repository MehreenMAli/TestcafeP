import { Selector } from 'testcafe';
import { byID, paste, getMenu, insensitive, timeout, checkRequests, logger } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from '../../../hooks';
import users from '../../../users';
import config from '../../../config';
import Page from './../../../page-models/page';
import ClientsPage from './../../../page-models/epay/clientsPage';
import NewClientModal from '../../../page-models/epay/newClientModal';
import APIHandler from '../../../utils/apiHandler';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';

const localizator = new Localizator();
const page = new Page();
const newClientModal = new NewClientModal();
const args = parseArguments();
const apiHandler = new APIHandler();
const category = {
	id: 63000,
	name: "Cor360 Payments"
};

let ePayFixture = fixture`Level 1 - ePayment - Clients - Running on "${args.env.toUpperCase()}"`
    .page(config[args.env].baseUrl)
    .requestHooks(logger)
    .before(async ctx  => {
        await before();
        let apps = await apiHandler.getApps(); 
        let application = apps.find(element => element['application_id'] === 63000);
        ctx.apps = apps;
        ctx.app = application.title; //ePayment
        ctx.menues = await apiHandler.getMenues(application.menu_param); 
        ctx.labels = await localizator.getLabelsAsJson('ui-cte-000,msg-00-00*');
	})
	.after( async () => {
		await after();
	})
	.beforeEach( async () => {
		let currentUser = users[args.user];
		await page.login(currentUser.username,
						currentUser.password,
						currentUser.landingPage);
	})
	.afterEach( async () => {
        await page.logout();
        await checkRequests(logger.requests);
    });
    
loadFixture(users[args.user],category,ePayFixture);

test(`TC 24222: Add New Client - Required Fields error messages`, async t => {
    let menues = t.fixtureCtx.menues;
    let clientsMenu = getMenu(menues,202);
    let clients = byID(clientsMenu.action_key);
    let requiredField = t.fixtureCtx.labels['msg-00-002'];
    let clientsPage = new ClientsPage();
    await t
        //2. Go to ePayment
        //3. Click on Clients in the left menu
        .click(clients)
        .expect(page.title.innerText).match(insensitive(t.fixtureCtx.labels['ui-cte-000']),'The page title was wrong',timeout)
        //4. Click on Add Client button
        .click(clientsPage.addClientButton)
        .click(newClientModal.saveButton)
        //5. Click on Save button
        .expect(newClientModal.accountNameInput.error.innerText).contains(requiredField)
        .expect(newClientModal.customerNameInput.error.innerText).contains(requiredField)
        .expect(newClientModal.gpVendorIdInput.error.innerText).contains(requiredField)
        .expect(newClientModal.clientNotifyEmailInput.error.innerText).contains(t.fixtureCtx.labels['msg-00-005']) //Email not valid
        .expect(newClientModal.urlInput.error.innerText).contains(requiredField)
        .expect(newClientModal.paymentFilenameInput.error.innerText).contains(requiredField)
        .expect(newClientModal.clientCodeInput.error.innerText).contains(requiredField)
        .expect(newClientModal.clientCheckStringInput.error.innerText).contains(requiredField)
        //6. Click Close button
        .click(newClientModal.closeButton);        
});

test(`TC 24225: Add New Valid Client`, async t => {
    let uniqueId = Date.now().toString();
    let menues = t.fixtureCtx.menues;
    let accountName = `ACC_${uniqueId}`;
    let customerName = `CUST_${uniqueId}`;
    let clientNotifyEmail = `test@test.com`;
    let clientUrl = `www.test.com`;
    let filename = `test.txt`;
    let clientsMenu = getMenu(menues,202);
    let clients = byID(clientsMenu.action_key);
    let clientsPage = new ClientsPage();
    await t
        //2. Go to ePayment
        //3. Click on Clients in the left menu
        .click(clients)
        .expect(page.title.innerText).match(insensitive(t.fixtureCtx.labels['ui-cte-000']),'The page title was wrong',timeout)
        //4. Click on Add Client button
        .click(clientsPage.addClientButton)
        //5. Insert the values in the fields
        .typeText(newClientModal.accountNameInput,accountName,paste)
        .typeText(newClientModal.customerNameInput,customerName,paste)
        .typeText(newClientModal.gpVendorIdInput,uniqueId,paste)
        .typeText(newClientModal.clientNotifyEmailInput,clientNotifyEmail,paste)
        .typeText(newClientModal.urlInput,clientUrl,paste)
        .typeText(newClientModal.routingInput,uniqueId,paste)
        .click(newClientModal.currencyTypeDropdown)
        .click(newClientModal.currencyTypeDropdownOptions.nth(0))
        .click(newClientModal.paymentPartnerDropdown)
        .click(newClientModal.paymentPartnerDropdownOptions.nth(0))
        .typeText(newClientModal.paymentFilenameInput,filename,paste)
        .typeText(newClientModal.clientCodeInput,uniqueId.substring(0, 10),paste)
        .typeText(newClientModal.clientCheckStringInput,uniqueId.substring(0, 10),paste)
        //6. Client Save button
        .click(newClientModal.saveButton);
        //7. Chech if exists
    try{
        let allClients = await apiHandler.getClients(); 
        await t.expect(await clientsPage.existsClient(customerName,allClients)).ok('The Client should be exists');   
        //8. Delete the recently created client
        await t.expect(await clientsPage.deleteClient(customerName)).ok('The Client should be deleted');
        allClients = await apiHandler.getClients();
        await t.expect(await clientsPage.existsClient(customerName,allClients)).notOk('The Client should not be exists');
    }
    catch (err){
        await t.expect(await clientsPage.deleteClient(customerName)).ok('The Client should be deleted');
        throw err;
    }
    
});

test(`TC 26923: Client Change Hold and Un-Hold`, async t => {
    let uniqueId = Date.now().toString();
    let menues = t.fixtureCtx.menues;
    let clientsMenu = getMenu(menues,202);
    let clients = byID(clientsMenu.action_key);
    let clientsPage = new ClientsPage();

    let dataString = `Test${uniqueId}`;
    let emailClient = `test${uniqueId}@test.com`;
    let clientNew = await apiHandler.addClient(dataString,emailClient);
    try {
        await t
            //2. Go to ePayment
            //3. Click on Clients in the left menu
            .click(clients)
            .expect(page.title.innerText).match(insensitive(t.fixtureCtx.labels['ui-cte-000']),'The page title was wrong',timeout)
            .wait(2000); 
            //4. Click on Hold Client button
        await t.expect(await clientsPage.holdClient(clientNew.customer_name)).ok('The master hold client should be change');    
        let allClients = await apiHandler.getClients(); 
        let clientEdit = await clientsPage.getClient(clientNew.customer_id,allClients);
            //5. Chech change master hold
        await t.expect(await clientEdit.master_hold).ok('The master hold client must be true');
            //6. Click on Un-hold Client button
        await t.expect(await clientsPage.unHoldClient(clientNew.customer_name)).ok('The master hold client should be change');    
        allClients = await apiHandler.getClients(); 
        clientEdit = await clientsPage.getClient(clientNew.customer_id,allClients);
            //7. Chech change master hold
        await t.expect(await clientEdit.master_hold).notOk('The master hold client must be false');
            //8. Delete Client
        await apiHandler.deleteClient(clientNew.customer_id);  
    }
    catch(err){
        await apiHandler.deleteClient(clientNew.customer_id);
        throw err;
    }    
});

test(`TC 26926: Client Edition`, async t => {
    let uniqueId = Date.now().toString();
    let menues = t.fixtureCtx.menues;
    let clientsMenu = getMenu(menues,202);
    let clients = byID(clientsMenu.action_key);
    let clientsPage = new ClientsPage();

    let dataString = `Test${uniqueId}`;
    let emailClient = `test_edit@test.com`;
    let clientNew = await apiHandler.addClient(dataString,emailClient);
    try {
        await t
            //2. Go to ePayment
            //3. Click on Clients in the left menu
            .click(clients)
            .expect(page.title.innerText).match(insensitive(t.fixtureCtx.labels['ui-cte-000']),'The page title was wrong',timeout)
            .wait(2000); 
            //4. Click on Edit Client button
        await clientsPage.editClient(clientNew.customer_name);    
            //5. Change data
        await t
            .click(newClientModal.accountNameInput)
            .pressKey('ctrl+a delete') 
            .typeText(newClientModal.accountNameInput,`ZEDIT${uniqueId}`,paste)
            .click(newClientModal.customerNameInput)
            .pressKey('ctrl+a delete') 
            .typeText(newClientModal.customerNameInput,`ZEDIT${uniqueId}`,paste)
            .click(newClientModal.clientNotifyEmailInput)
            .pressKey('ctrl+a delete') 
            .typeText(newClientModal.clientNotifyEmailInput,emailClient,paste)
            .click(newClientModal.saveButton);
            //6. Check edition action
        let allClients = await apiHandler.getClients();     
        await t.expect(await clientsPage.existsClient(`ZEDIT${uniqueId}`,allClients)).ok('The Customer Name of the client should be change');    
            //8. Delete Client
        await apiHandler.deleteClient(clientNew.customer_id);  
    }
    catch(err){
        await apiHandler.deleteClient(clientNew.customer_id);
        throw err;
    }    
});