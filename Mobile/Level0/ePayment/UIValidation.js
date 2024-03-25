import { Selector } from 'testcafe';
import { byID, checkLabels, timeout, getMenu, insensitive, checkRequests, logger , longTimeout } from './../../../utils/helperFunctions';
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

process.removeAllListeners('unhandledRejection');

const localizator = new Localizator();
const dashboardTitles = Selector('div[class=title]');
const apiHandler = new APIHandler();
const page = new MobilePage();
const headerPage = new HeaderPage();
const sideBarPage = new SideBarPage();

const clientsPage = new ClientsPage();
const spinner = Selector('#fountainTextG > img');
const args = parseArguments();
const category = {
	id: 63000,
	name: "Cor360 Payments"
};

let ePayFixture = fixture`Mobile - Level 0 - ePayments - UI Validations - Running on "${args.env.toUpperCase()}"`
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
	
test(`TC 25105: Mobile 'Payments' page`, async t => {
	let labels = t.fixtureCtx.labels;
	let paymentsMobilePage = new PaymentsMobilePage();
	let pendingHeaders = [	labels['ui-pay-005'],
							labels['ui-pay-046'],
							labels['ui-pay-011']];
	let processedHeaders = [ labels['ui-pay-004'],
							 labels['ui-pay-005'],
							 labels['ui-pay-010'],
							 labels['ui-pay-020']];
	let processedDetailHeaders = [ 	labels['ui-pay-004'],
									labels['ui-pay-036'],
									labels['ui-pay-037'],
									labels['ui-pay-046'],
									labels['ui-pay-020']];

	await t
		//2. Go to ePayment - The ePayment page is displayed
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Check breadcrumb - The "Payments" title is present
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-pay-000'],'The "Page Title" was wrong', timeout)
		//4. Check the tabs dropdown
		.expect(paymentsMobilePage.tabsDropdown.exists).ok('The "Tabs Dropdown" button should exist')
		.wait(2000);
	await t
		.expect(paymentsMobilePage.companiesDropdown.exists).ok('The "Companies" dropdown should exist', timeout)
		.expect(paymentsMobilePage.searchCheckInput.exists).ok('The "Search by Check" input should exist')
		.expect(paymentsMobilePage.tabsDropdownItems.withText(labels['ui-pay-002']).exists).ok('The "Pending" dropdown option should exist')
		.expect(paymentsMobilePage.tabsDropdownItems.withText(labels['ui-pay-003']).exists).ok('The "Processed" dropdown option should exist')
		//5. Check buttons - "Released" button is present
		.expect(paymentsMobilePage.releaseButton.exists).ok('The "Release" button should exist')
		//6. Check table header elements 
		.expect(paymentsMobilePage.pendingTable.exists).ok('The "Pending" table should exist');
		//7. Check Labels - Headers
	await t.expect(await checkLabels(paymentsMobilePage.pendingTableHeaders,pendingHeaders)).ok('The "Headers Pending" table should exist');
	await t	
		//8. Select Processed Tab
		.click(paymentsMobilePage.tabsDropdown)
		.click(paymentsMobilePage.tabsDropdownItems.nth(1))
		.expect(paymentsMobilePage.processedTable.exists).ok('The "Processed" table should exist');
	await t.expect(await checkLabels(paymentsMobilePage.processedTableHeaders,processedHeaders)).ok('The "Headers Detail" table should exist');
	await t	
		//9. Select Processed Detail Tab
		.click(paymentsMobilePage.tabsDropdown)
		.click(paymentsMobilePage.tabsDropdownItems.nth(2))
		.expect(paymentsMobilePage.processedDetailTable.exists).ok('The "Processed Detail" table should exist')
	await t.expect(await checkLabels(paymentsMobilePage.processedDetailTable,processedDetailHeaders)).ok('The "Headers Processed Detail" table should exist');
	//10. Check details
	await t	
		.click(paymentsMobilePage.tabsDropdown)
		.click(paymentsMobilePage.tabsDropdownItems.nth(0));
	if(await paymentsMobilePage.tablePendingRow.exists){
		await t		
			.click(paymentsMobilePage.tablePendingRow)
			.expect(paymentsMobilePage.titleDetail.withText('Payment detail').exists).ok('The "Payment detail" subtitule should exist')
			.expect(paymentsMobilePage.returnDetail.exists).ok('The "Return" icon should exist')
			.expect(paymentsMobilePage.tableDetail.exists).ok('The "Detail" table should exist');
	}
		
	
});

