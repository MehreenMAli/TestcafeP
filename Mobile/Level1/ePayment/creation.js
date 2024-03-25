import { Selector } from 'testcafe';
import { checkLabels, timeout, getMenu, checkRequests, logger, paste, clickable } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import MobilePage from './../../../page-models/mobilePage';
import ClientsPage from './../../../page-models/epay/clientsPage';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import SideBarPage from './../../../page-models/sideBarPage';
import HeaderPage from './../../../page-models/headerPage';
import PaymentAccountsPage from './../../../page-models/epay/paymentAccountsPage';
import PaymentAccountModal from './../../../page-models/epay/paymentAccountModal';
import NewClientModal from './../../../page-models/epay/newClientModal';
import BankSetupPage from '../../../page-models/epay/bankSetupPage';
import BankAccountModal from '../../../page-models/epay/bankAccountModal';
import InfoModal from '../../../page-models/infoModal.js';

process.removeAllListeners('unhandledRejection');

const localizator = new Localizator();
const dashboardTitles = Selector('div[class=title]');
const apiHandler = new APIHandler();
const page = new MobilePage();
const headerPage = new HeaderPage();
const sideBarPage = new SideBarPage();

const clientsPage = new ClientsPage();
const spinner = Selector('#fountainTextG > img');
const uniqueId = Date.now().toString();
const args = parseArguments();
const category = {
	id: 63000,
	name: "Cor360 Payments"
};

