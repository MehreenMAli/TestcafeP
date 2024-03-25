import { before, after } from '../../../hooks';
import Page from './../../../page-models/page';
import users from '../../../users';
import config from '../../../config';

import { checkRequests, logger, paste, timeout, clickable, getByKey, byID, getMenu } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import GLTablePage from '../../../page-models/portal/glTablePage';
import APIHandler from '../../../utils/apiHandler';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import ConfirmModal from '../../../page-models/confirmModal';
import ShortError from '../../../error-types/shortError';

const localizator = new Localizator();
const page = new Page();
const apiHandler = new APIHandler();
const args = parseArguments();
const category = {
    id: 120,
    name: "Portal"
};

var portalFixture = fixture`Level 1 - Portal - Edition - Running on "${args.env.toUpperCase()}"`
    .page(config[args.env].baseUrl)
    .requestHooks(logger)
    .before(async ctx => {
        await before();
        let apps = await apiHandler.getApps();
        let application = apps.find(element => element['application_id'] === 120);
        ctx.apps = apps;
        ctx.app = application.title; //Portal
        ctx.menues = await apiHandler.getMenues(application.menu_param);
        ctx.glTableMenu = getMenu(ctx.menues, 12001);
        ctx.labels = await localizator.getLabelsAsJson('ui-gltable-0*,ui-gltableimp-0*,ui-glsetup-0*,msg-00-0*');
    })
    .after(async ctx => {
        await after();
    })
    .beforeEach(async t => {
        let currentUser = users[args.user];
        await page.login(currentUser.username,
            currentUser.password,
            currentUser.landingPage);
    })
    .afterEach(async t => {
        await page.logout();
        await checkRequests(logger.requests);
    });

loadFixture(users[args.user], category, portalFixture);