test(`TC 25107: Mobile 'Payment Accounts' page`, async t => {
	let paymentAccount = (getMenu(t.fixtureCtx.menues,203)).title;
	let paymentAccountsPage = new PaymentAccountsPage();
	let paymentAccountModal = new PaymentAccountModal();

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
		.expect(paymentAccountsPage.editButton.exists).ok('The "Edit" button should exist')
		.expect(paymentAccountsPage.addNewButton.exists).ok('The "Add New" button should exist')
		.expect(paymentAccountsPage.deleteButton.exists).ok('The "Delete" button should exist')
		//7. Click in Edit button - Edit form is displayed
		.click(paymentAccountsPage.editButton)
		//8. Check fields in edit form - "Account Name", "Input Directory", "Output Directory" and "Prenote" inputs
		.expect(paymentAccountModal.accountNameInput.exists).ok('The "Account Name" input should exist in the Payment Modal')
		.expect(paymentAccountModal.inputDirectoryInput.exists).ok('The "Input Directory" input should exist in the Payment Modal')
		.expect(paymentAccountModal.outputDirectoryInput.exists).ok('The "Output Directory" input should exist in the Payment Modal')
		.expect(paymentAccountModal.prenoteDirectoryInput.exists).ok('The "Prenote Directory" input should exist in the Payment Modal')
		//9. Check Save and Cancel buttons are present in edit form - Save and Cancel buttons are present
		.expect(paymentAccountModal.saveButton.exists).ok('The "Save" button should exist in the Payment Modal')
		.expect(paymentAccountModal.cancelButton.exists).ok('The "Cancel" button should exist in the Payment Modal')
		//10. Click Cancel - Edit form closes
		.click(paymentAccountModal.cancelButton)
		//11. Click in Add New button - Add New form is displayed
		.click(paymentAccountsPage.addNewButton)
		//12. Check Fields - The Fields are the same as the Edit Form
		.expect(paymentAccountModal.accountNameInput.exists).ok('The "Account Name" input should exist in the Payment Modal')
		.expect(paymentAccountModal.inputDirectoryInput.exists).ok('The "Input Directory" input should exist in the Payment Modal')
		.expect(paymentAccountModal.outputDirectoryInput.exists).ok('The "Output Directory" input should exist in the Payment Modal')
		.expect(paymentAccountModal.prenoteDirectoryInput.exists).ok('The "Prenote Directory" input should exist in the Payment Modal')
		//13. Check Save and Cancel buttons are present in Add new form - Save and Cancel buttons are present
		.expect(paymentAccountModal.saveButton.exists).ok('The "Save" button should exist in the Payment Modal')
		.expect(paymentAccountModal.cancelButton.exists).ok('The "Cancel" button should exist in the Payment Modal')
		//14. Click Cancel - Add New form closes
		.click(paymentAccountModal.cancelButton);
});

