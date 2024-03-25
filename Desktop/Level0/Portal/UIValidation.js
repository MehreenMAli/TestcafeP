import { Selector } from 'testcafe';
import { before, after } from '../../../hooks';
import Page from './../../../page-models/page';
import users from '../../../users';
import config from '../../../config';

import { insensitive, checkLabels, timeout, checkRequests, logger, getByKey, getMenu, byID } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import GLTablePage from '../../../page-models/portal/glTablePage';
import GlTableImport from '../../../page-models/portal/glTableImportPage';
import SetupPage from '../../../page-models/portal/setupPage';
import APIHandler from '../../../utils/apiHandler';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import Modal from '../../../page-models/modal';
import InfoModal from '../../../page-models/infoModal';

const localizator = new Localizator();
const page = new Page();
const apiHandler  = new APIHandler();
const args = parseArguments();
const category = {
	id: 120,
	name: "Portal"
};

var portalFixture = fixture`Level 0 - Portal - UI Validations - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before(async ctx => {
		await before();
		let apps = await apiHandler.getApps();
		let application = apps.find(element => element['application_id'] === 120);
		ctx.apps = apps;
		ctx.app = application.title; //Portal
		ctx.menues = await apiHandler.getMenues(application.menu_param);
		ctx.glTableMenu = getMenu(ctx.menues,12001);
		ctx.setupMenu = getMenu(ctx.menues,12002);
		ctx.labels = await localizator.getLabelsAsJson('ui-gltable-0*,ui-gltableimp-0*,ui-glsetup-0*');	 
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

loadFixture(users[args.user],category,portalFixture);

test(`TC 25769: 'GL Table' Page`, async t => {
    const glTablePage = new GLTablePage();
    let labels = t.fixtureCtx.labels;
    let customers = (await apiHandler.getAllCustomers()).items;
    const clients = await apiHandler.getAllCustomers();
    let customerName = await glTablePage.getCustomerName(args.env,clients.items);
    
    await t
    //2. Go to Portal
    //3. Check Page title

        await t
            .click(byID(t.fixtureCtx.glTableMenu.action_key))
            .expect(page.title.innerText).match(insensitive(labels['ui-gltable-000']),'The "Page Title" was wrong', timeout)

    //4. Check Page elements
        .expect(glTablePage.label.withText(labels['ui-gltable-004'])).ok('The "Customers" label should exist')
        .expect(glTablePage.customersDropdown.exists).ok('The Customers dropdown should exist')
        .expect(glTablePage.importButton.exists).ok('The "Import" button should exist')
        .expect(glTablePage.saveButton.exists).ok('The "Save" button should exist')

    //5. Check Customers dropdown options
        .click(glTablePage.customersDropdown);
    await t
        .expect(await checkLabels(glTablePage.dropdownOptions,customers,'client_name')).ok('Customers dropdown options are not correct')
        //6. Select "Corcentric" customer and check elements
        .click(glTablePage.dropdownOptions.withText(customerName))
        //Check elements.
        .expect(glTablePage.addTableButton.exists).ok('The "+Table" button should exist',timeout);

    let corcentricCustomer = await getByKey(customers,'client_name',customerName);
    let customerTables = (await apiHandler.getCustomerTables(corcentricCustomer.client_id,1)).items;

    if((args.env == 'prod') || (customerTables.length == 0)) {
        await t
            .click(glTablePage.addTableButton)
            .wait(5000)
            .expect(glTablePage.tableRows.nth(0).find('label').withText(labels['ui-gltable-005'])).ok('Table Name label is not present')
            .expect(glTablePage.tableNameInput.nth(0).exists).ok('The Table Name input should exist')
            .expect(glTablePage.arrowDownIcon.nth(0).exists).ok('The Angle Down icon should exist')
            .expect(glTablePage.trashIcon.nth(0).exists).ok('The trash icon should exist')
            .wait(2000)
            .expect(glTablePage.columnRows.nth(0).find('label').withText(`${labels['ui-gltable-006']} 0`).exists).ok(`Column 0 label was not displayed`)
            .expect(glTablePage.columnInput.exists).ok('Column input is not present')
            .expect(glTablePage.columnRows.nth(0).find('label').withText(labels['ui-gltable-007']).exists).ok(`Column 0 Description label was not displayed`)
            .expect(glTablePage.columnDescriptionInput.exists).ok(`Column 0 Description input is not present`)
            .expect(glTablePage.columnRows.nth(0).find('label').withText(labels['ui-gltable-008']).exists).ok(`Column 0 Key label was not displayed`)
            .expect(glTablePage.columnKeyCheckbox.exists).ok(`Column 0 Key checkbox is not present`)
            .expect(glTablePage.columnRows.nth(0).find('label').withText(labels['ui-gltable-009']).exists).ok(`Column 0 Length label was not displayed`)
            .expect(glTablePage.columnDescriptionInput.exists).ok(`Column 0 Description input is not present`)
            .expect(glTablePage.columnPlusIcon.nth(0).exists).ok(`Column 0 Plus icon is not present`);
    }else{
        for(let i=0; i<customerTables.length; i++){
            await t
                .expect(glTablePage.tableRows.nth(i).find('label').withText(labels['ui-gltable-005'])).ok('Table Name label is not present')
                .expect(glTablePage.tableNameInput.nth(i).exists).ok('The Table Name input should exist' + i)
                .expect(glTablePage.arrowDownIcon.nth(i).exists).ok('The Angle Down icon should exist')
                .expect(glTablePage.trashIcon.nth(i).exists).ok('The trash icon should exist')
        }
        if(customerTables.length != 0){
            //7. Click angle-down icon on first Table
            await t
            .click(glTablePage.arrowDownIcon.nth(0));
            //Check elements.
            let tableColumns = (await apiHandler.getTableColumns(corcentricCustomer.client_id,customerTables[0].table_id)).items;

            for(let i=0; i<tableColumns.length; i++){
                await t
                .expect(glTablePage.columnRows.nth(i).find('label').withText(`${labels['ui-gltable-006']} ${i}`).exists).ok(`Column ${i} label was not displayed`)
                .expect(glTablePage.columnInput.exists).ok('Column input is not present')
                .expect(glTablePage.columnRows.nth(i).find('label').withText(labels['ui-gltable-007']).exists).ok(`Column ${i} Description label was not displayed`)
                .expect(glTablePage.columnDescriptionInput.exists).ok(`Column ${i} Description input is not present`)
                .expect(glTablePage.columnRows.nth(i).find('label').withText(labels['ui-gltable-008']).exists).ok(`Column ${i} Key label was not displayed`)
                .expect(glTablePage.columnKeyCheckbox.exists).ok(`Column ${i} Key checkbox is not present`)
                .expect(glTablePage.columnRows.nth(i).find('label').withText(labels['ui-gltable-009']).exists).ok(`Column ${i} Length label was not displayed`)
                .expect(glTablePage.columnDescriptionInput.exists).ok(`Column ${i} Description input is not present`)
                .expect(glTablePage.columnPlusIcon.nth(i).exists).ok(`Column ${i} Plus icon is not present`);

                if(i !== 0)
                    await t.expect(glTablePage.columnThrashIcon.nth(i-1).exists).ok(`Column ${i} Thrash icon is not present`);
            }
        }
    }
});

test(`TC 25770: 'Setup' Page`, async t => {
	const setupPage = new SetupPage();
	let labels = t.fixtureCtx.labels;
	let customers = (await apiHandler.getAllCustomers()).items;
	const clients = await apiHandler.getAllCustomers();
	let customerName = await setupPage.getCustomerName(args.env,clients.items);

	//2. Go to Portal
	await t 
	//3. Click on "Setup" menu on the left
		.click(byID(t.fixtureCtx.setupMenu.action_key))
	
	//4. Check Page title
		.expect(page.title.innerText).match(insensitive(labels['ui-glsetup-000']),'The "Page Title" was wrong', timeout)
	
	//5. Check Page Elements
		.expect(setupPage.cancelButton.exists).ok('The "Cancel" button should exist')
		.expect(setupPage.label.withText(labels['ui-glsetup-001']).exists).ok('Customers label is not present')
		.expect(setupPage.customersDropdown.exists).ok('Customers dropdown is not present')
	
	//6. Check Customers dropdown options
		.click(setupPage.customersDropdown);
	await t
		.expect(await checkLabels(setupPage.dropdownOptions,customers,'client_name')).ok('Customers dropdown options are not correct')

	//7. Select "Corcentric" customer and check elements
		.click(setupPage.dropdownOptions.withText(customerName))
		//Check elements.
	//Concat Segments side.
		.expect(setupPage.label.withText(labels['ui-glsetup-002']).exists).ok('"Preview: Concat Segment" label is not present')
		.expect(setupPage.addLookup.exists).ok('Add lookup button is not present');

	let corcentricCustomer = await getByKey(customers,'client_name',customerName);
	let lookupSegments = (await apiHandler.getCustomersLookupSegments(corcentricCustomer.client_id)).items;


	if(args.env == 'prod'){
		await t
			.wait(5000)
			.expect(setupPage.addLookup.exists).ok(`Add Lookup button was not found`)
			.expect(setupPage.addSegment.exists).ok(`Add Segment button was not found`)
			.expect(setupPage.reorderSegments.exists).ok(`Reorder Segments button was not found`);
	}else{
		if(lookupSegments.length === 0)
			await t.expect(setupPage.lookupFieldLabel.withText(labels['ui-glsetup-005'])).ok('"No segments yet" label should be present');
		else
			for(let i=0; i<lookupSegments.length; i++){
				await t
					.expect(setupPage.lookupFieldLabel.withText(lookupSegments[i].segment_lookup_name).exists).ok(`${lookupSegments[i].segment_lookup_name} label was not found`)
					.expect(setupPage.lookupFieldLabel.withText(lookupSegments[i].segment_lookup_name).sibling(0).find('div.dropdown-arrow').exists).ok(`${lookupSegments[i].segment_lookup_name} dropdown was not found`)
					.expect(setupPage.lookupFieldEditIcon.nth(i).exists).ok(`${lookupSegments[i].segment_lookup_name} edit icon was not found`)
					.expect(setupPage.lookupFieldThrashIcon.nth(i).exists).ok(`${lookupSegments[i].segment_lookup_name} delete icon was not found`);
			}
		
		//New Segment side.
		await t
			.expect(setupPage.label.withText(labels['ui-glsetup-004']).exists).ok('"Preview: New Segment" label is not present')
			.expect(setupPage.addSegment.exists).ok('Add New Segment button is not present')
			.expect(setupPage.reorderSegments.exists).ok('Reorder Segments button is not present');
		
		let segments = (await apiHandler.getCustomersSegments(corcentricCustomer.client_id)).items;

		if(segments.length === 0)
			await t.expect(setupPage.segmentFieldLabel.withText(labels['ui-glsetup-005'])).ok('"No segments yet" label should be present');
		else
			for(let i=0; i<segments.length; i++){
				let fieldCss = 'input'; //Text or typeahead input.
				if(segments[i].input_type == 1)
					fieldCss = 'div.dropdown-arrow';
				await t
					.expect(setupPage.segmentFieldLabel.withText(segments[i].segment_name).exists).ok(`${segments[i].segment_name} label was not found`)
					.expect(setupPage.segmentFieldLabel.withText(segments[i].segment_name).parent(0).find(fieldCss).exists).ok(`${segments[i].segment_name} input was not found`)
					.expect(setupPage.segmentFieldEditIcon.nth(i).exists).ok(`${segments[i].segment_name} edit icon was not found`)
					.expect(setupPage.segmentFieldThrashIcon.nth(i).exists).ok(`${segments[i].segment_name} delete icon was not found`);
			}

		//8. Click Add new Concat Segment button
		await t
			.click(setupPage.addLookup)
			//Check elements.
			//TODO check field inputs.
			.expect(setupPage.label.withText(labels['ui-glsetup-006']).exists).ok('"Properties: Concat Segment" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-007']).exists).ok('"Segment Name" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-007']).exists).ok('"Segment Name" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-008']).nth(0).exists).ok('First "Select Segment" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-033']).nth(0).exists).ok('First "Concat" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-008']).nth(1).exists).ok('Second "Select Segment" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-033']).nth(1).exists).ok('Second "Concat" label was not found');
			
		if(lookupSegments.length !== 0){
		//9. Click Edit on first Concat Segment
			await t
				.click(setupPage.lookupFieldEditIcon.nth(0))
				//Check elements.
				//TODO check input elements.
				.expect(setupPage.label.withText(labels['ui-glsetup-006']).exists).ok('"Properties: Concat Segment" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-007']).exists).ok('"Segment Name" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-007']).exists).ok('"Segment Name" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-008']).nth(0).exists).ok('First "Select Segment" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-033']).nth(0).exists).ok('First "Concat" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-008']).nth(1).exists).ok('Second "Select Segment" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-033']).nth(1).exists).ok('Second "Concat" label was not found');
		}
		
		//10. Click Add New Segment button
		//TODO check input elements.
		await t
			.click(setupPage.addSegment)
			.expect(setupPage.label.withText(labels['ui-glsetup-010']).exists).ok('"Properties: Segment" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-011']).exists).ok('"Start Date" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-012']).exists).ok('"End Date" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-013']).exists).ok('"Backdate Allocation" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-007']).exists).ok('"Segment Name" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-014']).exists).ok('"Search Enabled" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-009']).exists).ok('"Save" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-015']).exists).ok('"Input Type" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-016']).nth(0).exists).ok('First "Source Table" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-017']).nth(0).exists).ok('First "Source Column" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-018']).exists).ok('"Dependency" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-019']).exists).ok('"Dependent Segment" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-016']).nth(1).exists).ok('Second "Source Table" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-017']).nth(1).exists).ok('Second "Source Column" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-020']).exists).ok('"Related Source Column" label was not found')
			.expect(setupPage.label.withText(labels['ui-glsetup-021']).exists).ok('"Related Dependent Column" label was not found');

		//11. Click Edit button on first segment
		if(segments.length !== 0){
			await t
				.click(setupPage.segmentFieldEditIcon.nth(0))
				.expect(setupPage.label.withText(labels['ui-glsetup-010']).exists).ok('"Properties: Segment" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-011']).exists).ok('"Start Date" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-012']).exists).ok('"End Date" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-013']).exists).ok('"Backdate Allocation" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-007']).exists).ok('"Segment Name" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-014']).exists).ok('"Search Enabled" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-009']).exists).ok('"Save" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-015']).exists).ok('"Input Type" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-016']).nth(0).exists).ok('First "Source Table" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-017']).nth(0).exists).ok('First "Source Column" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-018']).exists).ok('"Dependency" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-019']).exists).ok('"Dependent Segment" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-016']).nth(1).exists).ok('Second "Source Table" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-017']).nth(1).exists).ok('Second "Source Column" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-020']).exists).ok('"Related Source Column" label was not found')
				.expect(setupPage.label.withText(labels['ui-glsetup-021']).exists).ok('"Related Dependent Column" label was not found')
		}
		//12. Click "Reorder Segments" button
		let reorderModal = new InfoModal();
		await t
			.click(setupPage.reorderSegments)
			.expect(reorderModal.header.innerText).contains(labels['ui-glsetup-023'],'Reorder title was not display in Modal')
			.expect(reorderModal.body.find('button.btn-primary').withText(labels['ui-glsetup-009'])).ok('Save button was not found in Reorder Modal')
		for(let i=0; i<segments.length; i++){
			await t
				.expect(reorderModal.body.find('label.legend').withText(segments[i].segment_name).exists).ok(`${segments[i].segment_name} label was not found in Reorder Modal`)
		}
	}
});

test(`TC 25835: 'GL Tables Import' Page`, async t => {
	const glTablePage = new GLTablePage();
	const glTableImportPage = new GlTableImport();
	const labels = t.fixtureCtx.labels;
	const glImportLabels = [
		labels ['ui-gltableimp-001'],  // Customers
		labels ['ui-gltableimp-002'],  // Tables
		labels ['ui-gltableimp-003'],  // Mapping Name
		labels ['ui-gltableimp-004'],  // File Delimiter
		labels ['ui-gltableimp-005'],  // Has Header 
		labels ['ui-gltableimp-006']   // File Name
	]
   
	await t 
		//2. Go to Portal
		//3.Click on Import button
		.click(byID(t.fixtureCtx.glTableMenu.action_key))
		.click(glTablePage.importButton)
		//4. Check the title of the page 
		.expect(page.title.innerText).match(insensitive(labels['ui-gltableimp-000']),'The "Page Title" was wrong',timeout)
		//5. Check the labels 
		.expect(await checkLabels(glTableImportPage.labels, glImportLabels)).ok()
		//6. Check page elements
		.expect(glTableImportPage.customersDropdown.exists).ok('The "Customer Dropdown" should exist')
		.expect(glTableImportPage.tablesDropdown.exists).ok('The "Tables Dropdown" should exist')
		.expect(glTableImportPage.mappingNameInput.exists).ok('The "Mapping Name" input should exist')
		.expect(glTableImportPage.fileDelimiterDropdown).ok('The "File Delimiter Dropdown" should exist')
		.expect(glTableImportPage.hasHeaderCheckbox.exists).ok('The "Has Header Checkbox" should exist')
		.expect(glTableImportPage.fileNameInput.exists).ok('The "File Name Input" should exist')
		//7. Check buttons
		.expect(glTableImportPage.uploadFileButton.exists).ok('The "Upload File Button" should exist')
		.expect(glTableImportPage.cancelButton.exists).ok('The "Cancel Button" should exist');

});

test(`TC 27393: 'Check hamb menu navigation`, async t => {
	let labels = t.fixtureCtx.labels;
	
	await t
		// Click on "Setup" menu on the left
		.click(byID(t.fixtureCtx.setupMenu.action_key))
		// Check Page title
		.expect(page.title.innerText).match(insensitive(labels['ui-glsetup-000']),'The "Page Title" was wrong', timeout)
	
		// Click on GL Table
		.click(byID(t.fixtureCtx.glTableMenu.action_key))
		// Check the title of the page 
		.expect(page.title.innerText).match(insensitive(labels['ui-gltable-000']),'The "Page Title" was wrong',timeout)
				
});