test(`TC 27866: Edition Table`, async t => {

    const glTablePage = new GLTablePage();
    let labels = t.fixtureCtx.labels;
    let customers = (await apiHandler.getAllCustomers()).items;
   
    const customerName = 'Corcentric';
    const tableName = '27866_TestTable';
    const tableNameEdit = '27866_EditTest';

    //2. Go to Portal
    await t.click(byID(t.fixtureCtx.glTableMenu.action_key))
    //3. Select "Corcentric" customer
    await t
        .click(await clickable(glTablePage.customersDropdown))
        .click(glTablePage.dropdownOptions.withText(customerName))

    let corcentricCustomer = await getByKey(customers, 'client_name', customerName);
    let customerTables = (await apiHandler.getCustomerTables(corcentricCustomer.client_id)).items;
    let tableIndex = customerTables.length;

    //4. Add Table
    await t
        .click(glTablePage.addTableButton)
        .typeText(glTablePage.tableNameInput.nth(tableIndex), tableName, paste)
        .click(glTablePage.arrowDownIcon.nth(tableIndex));
    //"TestColumn0" name, "test column0" description, checked Key value and "10" length value
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
    try {
        await t
            .click(glTablePage.saveButton);
        let confirmModal = new ConfirmModal();
        await t
            .expect(confirmModal.body.innerText).contains(labels['ui-gltable-018'], 'Confirmation message was not displayed', timeout)
            .click(confirmModal.acceptButton);
        //Check saved table.
        customerTables = (await apiHandler.getCustomerTables(corcentricCustomer.client_id)).items;
        let testTable = customerTables.find(element => element.table_name === tableName);
        if (!testTable) {
            throw new ShortError('Table was not correctly saved');
        }
        tableIndex = customerTables.indexOf(testTable);
        await t
            .expect(glTablePage.tableNameInput.nth(tableIndex).value).contains(tableName, 'New Table Name was not displayed', timeout)
            .click(glTablePage.arrowDownIcon.nth(tableIndex))
            .expect(glTablePage.columnInput.nth(0).value).contains(firstColumn.name, 'First Column Name was not displayed', timeout)
            .expect(glTablePage.columnDescriptionInput.nth(0).value).contains(firstColumn.description, 'First Column Description was not displayed', timeout)
            .expect(glTablePage.columnLengthInput.nth(0).value).contains(firstColumn.length, 'First Column Length was not displayed', timeout)
            .click(glTablePage.columnPlusIcon)
        //11. Add column
        const secondColumn = {
            name: 'Column1',
            description: 'test column1',
            key: false,
            length: '10'
        }
        await t
            .typeText(glTablePage.columnInput.nth(1), secondColumn.name, paste)
            .typeText(glTablePage.columnDescriptionInput.nth(1), secondColumn.description, paste)
            .typeText(glTablePage.columnLengthInput.nth(1), secondColumn.length, paste)

            .click(glTablePage.saveButton)
            .expect(confirmModal.body.innerText).contains(labels['ui-gltable-018'], 'Confirmation message was not displayed', timeout)
            .click(confirmModal.acceptButton)
            .click(glTablePage.arrowDownIcon.nth(tableIndex))
            .expect(glTablePage.tableNameInput.nth(tableIndex).value).contains(tableName, 'New Table Name was not displayed', timeout)
            .click(glTablePage.arrowDownIcon.nth(tableIndex))
            .expect(glTablePage.columnInput.nth(0).value).contains(firstColumn.name, 'First Column Name was not displayed', timeout)
            .expect(glTablePage.columnDescriptionInput.nth(0).value).contains(firstColumn.description, 'First Column Description was not displayed', timeout)
            .expect(glTablePage.columnLengthInput.nth(0).value).contains(firstColumn.length, 'First Column Length was not displayed', timeout)
            .expect(glTablePage.columnInput.nth(1).value).contains(secondColumn.name, 'Second Column Name was not displayed', timeout)
            .expect(glTablePage.columnDescriptionInput.nth(1).value).contains(secondColumn.description, 'Second Column Description was not displayed', timeout)
            .expect(glTablePage.columnLengthInput.nth(1).value).contains(secondColumn.length, 'Second Column Length was not displayed', timeout)
            // . Change name table
            try {
                await t
                    .click(glTablePage.tableNameInput.nth(tableIndex))
                    .pressKey('ctrl+a delete') 
                    .typeText(glTablePage.tableNameInput.nth(tableIndex), tableNameEdit, paste)
                    .click(glTablePage.saveButton)
                    .expect(confirmModal.body.innerText).contains(labels['ui-gltable-018'], 'Confirmation message was not displayed', timeout)
                    .click(confirmModal.acceptButton);
                let customerTablesEdit = (await apiHandler.getCustomerTables(corcentricCustomer.client_id)).items;
                let testTableEdit = customerTablesEdit.find(element => element.table_name === tableNameEdit);
                if (testTableEdit == null) {
                    throw 'The table name was not recorded properly.'
                }
            } catch (error) {
                let tables = (await apiHandler.getCustomerTables(corcentricCustomer.client_id)).items;
                let testTable = tables.find(element => element.table_name === tableName);
                if (testTable != null) {
                    await apiHandler.deleteTable(testTable, corcentricCustomer.client_id);
                }
                throw error;
            }
            
        await t
            //12. Borrar table
            .click(glTablePage.trashIcon.nth(tableIndex))
            .expect(confirmModal.body.innerText).contains(labels['ui-gltable-014'], 'Confirm deletion message should be displayed', timeout)
            .click(confirmModal.acceptButton)

            //13. Click "Save" button
            .click(glTablePage.saveButton)
            .click(confirmModal.acceptButton);
    } catch (err) {
        let tables = (await apiHandler.getCustomerTables(corcentricCustomer.client_id)).items;
        let testTable = tables.find(element => element.table_name === tableNameEdit);
        let testTableOriginal = tables.find(element => element.table_name === tableName);
        if (testTable != null) {
            await apiHandler.deleteTable(testTable, corcentricCustomer.client_id);
        } else if (testTableOriginal != null){
            await apiHandler.deleteTable(testTableOriginal, corcentricCustomer.client_id);
        }
        throw err;
    }
});