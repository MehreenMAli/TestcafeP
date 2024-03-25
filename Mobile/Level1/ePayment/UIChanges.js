import { Selector } from 'testcafe';
import { byID, checkLabels, timeout, getMenu, insensitive, checkRequests, logger, paste } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import MobilePage from './../../../page-models/mobilePage';
import ClientsPage from './../../../page-models/epay/clientsPage';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import PaymentsMobilePage from './../../../page-models/epay/paymentsMobilePage';
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

const uniqueId = Date.now().toString();
const args = parseArguments();
const category = {
	id: 63000,
	name: "Cor360 Payments"
};

let ePayFixture = fixture`Mobile - Level 1 - ePayments - Editation - Running on "${args.env.toUpperCase()}"`
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

test(`TC 27226: Mobile Payment Accounts Edition`, async t => {
	let paymentAccount = (getMenu(t.fixtureCtx.menues,203)).title;
	let paymentAccountsPage = new PaymentAccountsPage();
	let paymentAccountModal = new PaymentAccountModal();
	let accountName = `27226PayAcc_${uniqueId}`;
    let inputDirectory = `\\\\input_test_mobile`;
    let outputDirectory = `\\\\output_test_mobile`;
    let prenoteDirectory = `T:\\test\\mobile\\`;
    let accountNameEdit = `27226PayAccEdit_${uniqueId}`;

	await t
		//2. Go to ePayment - The ePayment page is displayed
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-pay-000'],'The "Page Title" was wrong', timeout)
		//3. Click Nav Bar Toggler - The leftside menu is displayed with "Payments", "Clients" and "Payment Accounts" menues
		.click(headerPage.navBarToggler)
		//4. Click Payment Accounts in the left menu - Payment Accounts page is displayed
		.click(sideBarPage.items.withText(paymentAccount))
		.click(paymentAccountsPage.addNewButton);
	await t	
        //5. Create Payment Account
        .typeText(paymentAccountModal.accountNameInput,accountName,paste)
        .typeText(paymentAccountModal.inputDirectoryInput,inputDirectory,paste)
        .typeText(paymentAccountModal.outputDirectoryInput,outputDirectory,paste)
        .typeText(paymentAccountModal.prenoteDirectoryInput,prenoteDirectory,paste)
        .click(paymentAccountModal.saveButton)
		.click(paymentAccountsPage.accountsDropdown)
        //6. Edit the Recently Created Payment Account and check its values
        .click(paymentAccountsPage.accountsDropdownOptions.withText(accountName))
        .click(paymentAccountsPage.editButton)
        .click(paymentAccountModal.accountNameInput)
        .pressKey('ctrl+a delete')
        .typeText(paymentAccountModal.accountNameInput,accountNameEdit,paste)
        .wait(2000)
        .click(paymentAccountModal.saveButton)
        //7. Check if edit account name
        .click(paymentAccountsPage.accountsDropdown)
        .expect(paymentAccountsPage.accountsDropdownOptions.withText(accountNameEdit).exists).ok('The recently editated Payment account should be displayed on the Dropdown')
        //8. Delete the Recently edited Payment Account
        //.click(paymentAccountsPage.accountsDropdown)
        .click(paymentAccountsPage.accountsDropdownOptions.withText(accountNameEdit))
        .click(paymentAccountsPage.deleteButton)
        //9. Verify it is successfully deleted
        .click(paymentAccountsPage.accountsDropdown)
        .expect(paymentAccountsPage.accountsDropdownOptions.withText(accountNameEdit).exists).notOk('The recently created Payment account should NOT be displayed on the Dropdown')
        .click(paymentAccountsPage.accountsDropdown);	
});

test(`TC 27229: Mobile - Mobile Bank Account Edition`, async t => {
	let bankSetupPage = new BankSetupPage();
	let bankAccountModal = new BankAccountModal();
	let bank = (getMenu(t.fixtureCtx.menues,204)).title;
	let infoModal = new InfoModal();
	
	let accountName = `BANK_ACC_${uniqueId}`;
    let bankName = `BANK_${uniqueId}`;
    let accountNumber = `BANKN_${uniqueId}`;
    let bankAccountNew = await apiHandler.addBankAccount(accountNumber,accountName,bankName);

	try{
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
		await bankSetupPage.editBankAccount(bankName);
        await t
            //5. Edit Bank Account
            .click(bankAccountModal.bankNameInput)
            .pressKey('ctrl+a delete') 
            .typeText(bankAccountModal.bankNameInput,`AABAE${uniqueId}`,paste)  
            .click(bankAccountModal.saveButton);
            //6. Delete Bank Account
        await apiHandler.deleteBankAccount(bankAccountNew.bank_account_id);
    } 
    catch (err){
        await apiHandler.deleteBankAccount(bankAccountNew.bank_account_id);
        throw err;
    }     
});