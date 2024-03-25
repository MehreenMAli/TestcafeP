import { Selector } from 'testcafe';
import { byID, paste, getMenu, timeout, insensitive, checkRequests, logger } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from '../../../hooks';
import users from '../../../users';
import config from '../../../config';
import Page from './../../../page-models/page';
import PaymentAccountsPage from '../../../page-models/epay/paymentAccountsPage';
import PaymentAccountModal from '../../../page-models/epay/paymentAccountModal';
import APIHandler from '../../../utils/apiHandler';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';

const localizator = new Localizator();
const dashboardTitles = Selector('div[class=title]');
const args = parseArguments();
const page = new Page();
const paymentAccountsPage = new PaymentAccountsPage();
const paymentAccountModal = new PaymentAccountModal();
const uniqueId = Date.now().toString();
const apiHandler = new APIHandler();
const category = {
	id: 63000,
	name: "Cor360 Payments"
};

let ePayFixture = fixture`Level 1 - ePayment - PaymentAccounts - Running on "${args.env.toUpperCase()}"`
    .page(config[args.env].baseUrl)
    .requestHooks(logger)
    .before(async ctx  => {
        await before();
        let apps = await apiHandler.getApps(); 
        let application = apps.find(element => element['application_id'] === 63000);
        ctx.apps = apps;
        ctx.app = application.title; //ePayment
        ctx.menues = await apiHandler.getMenues(application.menu_param); 
        ctx.labels = await localizator.getLabelsAsJson('ui-pac-000,msg-00-002');
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

test(`TC 24226: Add New Payment Account - Required Fields error messages`, async t => {
    let menues = t.fixtureCtx.menues;
    let paymentAccount = byID((getMenu(menues,203)).action_key);
    let requiredField = t.fixtureCtx.labels['msg-00-002'];

    await t
        //2. Go to ePayment
        //3. Click on Payment Accounts in the left menu
        .click(paymentAccount)
        .expect(page.title.innerText).match(insensitive(t.fixtureCtx.labels['ui-pac-000']),'The "Page Title" was wrong',timeout)
        //4. Click on Add New button
        .click(paymentAccountsPage.addNewButton)
        //5. Click on Save button
        .click(paymentAccountModal.saveButton)
        //6. Check error messages
        .expect(paymentAccountModal.accountNameInput.error.innerText).contains(requiredField)
        //7. Click cancel button
        .click(paymentAccountModal.cancelButton);
});

test(`TC 24858: Add New Valid Payment Account`, async t => {
    let menues = t.fixtureCtx.menues;
    let paymentAccount = byID((getMenu(menues,203)).action_key);
    let accountName = `24858PayAcc_${uniqueId}`;
    let inputDirectory = `\\\\input_test`;
    let outputDirectory = `\\\\output_test`;
    let prenoteDirectory = `T:\\test\\`;

    await t
        //2. Go to ePayment
        //3. Click on Payment Accounts in the left menu
        .click(paymentAccount)
        .expect(page.title.innerText).match(insensitive(t.fixtureCtx.labels['ui-pac-000']))
        //4. Click on Add New button
        .click(paymentAccountsPage.addNewButton)
        //5. Insert the values in the fields
        .typeText(paymentAccountModal.accountNameInput,accountName,paste)
        .typeText(paymentAccountModal.inputDirectoryInput,inputDirectory,paste)
        .typeText(paymentAccountModal.outputDirectoryInput,outputDirectory,paste)
        .typeText(paymentAccountModal.prenoteDirectoryInput,prenoteDirectory,paste)
        //6. Click the Save button
        .click(paymentAccountModal.saveButton)
        //7. Search in the Payment Accounts dropdown for the added account
        .click(paymentAccountsPage.accountsDropdown)
        .expect(paymentAccountsPage.accountsDropdownOptions.withText(accountName).exists).ok('The recently created Payment account should be displayed on the Dropdown')
        //8. Edit the Recently Created Payment Account and check its values
        .click(paymentAccountsPage.accountsDropdownOptions.withText(accountName))
        .click(paymentAccountsPage.editButton)
        .expect(paymentAccountModal.accountNameInput.value).eql(accountName)
        .expect(paymentAccountModal.inputDirectoryInput.value).eql(inputDirectory)
        .expect(paymentAccountModal.outputDirectoryInput.value).eql(outputDirectory)
        .expect(paymentAccountModal.prenoteDirectoryInput.value).eql(prenoteDirectory)
        .click(paymentAccountModal.cancelButton)
        //9. Delete the Recently Created Payment Account
        .click(paymentAccountsPage.accountsDropdown)
        .click(paymentAccountsPage.accountsDropdownOptions.withText(accountName))
        .click(paymentAccountsPage.deleteButton)
        .click(paymentAccountsPage.cancelModal)
        .click(paymentAccountsPage.deleteButton)
        .click(paymentAccountsPage.deleteModal)
        //10. Verify it is successfully deleted
        .click(paymentAccountsPage.accountsDropdown)
        .expect(paymentAccountsPage.accountsDropdownOptions.withText(accountName).exists).notOk('The recently created Payment account should NOT be displayed on the Dropdown')
        .click(paymentAccountsPage.accountsDropdown);
});


test(`TC 26967: Payment Accounts Edition`, async t => {
    let menues = t.fixtureCtx.menues;
    let paymentAccount = byID((getMenu(menues,203)).action_key);
    let accountName = `26967PayAcc_${uniqueId}`;
    let inputDirectory = `\\\\input_test`;
    let outputDirectory = `\\\\output_test`;
    let prenoteDirectory = `T:\\test\\`;

    let accountNameEdit = `26967PayAccEdit_${uniqueId}`;

    let paymentAccountNew = await apiHandler.addPaymentAccount(accountName,inputDirectory,outputDirectory,prenoteDirectory);
    try{
        await t
        //2. Go to ePayment
        //3. Click on Payment Accounts in the left menu
        .click(paymentAccount)
        .expect(page.title.innerText).match(insensitive(t.fixtureCtx.labels['ui-pac-000']))
        .wait(2000)
        //4. Select and change info in Payment Accounts for Edit
        .click(paymentAccountsPage.accountsDropdown)
        .click(paymentAccountsPage.accountsDropdownOptions.withText(paymentAccountNew.payment_account_name))
        .click(paymentAccountsPage.editButton)
        .click(paymentAccountModal.accountNameInput)
        .pressKey('ctrl+a delete')
        .typeText(paymentAccountModal.accountNameInput,accountNameEdit,paste)
        .click(paymentAccountModal.saveButton)
        // 5. Check Payment Accounts edition
        .click(paymentAccountsPage.accountsDropdown)
        .expect(paymentAccountsPage.accountsDropdownOptions.withText(accountNameEdit).exists).ok('The recently edited Payment account should be displayed on the Dropdown')    
        // 6. Delete Payment Account New
        await apiHandler.deletePaymentAccount(paymentAccountNew.payment_account_id);
    }
    catch (err){
        await apiHandler.deletePaymentAccount(paymentAccountNew.payment_account_id);
        throw err;
    }
});