test(`TC 25111: Mobile 'Clients' page`, async t => {
	let clients = (getMenu(t.fixtureCtx.menues,202)).title;
	let clientsPage = new ClientsPage();
	let newClientModal = new NewClientModal();
	let labels = t.fixtureCtx.labels;
	let headers = [	labels['ui-cte-013'],
					labels['ui-cte-014'],
					labels['ui-cte-015'],
					labels['ui-cte-016'],
					labels['ui-cte-017'],
					labels['ui-cte-022'],
					labels['ui-cte-023'],
					labels['ui-cte-028']];

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
	//7. Check client table and headers
	.expect(clientsPage.clientsTable.exists).ok('The "Client" table should exist')
	.expect(await checkLabels(clientsPage.clientsTable.headers,headers)).ok()
	//8. Click on Add Client Button
	.click(clientsPage.addClientButton)
	//9. Check Modal of Client
	.expect(newClientModal.accountNameInput.exists).ok('The "Account Name" input should exist',timeout)
	.expect(newClientModal.customerNameInput.exists).ok('The "Customer Name" input should exist')
	.expect(newClientModal.gpVendorIdInput.exists).ok('The "GP Vendor ID" input should exist')
	.expect(newClientModal.clientNotifyEmailInput.exists).ok('The "Client Notify Email" input should exist')
	.expect(newClientModal.routingInput.exists).ok('The "Routing" input should exist')
	.expect(newClientModal.bankAccountInput.exists).ok('The "Bank Account" input should exist')
	.expect(newClientModal.urlInput.exists).ok('The "URL" input should exist')
	.expect(newClientModal.testCheckbox.exists).ok('The "Test" checkbox should exist')
	.expect(newClientModal.suppressNachaCheckbox.exists).ok('The "Suppress Nacha" checkbox should exist')
	.expect(newClientModal.autoReleaseCheckbox.exists).ok('The "Auto Release" checkbox should exist')
	.expect(newClientModal.currencyTypeDropdown.exists).ok('The "Currency Type" dropdown should exist')
	.expect(newClientModal.paymentPartnerDropdown.exists).ok('The "Payment Partner" dropdown should exist')
	.expect(newClientModal.paymentFilenameInput.exists).ok('The "Payment Filename" input should exist')
	.expect(newClientModal.clientCodeInput.exists).ok('The "Client Code" input should exist')
	.expect(newClientModal.clientCheckStringInput.exists).ok('The "Client Check String" input should exist')
	.expect(newClientModal.corBankAccountDropdown.exists).ok('The "Cor Bank Account" dropdown should exist')
	.expect(newClientModal.saveButton.exists).ok('The "Save" button should exist')
	.expect(newClientModal.closeButton.exists).ok('The "Close" button should exist')
	.click(newClientModal.closeButton);
});

test(`TC 27197: Mobile - UI Validation - Bank Setup`, async t => {
	let bankSetupPage = new BankSetupPage();
	let bankAccountModal = new BankAccountModal();
	let labels = t.fixtureCtx.labels;
	let bank = (getMenu(t.fixtureCtx.menues,204)).title;
	let requiredField = labels['msg-00-002'];
	let auditTrail = labels['ui-bank-016'];
	let headers = [	labels['ui-bank-002'],
					labels['ui-bank-003'], 
					labels['ui-bank-004'], 
					labels['ui-bank-005'], 
					labels['ui-bank-006'], 
					labels['ui-bank-015']
	];
	
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
		//7. Check the modal elements
		.expect(bankSetupPage.cancelButton.exists).ok('The "Cancel" button should exist')
		//8. Click on save Button
		.click(bankSetupPage.addNewButton)
        .expect(bankAccountModal.bankNameInput.exists).ok('The "Bank Name" input should exist',longTimeout)
        .expect(bankAccountModal.bankAccountNameInput.exists).ok('The "Bank Account Name" input should exist')
        .expect(bankAccountModal.accountNumberInput.exists).ok('The "Account Number" input should exist')
        .expect(bankAccountModal.routingNumberInput.exists).ok('The "Routing Number" input should exist')
        .expect(bankAccountModal.gpCheckbookIdInput.exists).ok('The "GP Checkbook ID" input should exist')
        .expect(bankAccountModal.currencyDropdown.exists).ok('The "Currency" dropdown should exist')
        .expect(bankAccountModal.datePicker.exists).ok('The "Effective Date" datepicker should exist')
        .expect(bankAccountModal.description.exists).ok('The "Description" textarea should exist')
        .expect(bankAccountModal.saveButton.exists).ok('The "Save" button should exist')
        .expect(bankAccountModal.deactivateButton.exists).ok('The "Deactivate" button should exist')
		.expect(bankAccountModal.cancelButton.exists).ok('The "Cancel" button should exist')
		//9. Click "Save" button on Modal
		.click(bankAccountModal.saveButton)
		//10. Check errors
		.expect(bankAccountModal.bankNameInput.error.innerText).contains(requiredField,'Should display "Required field"')
        .expect(bankAccountModal.bankAccountNameInput.error.innerText).contains(requiredField,'Should display "Required field"')
        .expect(bankAccountModal.accountNumberInput.error.innerText).contains(requiredField,'Should display "Required field"')
        .expect(bankAccountModal.routingNumberInput.error.innerText).contains(requiredField,'Should display "Required field"')
        .expect(bankAccountModal.gpCheckbookIdInput.error.innerText).contains(requiredField,'Should display "Required field"')
        .expect(bankAccountModal.datePicker.error.innerText).contains(requiredField,'Should display "Required field"')
		//11. Click the "Cancel" button on Modal
		.click(bankAccountModal.cancelButton)
		.expect(bankSetupPage.table.exists).ok('The table grid should exist')
		 //12. If the Table has elements, click on the first "Audit Trail" icon
		 if (await bankSetupPage.table.hasData())
		 {
		 await t
			 .click(bankSetupPage.firstAuditIcon)
			 .expect(bankAccountModal.modalInfoEdit.visible).notOk('The "Info" modal should not exist')
			 .expect(bankAccountModal.modalTitle.innerText).contains(auditTrail,'Should display "Audit Trail"')
			 //13. Close the modal
			 .click(bankAccountModal.cancelAuditTrailButton);
		 }
		await t
			//14. Click on "Cancel" Button
			.click(bankSetupPage.cancelButton)
			//15. Check close "Bank Setup" page
			.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-pay-000'],'The "Page Title" was wrong', timeout)
		
});