let ePayFixture = fixture`Mobile - Level 1 - ePayments - Creation - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before( async ctx  => {
		await before();
		let apps = await apiHandler.getApps(); 
		let application = apps.find(element => element['application_id'] === 63000);
		ctx.apps = apps;
		ctx.app = application.title; //ePayment
		ctx.menues = await apiHandler.getMenues(application.menu_param);
		ctx.labels = await localizator.getLabelsAsJson('ui-cte-0*,ui-pac-000,ui-pay-0*,ui-bank-*,msg-*');
	})
	.after( async ctx => {
		await after();
	})
	.beforeEach( async t => {
		let currentUser = users[args.user];
		await page.login(currentUser.username,
						currentUser.password,
						currentUser.landingPage);
	})
	.afterEach( async t => {
		await page.logout();
		await checkRequests(logger.requests);
	});

loadFixture(users[args.user],category,ePayFixture);

test(`TC 27225: Mobile Payment Accounts Add`, async t => {
	let paymentAccount = (getMenu(t.fixtureCtx.menues,203)).title;
	let paymentAccountsPage = new PaymentAccountsPage();
	let paymentAccountModal = new PaymentAccountModal();
	let accountName = `27225PayAcc_${uniqueId}`;
    let inputDirectory = `\\\\input_test_mobile`;
    let outputDirectory = `\\\\output_test_mobile`;
    let prenoteDirectory = `T:\\test\\mobile\\`;

	await t
		//2. Go to ePayment - The ePayment page is displayed
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-pay-000'],'The "Page Title" was wrong', timeout)
		//3. Click Nav Bar Toggler - The leftside menu is displayed with "Payments", "Clients" and "Payment Accounts" menues
		.click(headerPage.navBarToggler)
		//4. Click Payment Accounts in the left menu - Payment Accounts page is displayed
		.click(sideBarPage.items.withText(paymentAccount))
		//5. Check the title of the page - The title of the page is Payment Accounts
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-pac-000'],'The "Page Title" was wrong', timeout)
		//6. Check Page Elements - The page elements are the following: A "Payment Accounts" dropdown, "Edit", "Add New" and "Delete" buttons
		.expect(paymentAccountsPage.accountsDropdown.exists).ok('The "Accounts" dropdown should exist')
		
		.expect(paymentAccountsPage.addNewButton.exists).ok('The "Add" button should exist')
		.click(paymentAccountsPage.addNewButton);
	await t	
        //7. Insert the values in the fields
        .typeText(paymentAccountModal.accountNameInput,accountName,paste)
        .typeText(paymentAccountModal.inputDirectoryInput,inputDirectory,paste)
        .typeText(paymentAccountModal.outputDirectoryInput,outputDirectory,paste)
        .typeText(paymentAccountModal.prenoteDirectoryInput,prenoteDirectory,paste)
        //8. Click the Save button
		.click(paymentAccountModal.saveButton)
		//9. Search in the Payment Accounts dropdown for the added account
        .click(paymentAccountsPage.accountsDropdown)
        .expect(paymentAccountsPage.accountsDropdownOptions.withText(accountName).exists).ok('The recently created Payment account should be displayed on the Dropdown')
        //10. Edit the Recently Created Payment Account and check its values
        .click(paymentAccountsPage.accountsDropdownOptions.withText(accountName))
        .click(paymentAccountsPage.editButton)
        .expect(paymentAccountModal.accountNameInput.value).eql(accountName)
        .expect(paymentAccountModal.inputDirectoryInput.value).eql(inputDirectory)
        .expect(paymentAccountModal.outputDirectoryInput.value).eql(outputDirectory)
        .expect(paymentAccountModal.prenoteDirectoryInput.value).eql(prenoteDirectory)
        .click(paymentAccountModal.cancelButton)
        //11. Delete the Recently Created Payment Account
        .click(paymentAccountsPage.accountsDropdown)
        .click(paymentAccountsPage.accountsDropdownOptions.withText(accountName))
		.click(paymentAccountsPage.deleteButton)
		.click(paymentAccountsPage.deleteModal)
        //12. Verify it is successfully deleted
        .click(paymentAccountsPage.accountsDropdown)
        .expect(paymentAccountsPage.accountsDropdownOptions.withText(accountName).exists).notOk('The recently created Payment account should NOT be displayed on the Dropdown')
        .click(paymentAccountsPage.accountsDropdown);
		
});

test(`TC 27228: Mobile - Mobile Bank Account Add`, async t => {
	let bankSetupPage = new BankSetupPage();
	let bankAccountModal = new BankAccountModal();
	let labels = t.fixtureCtx.labels;
	let bank = (getMenu(t.fixtureCtx.menues,204)).title;
	let today = new Date().getDate().toString();
	let day = Selector('div.btn-secondary').filter('div:not(.text-muted)').withText(today);
	let headers = [	labels['ui-bank-002'],
					labels['ui-bank-003'], 
					labels['ui-bank-004'], 
					labels['ui-bank-005'], 
					labels['ui-bank-006'], 
					labels['ui-bank-015']
	];
	let infoModal = new InfoModal();
	
	await t
		//2. Go to ePayment
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-pay-000'],'The "Page Title" was wrong', timeout)
		//3. Click Nav Bar Toggler
		.click(headerPage.navBarToggler)
		//4. Click on Clients in the left menu
		.click(sideBarPage.items.withText(bank))
		.wait(2000)
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-bank-000'],'The "Page Title" was wrong', timeout)
		//5. Check the Page Elements
		.expect(bankSetupPage.table.exists).ok('The table grid should exist')
		.expect(await checkLabels(bankSetupPage.table.headers, headers)).ok('The "Header" table was wrong')
		//6. Click the "Add New" button
		.expect(bankSetupPage.addNewButton.exists).ok('The "Add New" button should exist')
		.click(bankSetupPage.addNewButton)
		.typeText(bankAccountModal.bankNameInput,`BANK_${uniqueId}`,paste)
        //6. Add a unique Bank Account Name
        .typeText(bankAccountModal.bankAccountNameInput,`AABANK_A_${uniqueId}`,paste)
        //7. Add a unique Account Number
        .typeText(bankAccountModal.accountNumberInput,uniqueId,paste)
        //8. Add a unique Routing Number
        .typeText(bankAccountModal.routingNumberInput,uniqueId.substring(0, 9),paste)
        //9. Add a unique GP Checkbook ID
        .typeText(bankAccountModal.gpCheckbookIdInput,uniqueId,paste)
        //10. Select USD as the currency
        .click(bankAccountModal.currencyDropdown)
        .click(bankAccountModal.currencyDropdownOptions.nth(0))
        //11. Add a unique Description
        .typeText(bankAccountModal.description,`DESCRIPTION_${uniqueId}`,paste)
		//12. Select "Today" as the effective date
        .click(bankAccountModal.datePicker.find('input'))
        .click(day)
        //13. Click "Save" button
        .click(bankAccountModal.saveButton)
        .click(infoModal.closeButton);
		//14. Delete Bank Account
		let allBankAccount = await apiHandler.getAllBankAccount();
		let bankAccount = await bankSetupPage.getIdBankAccount(`BANK_${uniqueId}`, allBankAccount)
		await apiHandler.deleteBankAccount(bankAccount);
});

test(`TC 27870: Mobile Duplicate Bank Account`, async t => {
	let uniqueId = Date.now().toString();
	let bankSetupPage = new BankSetupPage();
	let bankAccountModal = new BankAccountModal();
	let bank = (getMenu(t.fixtureCtx.menues, 204)).title;
	let today = new Date().getDate().toString();
	let day = Selector('div.btn-secondary').filter('div:not(.text-muted)').withText(today);
	let infoModal = new InfoModal();

	await t
		//2. Go to ePayment
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-pay-000'], 'The "Page Title" was wrong', timeout)
		//3. Click Nav Bar Toggler
		.click(headerPage.navBarToggler).wait(2000)
		//4. Click on Clients in the left menu
		.click(sideBarPage.items.withText(bank))
		.wait(2000)
	//4. Click "Add New"
	await t
		.click(await clickable(bankSetupPage.addNewButton))
		//5. Add a new Bank Account
		.typeText(bankAccountModal.bankNameInput, `BANK_${uniqueId}`, paste)
		.typeText(bankAccountModal.bankAccountNameInput, `BANK_ACC_${uniqueId}`, paste)
		.typeText(bankAccountModal.accountNumberInput, uniqueId, paste)
		.typeText(bankAccountModal.routingNumberInput, uniqueId.substring(0, 9), paste)
		.typeText(bankAccountModal.gpCheckbookIdInput, uniqueId, paste)
		.click(bankAccountModal.currencyDropdown)
		.click(bankAccountModal.currencyDropdownOptions.nth(0))
		.click(bankAccountModal.datePicker.find('input'))
		.click(day)
		.typeText(bankAccountModal.description, `DESCRIPTION_${uniqueId}`, paste)
		.click(bankAccountModal.saveButton)
		.click(infoModal.closeButton)
		.wait(5000)
		//6. Duplicate Bank Account
		.click(await clickable(bankSetupPage.addNewButton))
		.typeText(bankAccountModal.bankNameInput, `BANK_${uniqueId}`, paste)
		.typeText(bankAccountModal.bankAccountNameInput, `BANK_ACC_${uniqueId}`, paste)
		.typeText(bankAccountModal.accountNumberInput, uniqueId, paste)
		.typeText(bankAccountModal.routingNumberInput, uniqueId.substring(0, 9), paste)
		.typeText(bankAccountModal.gpCheckbookIdInput, uniqueId, paste)
		.click(bankAccountModal.currencyDropdown)
		.click(bankAccountModal.currencyDropdownOptions.nth(0))
		.click(bankAccountModal.datePicker.find('input'))
		.click(day)
		.typeText(bankAccountModal.description, `DESCRIPTION_${uniqueId}`, paste)
		.click(bankAccountModal.saveButton)
		.click(infoModal.closeButton)
		.wait(5000);
	try {
		//16. Delete Bank Account
		let allBankAccount = await apiHandler.getAllBankAccount();
		let bankAccount = await bankSetupPage.getIdBankAccount(`BANK_${uniqueId}`, allBankAccount)
		await apiHandler.deleteBankAccount(bankAccount);
	}
	catch (err) {
		let allBankAccount = await apiHandler.getAllBankAccount();
		let bankAccount = await bankSetupPage.getIdBankAccount(`BANK_${uniqueId}`, allBankAccount)
		await apiHandler.deleteBankAccount(bankAccount);
		throw err;
	}

});

test(`TC 27288: Mobile 'Clients' Add`, async t => {
	let clients = (getMenu(t.fixtureCtx.menues,202)).title;
	let clientsPage = new ClientsPage();
	let newClientModal = new NewClientModal();
	let uniqueId = Date.now().toString();
	let accountName = `AAACC_${uniqueId}`;
    let customerName = `AACUST_${uniqueId}`;
    let clientNotifyEmail = `test@test.com`;
    let clientUrl = `www.test.com`;
    let filename = `test.txt`;
	
await t
	//2. Go to ePayment - The ePayment page is displayed
	.click(dashboardTitles.withText(t.fixtureCtx.app))
	.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-pay-000'],'The "Page Title" was wrong', timeout)
	//3. Click Nav Bar Toggler - The leftside menu is displayed with "Payments", "Clients" and "Payment Accounts" menues
	.click(headerPage.navBarToggler)
	//4. Click Payment Accounts in the left menu - Payment Accounts page is displayed
	.click(sideBarPage.items.withText(clients))
	//5. Check the title of the page - The title of the page is Payment Accounts
	.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-cte-000'],'The "Page Title" was wrong', timeout)
	//6. Check the Add Client Button
	.expect(clientsPage.addClientButton.exists).ok('The "Add Client" button should exist')
	//7. Click on Add Client Button
	.click(clientsPage.addClientButton)
	//8. Close
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
		let idClient = await clientsPage.getIdClient(customerName,allClients);
		await t.expect(await clientsPage.existsClient(customerName,allClients)).ok('The Client should be exists');   
        //8. Delete the recently created client
		await apiHandler.deleteClient(idClient);
    }
    catch (err){
		let allClients = await apiHandler.getClients(); 
		let idClient = await clientsPage.getIdClient(customerName,allClients);
		await apiHandler.deleteClient(idClient);
		throw err;
    }

});