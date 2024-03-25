import { Selector } from 'testcafe';
import { byID, checkLabels, timeout, getMenu, insensitive, checkRequests, logger } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import Page from './../../../page-models/page';
import Pagination from './../../../page-models/pagination';
import ClientsPage from './../../../page-models/epay/clientsPage';
import NewClientModal from './../../../page-models/epay/newClientModal';
import PaymentAccountsPage from './../../../page-models/epay/paymentAccountsPage';
import PaymentAccountModal from './../../../page-models/epay/paymentAccountModal';
import PaymentsPage from './../../../page-models/epay/paymentsPage';
import BankSetupPage from '../../../page-models/epay/bankSetupPage';
import BankAccountModal from '../../../page-models/epay/bankAccountModal';
import HeaderPage from '../../../page-models/headerPage';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';

process.removeAllListeners('unhandledRejection');

const localizator = new Localizator();
const apiHandler = new APIHandler();
const page = new Page();
const clientsPage = new ClientsPage();
const spinner = Selector('#fountainTextG > img');
const args = parseArguments();
const category = {
	id: 63000,
	name: "Cor360 Payments"
};

let ePayFixture = fixture`Level 0 - ePayments - UI Validations - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before( async ctx  => {
		await before();
		let apps = await apiHandler.getApps(); 
		let application = apps.find(element => element['application_id'] === 63000);
		ctx.apps = apps;
		ctx.app = application.title; //ePayment
		ctx.menues = await apiHandler.getMenues(application.menu_param);
		ctx.labels = await localizator.getLabelsAsJson('ui-cte-0*,ui-pac-000,ui-pay-0*,ui-bank-000');
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

test(`TC 24139: 'Clients' Page`, async t => {
	let pagination = new Pagination();
	let menues = t.fixtureCtx.menues;
	let clientsMenu = getMenu(menues,202);
	let clientsMenuKey = clientsMenu.action_key;
	let clients = byID(clientsMenuKey);
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
		.expect(spinner.visible).notOk('Waiting for the Spinner to go',timeout)
		.expect(clients.exists).ok('The "Clients" menu should exist',timeout)
		.expect(clients.visible).ok('The "Clients" menu should be visible',timeout)
		.click(clients)
		.click(clients)
		.expect(spinner.visible).notOk('Waiting for the Spinner to go',timeout)
		.expect(page.title.innerText).match(insensitive(labels['ui-cte-000']),'The "Page Title" was wrong',timeout)
		.expect(await checkLabels(clientsPage.clientsTable.headers,headers)).ok();
});

test(`TC 24136: 'Add New Client' Form`, async t => {
	let newClientModal = new NewClientModal();
	let menues = t.fixtureCtx.menues;
	let clientsMenu = getMenu(menues,202);
	let clientsMenuKey = clientsMenu.action_key;
	let clients = byID(clientsMenuKey);
	let labels = t.fixtureCtx.labels;
	await t
		.expect(spinner.visible).notOk('Waiting for the Spinner to go',timeout)
		.expect(clients.exists).ok('The "Clients" menu should exist',timeout)
		.click(clients)
		.click(clients)
		.expect(spinner.visible).notOk('Waiting for the Spinner to go',timeout)
		.expect(page.title.innerText).match(insensitive(labels['ui-cte-000']),'The "Page Title" was wrong',timeout)
		.expect(clientsPage.addClientButton.exists).ok('The "Add Client" button should exist')
		.click(clientsPage.addClientButton)
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

test(`TC 24179: 'Payments Accounts' Page`, async t => {
	let paymentAccountsPage = new PaymentAccountsPage();
	let paymentAccountModal = new PaymentAccountModal();
	let menues = t.fixtureCtx.menues;
	let paymentAccountMenu = getMenu(menues,203);
	let paymentAccountMenuKey = paymentAccountMenu.action_key;
	let paymentAccount = byID(paymentAccountMenuKey);
	let labels = t.fixtureCtx.labels;
	
	await t
		.expect(spinner.visible).notOk('Waiting for the Spinner to go',timeout)
		.click(paymentAccount)
		.wait(2000)
		.expect(spinner.visible).notOk('Waiting for the Spinner to go',timeout)
		.expect(page.title.innerText).match(insensitive(labels['ui-pac-000']),'The "Page Title" was wrong',timeout)	
		.expect(paymentAccountsPage.accountsDropdown.exists).ok('The "Accounts" dropdown should exist')
		.expect(paymentAccountsPage.editButton.exists).ok('The "Edit" button should exist')
		.expect(paymentAccountsPage.addNewButton.exists).ok('The "Add New" button should exist')
		.expect(paymentAccountsPage.deleteButton.exists).ok('The "Delete" button should exist')
		.click(paymentAccountsPage.editButton)
		.expect(paymentAccountModal.accountNameInput.exists).ok('The "Account Name" input should exist in the Modal')
		.expect(paymentAccountModal.inputDirectoryInput.exists).ok('The "Input Directory" input should exist in the Modal')
		.expect(paymentAccountModal.outputDirectoryInput.exists).ok('The "Output Directory" input should exist in the Modal')
		.expect(paymentAccountModal.prenoteDirectoryInput.exists).ok('The "Prenote Directory" input should exist in the Modal')
		.expect(paymentAccountModal.saveButton.exists).ok('The "Save" button should exist in the Modal')
		.expect(paymentAccountModal.cancelButton.exists).ok('The "Cancel" button should exist in the Modal')
		.click(paymentAccountModal.cancelButton)
		.click(paymentAccountsPage.addNewButton)
		.expect(paymentAccountModal.accountNameInput.exists).ok('The "Account Name" input should exist in the Modal')
		.expect(paymentAccountModal.inputDirectoryInput.exists).ok('The "Input Directory" input should exist in the Modal')
		.expect(paymentAccountModal.outputDirectoryInput.exists).ok('The "Output Directory" input should exist in the Modal')
		.expect(paymentAccountModal.prenoteDirectoryInput.exists).ok('The "Prenote Directory" input should exist in the Modal')
		.expect(paymentAccountModal.saveButton.exists).ok('The "Save" button should exist in the Modal')
		.expect(paymentAccountModal.cancelButton.exists).ok('The "Cancel" button should exist in the Modal')
		.click(paymentAccountModal.cancelButton);
});

test(`TC 24181: 'Payments' Page`, async t => {
	let paymentsPage = new PaymentsPage();
	let headerPage = new HeaderPage();
	let pendingBatchStatus = await apiHandler.getPendingBatchStatus();
	let processedBatchStatus = await apiHandler.getProcessedBatchStatus();
	let processedPaymentStatus = await apiHandler.getProcessedPaymentStatus();
	let labels = t.fixtureCtx.labels;
	let pendingHeaders = [	labels['ui-pay-005'],
							labels['ui-pay-006'],
							labels['ui-pay-007'],
							labels['ui-pay-008'],
							labels['ui-pay-010'],
							labels['ui-pay-031']];
	let processedHeaders = [	labels['ui-pay-004'],
								labels['ui-pay-005'], 
								labels['ui-pay-006'], 
								labels['ui-pay-007'], 
								labels['ui-pay-010'], 
								labels['ui-pay-011'], 
								labels['ui-pay-012'],
								labels['ui-pay-018'],
								labels['ui-pay-019'],
								labels['ui-pay-020']];
	let processedDetailHeaders = [	labels['ui-pay-004'],
									labels['ui-pay-036'],
									labels['ui-pay-037'],
									labels['ui-pay-012'],
									labels['ui-pay-010'],
									labels['ui-pay-006'],
									labels['ui-pay-018'],
									labels['ui-pay-019'],
									labels['ui-pay-020']];		

	await t
		.expect(spinner.visible).notOk('Waiting for the Spinner to go',timeout)
		//2. Check the page title
		.expect(page.title.innerText).match(insensitive(labels['ui-pay-000']),'The "Page Title" was wrong',timeout)
		.click(headerPage.hambMenu)
		//3. Check tabs
		.expect(paymentsPage.pendingTab.exists).ok('The "Pending" tab should exist')
		.expect(paymentsPage.pendingTab.innerText).contains(labels['ui-pay-002'])
		.expect(paymentsPage.checkCompany.nth(2)).ok('The "Search by Check" input should exist')
		.expect(paymentsPage.processedTab.exists).ok('The "Processed Summary" tab should exist')
		.expect(paymentsPage.processedTab.innerText).contains(labels['ui-pay-003'])
		.expect(paymentsPage.processedDetailTab.exists).ok('The "Processed Detail" tab should exist')
		.expect(paymentsPage.processedDetailTab.innerText).contains(labels['ui-pay-021'])
		//4. Check buttons
		.expect(paymentsPage.releaseButton.exists).ok('The "Release" button should exist')
		//5. Check Companies Dropdown
		.expect(paymentsPage.companiesDropdown.exists).ok('The "Companies" dropdown should exist')
		//6. Check the table and its headers
		.expect(await checkLabels(paymentsPage.pendingTableHeaders,pendingHeaders)).ok()
		.expect(paymentsPage.pendingTable.exists).ok('The "Pending" table grid should exist')
		.expect(paymentsPage.pendingBatchDropdown.exists).ok('The "Batch Status" dropdown should exist')
		.click(paymentsPage.pendingBatchDropdown)
		.wait(500)
		.expect(await checkLabels(paymentsPage.pendingBatchDropdownOptions,pendingBatchStatus,'status_name')).ok()
		.click(paymentsPage.pendingBatchDropdown)
		//7. Check the filters
		.expect(paymentsPage.pendingNameInput.exists).ok('The "Trans. From/To" input should exist')
		.expect(paymentsPage.pendingStartInput.exists).ok('The "Start" range input should exist')
		.expect(paymentsPage.pendingEndInput.exists).ok('The "End" range input should exist')
		.expect(paymentsPage.pendingPaymentRangepicker.exists).ok('The "Payment Request" datepicker should exist')
		.expect(paymentsPage.pendingAchRangepicker.exists).ok('The "Ach Request" datepicker should exist')
		.expect(paymentsPage.pendingMinAmountInput.exists).ok('The min "Amount" input should exist')
		.expect(paymentsPage.pendingMaxAmountInput.exists).ok('The max "Amount" input should exist')
		.expect(paymentsPage.pendingResetButton.exists).ok('The "Reset" button should exist')
		//8. Click the "Processed Summary" tab
		.click(paymentsPage.processedTab)
		.wait(2000)
		.expect(paymentsPage.checkCompanyProcessed).ok('The "Search by Check" input on Processed tab should exist')
		//9. Check the table and its headers
		.expect(await checkLabels(paymentsPage.processedTableHeaders,processedHeaders)).ok('The header table should exist')
		.expect(paymentsPage.processedTable.exists).ok('The "Processed Summary" table grid should exist')
		.expect(paymentsPage.processedBatchDropdown.exists).ok('The "Processed Batch" dropdown should exist')
		.expect(paymentsPage.processedPaymentStatusDropdown.exists).ok('The "Processed Status" dropdown should exist')
		.click(paymentsPage.processedBatchDropdown)
		.wait(500)
		.expect(await checkLabels(paymentsPage.processedBatchDropdownOptions,processedBatchStatus,'status_name')).ok()
		.click(paymentsPage.processedBatchDropdown)
		.click(paymentsPage.processedPaymentStatusDropdown)
		.wait(500)
		.expect(await checkLabels(paymentsPage.processedPaymentStatusDropdownOptions,processedPaymentStatus,'payment_status_name')).ok()
		.click(paymentsPage.processedPaymentStatusDropdown)
		//10. Check the filters
		.expect(paymentsPage.processedTransDatepicker.exists).ok('The "Trans. Date" datepicker should exist')
		.expect(paymentsPage.processedTransInput.exists).ok('The "Trans. From/To" input should exist')
		.expect(paymentsPage.processedStartInput.exists).ok('The "Start" range input should exist')
		.expect(paymentsPage.processedEndInput.exists).ok('The "End" range input should exist')
		.expect(paymentsPage.processedPaymentDatepicker.exists).ok('The "Payment Request" datepicker should exist')
		.expect(paymentsPage.processedMinAmountInput.exists).ok('The "Amount" input should exist')
		.expect(paymentsPage.processedMaxAmountInput.exists).ok('The "Amount" input should exist')
		.expect(paymentsPage.processedPaymentTypeDropdown.exists).ok('The "Payment Type" dropdown should exist')
		.expect(paymentsPage.processedClearedDatepicker.exists).ok('The "Cleared Date" datepicker should exist')
		.expect(paymentsPage.processedClearedMinAmountInput.exists).ok('The "Clrd Amt" input should exist')
		.expect(paymentsPage.processedClearedMaxAmountInput.exists).ok('The "Clrd Amt" input should exist')
		.expect(paymentsPage.processedResetButton.exists).ok('The "Reset" button should exist')
		//11. Click the "Processed Detail" tab
		.click(paymentsPage.processedDetailTab)
		.wait(2000)
		.expect(paymentsPage.checkCompanyProcessedDetail).ok('The "Search by Check" input on Processed Detail tab should exist')
		//12. Check the table and its headers
		.expect(await checkLabels(paymentsPage.processedDetailTableHeaders,processedDetailHeaders)).ok()
		.expect(paymentsPage.processedDetailTable.exists).ok('The "Processed Detail" table grid should exist')
		.expect(paymentsPage.processedDetailPaymentDropdown.exists).ok('The "Processed Detail Payment" dropdown should exist')
		.click(paymentsPage.processedDetailPaymentDropdown)
		.wait(500)
		.expect(await checkLabels(paymentsPage.processedDetailPaymentDropdownOptions,processedPaymentStatus,'payment_status_name')).ok()
		.click(paymentsPage.processedDetailPaymentDropdown)
		//13. Check the filters
		.expect(paymentsPage.processedDetailTransDatepicker.exists).ok('The "Trans. Date" datepicker should exist')
		.expect(paymentsPage.processedDetailPayeeInput.exists).ok('The "Payee" input should exist')
		.expect(paymentsPage.processedDetailCustomerInput.exists).ok('The "Customer" input should exist')
		.expect(paymentsPage.processedDetailPaymentTypeDropdown).ok('The "Payment Type" dropdown should exist')
		.expect(paymentsPage.processedDetailMinAmountInput.exists).ok('The "Amount" input should exist')
		.expect(paymentsPage.processedDetailMaxAmountInput.exists).ok('The "Amount" input should exist')
		.expect(paymentsPage.processedDetailStartInput.exists).ok('The "Check Range" start input should exist')
		.expect(paymentsPage.processedDetailEndInput.exists).ok('The "Check Range" end input should exist')
		.expect(paymentsPage.processedDetailPaymentDropdown.exists).ok('The "Payment Status" dropdown should exist')
		.expect(paymentsPage.processedDetailClearedDatepicker.exists).ok('The "Cleared Date" datepicker should exist')
		.expect(paymentsPage.processedDetailClearedMinAmountInput.exists).ok('The "Clrd Amt" input should exist')
		.expect(paymentsPage.processedDetailClearedMaxAmountInput.exists).ok('The "Clrd Amt" input should exist')
		.expect(paymentsPage.processedDetailResetButton.exists).ok('The "Reset" button should exist');
		await t
			.expect(paymentsPage.processedDetailFilterFrom.value).notEql('', 'input is empty')
			.expect(paymentsPage.processedDetailFilterTo.value).notEql('', 'input is empty');			
});

test(`TC 25164: 'Bank Setup' Page`, async t => {
	let bankSetupPage = new BankSetupPage();
    let bankAccountModal = new BankAccountModal();
    let labels = await localizator.getLabelsAsJson('ui-bank-0*,msg-00-002')
	let menues = t.fixtureCtx.menues;
	let bankSetupMenu = getMenu(menues,204);
	let bankSetupKey = bankSetupMenu.action_key;
	let bankSetup = byID(bankSetupKey);
	let requiredField = labels['msg-00-002'];
	let auditTrail = labels['ui-bank-016'];
	let headers = [	labels['ui-bank-002'],
					labels['ui-bank-003'], 
					labels['ui-bank-004'], 
					labels['ui-bank-005'], 
					labels['ui-bank-006'], 
					labels['ui-bank-015']
	];

	//2. Go to ePayment 
	await t
		//3. Click on the "Bank Setup" item on the left
		.click(bankSetup)
		//4. Check the Page Title
		.expect(page.title.innerText).match(insensitive(labels['ui-bank-000']),'The "Page Title" was wrong',timeout)
		//5. Check the Page Elements
		.expect(bankSetupPage.table.exists).ok('The table grid should exist')
		.expect(await checkLabels(bankSetupPage.table.headers, headers)).ok()
		//6. Click the "Add New" button
		.expect(bankSetupPage.addNewButton.exists).ok('The "Add New" button should exist')
		//7. Check the modal elements
		.expect(bankSetupPage.cancelButton.exists).ok('The "Cancel" button should exist')
		.wait(2000)
		.click(bankSetupPage.addNewButton)
        .expect(bankAccountModal.bankNameInput.exists).ok('The "Bank Name" input should exist')
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
		//8. Click "Save" button
		.click(bankAccountModal.saveButton)
		//9. Check errors
		.expect(bankAccountModal.bankNameInput.error.innerText).contains(requiredField,'Should display "Required field"')
        .expect(bankAccountModal.bankAccountNameInput.error.innerText).contains(requiredField,'Should display "Required field"')
        .expect(bankAccountModal.accountNumberInput.error.innerText).contains(requiredField,'Should display "Required field"')
        .expect(bankAccountModal.routingNumberInput.error.innerText).contains(requiredField,'Should display "Required field"')
        .expect(bankAccountModal.gpCheckbookIdInput.error.innerText).contains(requiredField,'Should display "Required field"')
        .expect(bankAccountModal.datePicker.error.innerText).contains(requiredField,'Should display "Required field"')
		//10. Click the "Cancel" button
        .click(bankAccountModal.cancelButton)
        .wait(1000);
        //11. If the Table has elements, click on the first "Audit Trail" icon
		if (await bankSetupPage.table.hasData())
		{
        await t
			.click(bankSetupPage.firstAuditIcon)
			.expect(bankAccountModal.modalInfoEdit.visible).notOk('The "Info" modal should not exist')
			.expect(bankAccountModal.modalTitle.innerText).contains(auditTrail,'Should display "Audit Trail"')
			//12. Close the modal
			.click(bankAccountModal.cancelAuditTrailButton);
        }
});

test(`TC 27394: 'Check hamb menu navigation`, async t => {
	let labels = t.fixtureCtx.labels;

	let menues = t.fixtureCtx.menues;
	let bankSetupMenu = getMenu(menues,204);
	let bankSetupKey = bankSetupMenu.action_key;
	let bankSetup = byID(bankSetupKey);

	let paymentAccountMenu = getMenu(menues,203);
	let paymentAccountMenuKey = paymentAccountMenu.action_key;
	let paymentAccount = byID(paymentAccountMenuKey);

	let clientsMenu = getMenu(menues,202);
	let clientsMenuKey = clientsMenu.action_key;
	let clients = byID(clientsMenuKey);
	
	await t
		// Click on the "Bank Setup" item on the left
		.click(bankSetup)
		.expect(page.title.innerText).match(insensitive(labels['ui-bank-000']),'The "Page Title" was wrong',timeout)

		// Click on the "Payment Account" item on the left
		.click(paymentAccount)
		.expect(spinner.visible).notOk('Waiting for the Spinner to go',timeout)
		.expect(page.title.innerText).match(insensitive(labels['ui-pac-000']),'The "Page Title" was wrong',timeout)	

		// Click on the "Clients" item on the left
		.click(clients)
		.expect(spinner.visible).notOk('Waiting for the Spinner to go',timeout)
		.expect(page.title.innerText).match(insensitive(labels['ui-cte-000']),'The "Page Title" was wrong',timeout)
				
});
