import { timeout, paste, checkRequests, logger, byID, clickable, getByKey, getMenu } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import MobilePage from './../../../page-models/mobilePage';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import GLTablePage from '../../../page-models/portal/glTablePage';
import ConfirmModal from '../../../page-models/confirmModal';
import ShortError from '../../../error-types/shortError';
import { Selector } from 'testcafe';


process.removeAllListeners('unhandledRejection');

const localizator = new Localizator();
const apiHandler = new APIHandler();
const page = new MobilePage();
const dashboardTitles = Selector('div[class=title]');

const args = parseArguments();
const APP_ID = 120;
const category = {
	id: APP_ID,
	name: "Portal"
};

let portalFixture = fixture`Mobile - Level 1 - Portal - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before( async ctx  => {
		await before();
		let apps = await apiHandler.getApps(); 
		let application = apps.find(element => element['application_id'] === APP_ID);
		ctx.apps = apps;
		ctx.app = application.title; //Portal
        ctx.menues = await apiHandler.getMenues(application.menu_param);
        ctx.glTableMenu = getMenu(ctx.menues,12001);
		ctx.labels = await localizator.getLabelsAsJson('msg-00-0*,ui-gltable-0*');
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

loadFixture(users[args.user],category,portalFixture);

test(`TC 27227: Create a new Table - Mobile`, async t => {
    const glTablePage = new GLTablePage();
	let labels = t.fixtureCtx.labels;
    let customers = (await apiHandler.getAllCustomers()).items;
    let requiredFieldMessage = labels['msg-00-002'];
    let minLengthMessage = `${labels['msg-00-011']} 1`;
    const customerName = 'Corcentric';
    const tableName = '27227_TestTable';
	
    //2. Go to Portal
    await t
        .click(dashboardTitles.withText(t.fixtureCtx.app));
    //3. Select "Corcentric" customer
    await t
        .click(await clickable(glTablePage.customersDropdown))
		.click(glTablePage.dropdownOptions.withText(customerName))

	let corcentricCustomer = await getByKey(customers,'client_name',customerName);
    let customerTables = (await apiHandler.getCustomerTables(corcentricCustomer.client_id)).items;
    let tableIndex = customerTables.length;

    //4. Click "+Table" button
    await t
        .click(glTablePage.addTableButton)
    //Check elements.
        .expect(glTablePage.tableRows.nth(tableIndex).find('label').withText(labels['ui-gltable-005'])).ok('Table Name label is not present')
        .expect(glTablePage.tableNameInput.nth(tableIndex).exists).ok('The Table Name input icon should exist')
        .expect(glTablePage.arrowDownIcon.nth(tableIndex).exists).ok('The Angle Down icon should exist')
        .expect(glTablePage.trashIcon.nth(tableIndex).exists).ok('The trash icon should exist')

    //5. Click "Save" button
        .click(glTablePage.saveButton)
        .expect(glTablePage.tableNameInput.error.innerText).contains(requiredFieldMessage,'Required field error should be displayed on Table Name input')
    
    //6. Insert @TableName on Table Name input
        .typeText(glTablePage.tableNameInput.nth(tableIndex),tableName,paste)

    //7. Click angle-down icon
        .click(glTablePage.arrowDownIcon.nth(tableIndex))

    //8. Click "Save" button
        .click(glTablePage.saveButton)
        .expect(glTablePage.columnInput.error.innerText).contains(requiredFieldMessage,'Required field error should be displayed on Length input')
        .expect(glTablePage.columnLengthInput.error.innerText).contains(requiredFieldMessage,'Required field error should be displayed on Length input')
        .expect(glTablePage.columnLengthInput.error.innerText).contains(minLengthMessage,'Min length error should be displayed on Length input');
        
    //9. Complete first column with following information: 
        //"TestColumn0" name, "test column0" description, checked Key value and "10" length value
    const firstColumn = {
        name: 'Column0',
        description: 'test column0',
        key: true,
        length: '10'
    }
    await t
        .typeText(glTablePage.columnInput,firstColumn.name,paste)
        .typeText(glTablePage.columnDescriptionInput,firstColumn.description,paste)
        .click(glTablePage.columnKeyCheckbox)
        .typeText(glTablePage.columnLengthInput,firstColumn.length,paste)
    
    //10. Click "+" button and complete second column with following information: 
        //"TestColumn1" name, "test column1" description, unchecked Key value and "10" length value
        .click(glTablePage.columnPlusIcon);
    const secondColumn = {
        name: 'Column1',
        description: 'test column1',
        key: false,
        length: '10'
    }
    await t
        .typeText(glTablePage.columnInput.nth(1),secondColumn.name,paste)
        .typeText(glTablePage.columnDescriptionInput.nth(1),secondColumn.description,paste)
        .typeText(glTablePage.columnLengthInput.nth(1),secondColumn.length,paste)

    //11. Click "Save" button and close modal
        .click(glTablePage.saveButton);
    let confirmModal = new ConfirmModal();
    await t
        .expect(confirmModal.body.innerText).contains(labels['ui-gltable-018'],'Confirmation message was not displayed',timeout)
        .click(confirmModal.acceptButton);
    //Check saved table.
    customerTables = (await apiHandler.getCustomerTables(corcentricCustomer.client_id)).items;
    let testTable = customerTables.find(element => element.table_name === tableName);
    if(!testTable){
        throw new ShortError('Table was not correctly saved');
    }
    tableIndex = customerTables.indexOf(testTable);
    let testTableColumns =  (await apiHandler.getTableColumns(corcentricCustomer.client_id,testTable.table_id)).items;
    if( testTableColumns[0].column_name !== firstColumn.name || testTableColumns[0].column_description !== firstColumn.description
        || testTableColumns[0].column_key !== firstColumn.key || (testTableColumns[0].column_length).toString() !== firstColumn.length
        || testTableColumns[1].column_name !== secondColumn.name || testTableColumns[1].column_description !== secondColumn.description
        || testTableColumns[1].column_key !== secondColumn.key || (testTableColumns[1].column_length).toString() !== secondColumn.length )
        throw new ShortError('Columns were not correctly saved');
    await t
        .expect(glTablePage.tableNameInput.nth(tableIndex).value).contains(tableName,'New Table Name was not displayed',timeout)
        .click(glTablePage.arrowDownIcon.nth(tableIndex))
        .expect(glTablePage.columnInput.nth(0).value).contains(firstColumn.name,'First Column Name was not displayed',timeout)
        .expect(glTablePage.columnDescriptionInput.nth(0).value).contains(firstColumn.description,'First Column Description was not displayed',timeout)
        .expect(glTablePage.columnLengthInput.nth(0).value).contains(firstColumn.length,'First Column Length was not displayed',timeout)
        .expect(glTablePage.columnInput.nth(1).value).contains(secondColumn.name,'Second Column Name was not displayed',timeout)
        .expect(glTablePage.columnDescriptionInput.nth(1).value).contains(secondColumn.description,'Second Column Description was not displayed',timeout)
        .expect(glTablePage.columnLengthInput.nth(1).value).contains(secondColumn.length,'Second Column Length was not displayed',timeout)

    //12. Click trash icon on @TableName row and select "Delete" in modal
        .click(glTablePage.trashIcon.nth(tableIndex))
        .expect(confirmModal.body.innerText).contains(labels['ui-gltable-014'],'Confirm deletion message should be displayed',timeout)
        .click(confirmModal.acceptButton)
    
    //13. Click "Save" button
        .click(glTablePage.saveButton)
        .click(confirmModal.acceptButton);

    customerTables = (await apiHandler.getCustomerTables(corcentricCustomer.client_id)).items;
    testTable = customerTables.find(element => element.table_name === tableName);
    if(testTable){
        throw new ShortError('Table was not correctly deleted');
    }
});

test(`TC 27869: Mobile Duplicate Table Error`, async t => {

    const glTablePage = new GLTablePage();
    let customers = (await apiHandler.getAllCustomers()).items;
    const customerName = 'Corcentric';
    const tableName = '27869_TestTable';
    //2. Go to Portal
    await t
        .click(dashboardTitles.withText(t.fixtureCtx.app));
    //3. Select "Corcentric" customer
    await t
        .click(await clickable(glTablePage.customersDropdown))
        .click(glTablePage.dropdownOptions.withText(customerName));
    let corcentricCustomer = await getByKey(customers, 'client_name', customerName);
    let customerTables = (await apiHandler.getCustomerTables(corcentricCustomer.client_id)).items;
    let tableIndex = customerTables.length;
    //4. Click "+Table" button
    await t
        .click(glTablePage.addTableButton)
        //6. Insert @TableName on Table Name input
        .typeText(glTablePage.tableNameInput.nth(tableIndex), tableName, paste);

    const firstColumn = {
        name: 'Column0',
        description: 'test column0',
        key: true,
        length: '10'
    }
    await t
        .typeText(glTablePage.columnInput, firstColumn.name, paste)
        .typeText(glTablePage.columnDescriptionInput, firstColumn.description, paste)
        .click(glTablePage.columnKeyCheckbox)
        .typeText(glTablePage.columnLengthInput, firstColumn.length, paste)
        .click(glTablePage.saveButton);
    let confirmModal = new ConfirmModal();
    await t
        .click(confirmModal.acceptButton);
    try {
        //Check saved table.
        customerTables = (await apiHandler.getCustomerTables(corcentricCustomer.client_id)).items;
        let testTable = customerTables.find(element => element.table_name === tableName);
        if (!testTable) {
            throw new ShortError('Table was not correctly saved');
        }
        //3. Select "Corcentric" customer (duplicate)
        await t
            .click(await clickable(glTablePage.customersDropdown))
            .click(glTablePage.dropdownOptions.withText(customerName));
        corcentricCustomer = await getByKey(customers, 'client_name', customerName);
        customerTables = (await apiHandler.getCustomerTables(corcentricCustomer.client_id)).items;
        tableIndex = customerTables.length;
        //4. Click "+Table" button (duplicate)
        await t
            .click(glTablePage.addTableButton)
            //6. Insert @TableName on Table Name input (duplicate)
            .typeText(glTablePage.tableNameInput.nth(tableIndex), tableName, paste)
        await t
            .typeText(glTablePage.columnInput, firstColumn.name, paste)
            .typeText(glTablePage.columnDescriptionInput, firstColumn.description, paste)
            .click(glTablePage.columnKeyCheckbox)
            .typeText(glTablePage.columnLengthInput, firstColumn.length, paste)
            .click(glTablePage.saveButton);
        confirmModal = new ConfirmModal();
        await t
            .click(confirmModal.acceptButton);
        await t
            .click(await clickable(glTablePage.customersDropdown))
            .click(glTablePage.dropdownOptions.withText(customerName)); 
        await t
            //12. Click trash icon on @TableName row and select "Delete" in modal
            .click(glTablePage.trashIcon.nth(0))
            .click(confirmModal.acceptButton)
            //13. Click "Save" button
            .click(glTablePage.saveButton)
            .click(confirmModal.acceptButton);
    } catch (error) {
        let tables = (await apiHandler.getCustomerTables(corcentricCustomer.client_id)).items;
        let testTable = tables.find(element => element.table_name === tableName);
        if (testTable != null) {
            await apiHandler.deleteTable(testTable, corcentricCustomer.client_id);
        }
        throw error;
    }
});
