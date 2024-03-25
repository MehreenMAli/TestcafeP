import { Selector } from 'testcafe';
import { byID, getMenu, paste, checkRequests, logger, clickable } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from '../../../hooks';
import users from '../../../users';
import config from '../../../config';
import Page from '../../../page-models/page';
import BankSetupPage from '../../../page-models/epay/bankSetupPage.js';
import BankAccountModal from '../../../page-models/epay/bankAccountModal.js';
import InfoModal from '../../../page-models/infoModal.js';
import APIHandler from '../../../utils/apiHandler';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';

process.removeAllListeners('unhandledRejection');

const localizator = new Localizator();
const args = parseArguments();
const page = new Page();
const apiHandler = new APIHandler();
const category = {
	id: 63000,
	name: "Cor360 Payments"
};

let ePayFixture = fixture`Level 1 - ePayment - Bank Setup - Running on "${args.env.toUpperCase()}"`
    .page(config[args.env].baseUrl)
    .requestHooks(logger)
    .before(async ctx  => {
        await before();
        let apps = await apiHandler.getApps(); 
        let application = apps.find(element => element['application_id'] === 63000);
        ctx.apps = apps;
        ctx.app = application.title; //ePayment
        ctx.menues = await apiHandler.getMenues(application.menu_param); 
        ctx.labels = await localizator.getLabelsAsJson('ui-bank-*');
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

test(`TC 25324: Add New Valid Bank Account`, async t => {
    let uniqueId = Date.now().toString();
    let menues = t.fixtureCtx.menues;
    let bankSetup = byID((getMenu(menues,204)).action_key);
    let bankSetupPage = new BankSetupPage();
    let bankAccountModal = new BankAccountModal();
    let today = new Date().getDate().toString();
    let day = Selector('div.btn-secondary').filter('div:not(.text-muted)').withText(today);
    let infoModal = new InfoModal();

    await t
        //2. Go to ePayment
        //3. Go to Bank Setup
        .click(bankSetup);
        //4. Click "Add New"
        await t.click(await clickable(bankSetupPage.addNewButton))
        //5. Add a unique Bank Name
        .typeText(bankAccountModal.bankNameInput,`BANK_${uniqueId}`,paste)
        //6. Add a unique Bank Account Name
        .typeText(bankAccountModal.bankAccountNameInput,`BANK_ACC_${uniqueId}`,paste)
        //7. Add a unique Account Number
        .typeText(bankAccountModal.accountNumberInput,uniqueId,paste)
        //8. Add a unique Routing Number
        .typeText(bankAccountModal.routingNumberInput,uniqueId.substring(0, 9),paste)
        //9. Add a unique GP Checkbook ID
        .typeText(bankAccountModal.gpCheckbookIdInput,uniqueId,paste)
        //10. Select USD as the currency
        .click(bankAccountModal.currencyDropdown)
        .click(bankAccountModal.currencyDropdownOptions.nth(0))
        //11. Select "Today" as the effective date
        .click(bankAccountModal.datePicker)
        .click(day)
        //12. Add a unique Description
        .typeText(bankAccountModal.description,`DESCRIPTION_${uniqueId}`,paste)
        //13. Click "Save" button
        .click(bankAccountModal.saveButton)
        .click(infoModal.closeButton)
        .wait(5000);
    try{
        //14. Check the table
        await bankSetupPage.editBankAccount(`BANK_${uniqueId}`);
        await t
            //15. Edit the Bank Account
            .expect(bankAccountModal.bankNameInput.value).eql(`BANK_${uniqueId}`)
            .expect(bankAccountModal.bankAccountNameInput.value).eql(`BANK_ACC_${uniqueId}`)
            .expect(bankAccountModal.accountNumberInput.value).eql(uniqueId)
            .expect(bankAccountModal.routingNumberInput.value).eql(uniqueId.substring(0, 9))
            .expect(bankAccountModal.gpCheckbookIdInput.value).eql(uniqueId)
            .click(bankAccountModal.cancelButton);
            //16. Delete Bank Account
        let allBankAccount = await apiHandler.getAllBankAccount();
        let bankAccount = await bankSetupPage.getIdBankAccount(`BANK_${uniqueId}`, allBankAccount)
        await apiHandler.deleteBankAccount(bankAccount);
    } 
    catch (err){
        let allBankAccount = await apiHandler.getAllBankAccount();
        let bankAccount = await bankSetupPage.getIdBankAccount(`BANK_${uniqueId}`, allBankAccount)
        await apiHandler.deleteBankAccount(bankAccount);
        throw err;
    }   
    
});

test(`TC 26935: Bank Account Edition`, async t => {
    let uniqueId = Date.now().toString();
    let menues = t.fixtureCtx.menues;
    let bankSetup = byID((getMenu(menues,204)).action_key);
    let bankSetupPage = new BankSetupPage();
    let bankAccountModal = new BankAccountModal();
    let labels = t.fixtureCtx.labels;
    
    let accountName = `BANK_ACC_${uniqueId}`;
    let bankName = `BANK_${uniqueId}`;
    let accountNumber = `BANKN_${uniqueId}`;
    let bankAccountNew = await apiHandler.addBankAccount(accountNumber,accountName,bankName);
    try{
        await t
            //2. Go to ePayment
            //3. Go to Bank Setup
            .click(bankSetup);
        await clickable(bankSetupPage.addNewButton);
            //4. Click "Edit"
        await bankSetupPage.editBankAccount(bankName);
            //5. Active bank Account
        await t
            .expect(bankAccountModal.bankNameInput.value).eql(bankName)
            .click(bankAccountModal.deactivateButton)
            .click(bankAccountModal.modalConfirm.find('button').nth(1));
        await bankSetupPage.editBankAccount(bankName);
            //6. Check if was active
        await t
            .expect(bankAccountModal.bankNameInput.value).eql(bankName)
            .expect(bankAccountModal.deactivateButton.withText(labels['ui-bank-012']).exists).ok('The "Deactivate" button should exist')
            //7. Edit Bank Account
            .click(bankAccountModal.bankNameInput)
            .pressKey('ctrl+a delete') 
            .typeText(bankAccountModal.bankNameInput,`BANKE_${uniqueId}`,paste)  
            .click(bankAccountModal.saveButton);
            //8. Check the table
        await bankSetupPage.editBankAccount(`BANKE_${uniqueId}`);
            //9. Delete Bank Account
        await apiHandler.deleteBankAccount(bankAccountNew.bank_account_id);
    } 
    catch (err){
        await apiHandler.deleteBankAccount(bankAccountNew.bank_account_id);
        throw err;
    }     
});


test(`TC 27384: Duplicate Bank Account`, async t => {
    let uniqueId = Date.now().toString();
    let menues = t.fixtureCtx.menues;
    let bankSetup = byID((getMenu(menues,204)).action_key);
    let bankSetupPage = new BankSetupPage();
    let bankAccountModal = new BankAccountModal();
    let today = new Date().getDate().toString();
    let day = Selector('div.btn-secondary').filter('div:not(.text-muted)').withText(today);
    let infoModal = new InfoModal();

    await t
        //2. Go to ePayment
        //3. Go to Bank Setup
        .click(bankSetup);
        //4. Click "Add New"
        await t
        .click(await clickable(bankSetupPage.addNewButton))
        //5. Add a new Bank Account
        .typeText(bankAccountModal.bankNameInput,`BANK_${uniqueId}`,paste)
        .typeText(bankAccountModal.bankAccountNameInput,`BANK_ACC_${uniqueId}`,paste)
        .typeText(bankAccountModal.accountNumberInput,uniqueId,paste)
        .typeText(bankAccountModal.routingNumberInput,uniqueId.substring(0, 9),paste)
        .typeText(bankAccountModal.gpCheckbookIdInput,uniqueId,paste)
        .click(bankAccountModal.currencyDropdown)
        .click(bankAccountModal.currencyDropdownOptions.nth(0))
        .click(bankAccountModal.datePicker)
        .click(day)
        .typeText(bankAccountModal.description,`DESCRIPTION_${uniqueId}`,paste)
        .click(bankAccountModal.saveButton)
        .click(infoModal.closeButton)
        .wait(5000)
        //6. Duplicate Bank Account
        .click(await clickable(bankSetupPage.addNewButton))
        .typeText(bankAccountModal.bankNameInput,`BANK_${uniqueId}`,paste)
        .typeText(bankAccountModal.bankAccountNameInput,`BANK_ACC_${uniqueId}`,paste)
        .typeText(bankAccountModal.accountNumberInput,uniqueId,paste)
        .typeText(bankAccountModal.routingNumberInput,uniqueId.substring(0, 9),paste)
        .typeText(bankAccountModal.gpCheckbookIdInput,uniqueId,paste)
        .click(bankAccountModal.currencyDropdown)
        .click(bankAccountModal.currencyDropdownOptions.nth(0))
        .click(bankAccountModal.datePicker)
        .click(day)
        .typeText(bankAccountModal.description,`DESCRIPTION_${uniqueId}`,paste)
        .click(bankAccountModal.saveButton)
        .click(infoModal.closeButton)
        .wait(5000);
    try{
        //16. Delete Bank Account
        let allBankAccount = await apiHandler.getAllBankAccount();
        let bankAccount = await bankSetupPage.getIdBankAccount(`BANK_${uniqueId}`, allBankAccount)
        await apiHandler.deleteBankAccount(bankAccount);
    } 
    catch (err){
        let allBankAccount = await apiHandler.getAllBankAccount();
        let bankAccount = await bankSetupPage.getIdBankAccount(`BANK_${uniqueId}`, allBankAccount)
        await apiHandler.deleteBankAccount(bankAccount);
        throw err;
    }   
    
});