test(`TC 27558: Check hamb menu navigation on Cor360 Payments`, async t => {
    let paymentsMenu = (getMenu(t.fixtureCtx.menues,201)).title;
    let clientsMenu = (getMenu(t.fixtureCtx.menues,202)).title;
    let paymentsAccountsMenu = (getMenu(t.fixtureCtx.menues,203)).title;
    let bankSetupMenu = (getMenu(t.fixtureCtx.menues,204)).title;

    await t
		// Default payments page verifications
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		.expect(page.title.innerText).eql(paymentsMenu,'The page title was wrong')
		//Clients page verifications
		.click(headerPage.navBarToggler)
		.expect(sideBarPage.items.withText(paymentsMenu).exists).ok('The sideBarMenu item should exist')
		.expect(sideBarPage.items.withText(clientsMenu).exists).ok('The sideBarMenu item should exist')
		.expect(sideBarPage.items.withText(paymentsAccountsMenu).exists).ok('The sideBarMenu item should exist')
		.expect(sideBarPage.items.withText(bankSetupMenu).exists).ok('The sideBarMenu item should exist')
		.click(sideBarPage.items.withText(clientsMenu))
		.expect(page.title.innerText).eql(clientsMenu,'The page title was wrong')
		//Payment Accounts page verifications
		.click(headerPage.navBarToggler)
		.expect(sideBarPage.items.withText(paymentsMenu).exists).ok('The sideBarMenu item should exist')
		.expect(sideBarPage.items.withText(clientsMenu).exists).ok('The sideBarMenu item should exist')
		.expect(sideBarPage.items.withText(paymentsAccountsMenu).exists).ok('The sideBarMenu item should exist')
		.expect(sideBarPage.items.withText(bankSetupMenu).exists).ok('The sideBarMenu item should exist')
		.click(sideBarPage.items.withText(paymentsAccountsMenu))
		.expect(page.title.innerText).eql(paymentsAccountsMenu,'The page title was wrong')
		//Bank Setup page verifications
		.click(headerPage.navBarToggler)
		.expect(sideBarPage.items.withText(paymentsMenu).exists).ok('The sideBarMenu item should exist')
		.expect(sideBarPage.items.withText(clientsMenu).exists).ok('The sideBarMenu item should exist')
		.expect(sideBarPage.items.withText(paymentsAccountsMenu).exists).ok('The sideBarMenu item should exist')
		.expect(sideBarPage.items.withText(bankSetupMenu).exists).ok('The sideBarMenu item should exist')
		.click(sideBarPage.items.withText(bankSetupMenu))
		.expect(page.title.innerText).eql(bankSetupMenu,'The page title was wrong')
		//Payment page navigation verification
		.click(headerPage.navBarToggler)
		.expect(sideBarPage.items.withText(paymentsMenu).exists).ok('The sideBarMenu item should exist')
		.expect(sideBarPage.items.withText(clientsMenu).exists).ok('The sideBarMenu item should exist')
		.expect(sideBarPage.items.withText(paymentsAccountsMenu).exists).ok('The sideBarMenu item should exist')
		.expect(sideBarPage.items.withText(bankSetupMenu).exists).ok('The sideBarMenu item should exist')
		.click(sideBarPage.items.withText(paymentsMenu))
		.expect(page.title.innerText).eql(paymentsMenu,'The page title was wrong');
});