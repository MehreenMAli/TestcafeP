import { Selector } from 'testcafe';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import Page from './../../../page-models/page';
import { byID, checkLabels, getMenu, checkRequests, logger, paste, longTimeout } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import UsersPage from '../../../page-models/platformadmin/usersPage';
import SetupPage from '../../../page-models/platformadmin/setupPage';

const localizator = new Localizator();
const apiHandler  = new APIHandler();
const page = new Page();
const args = parseArguments();
const category = {
	id: 100,
	name: "Platform Admin"
};


let pAdminFixture = fixture`Level 0 - Platform Admin - UI Validations - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before(async ctx => {
		await before();
		let apps = await apiHandler.getApps();
		let application = apps.find(element => element['application_id'] === 100);
		ctx.apps = apps;
		ctx.app = application.title; //Platform Admin
		ctx.menues = await apiHandler.getMenues(application.menu_param);
		ctx.labels = await localizator.getLabelsAsJson('ui-usr-*,ui-platf-offering-*,ui-cm-*,ui-platf-*');	
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

loadFixture(users[args.user],category,pAdminFixture);


test(`TC 26984: UI Validation - Users Page`, async t => {
	let labels = t.fixtureCtx.labels;
    let menues = t.fixtureCtx.menues;
    let usersPage = new UsersPage();
    let roleMembreship = 'Corcentric';
	let tableHeaders = [labels['ui-usr-004'],	// First Name
						labels['ui-usr-005'],	// Last Name
						labels['ui-usr-014'],	// Date
						labels['ui-usr-007']	// E-Mail
					];

	await t
		//2. Go to Users on Platform Admin
		.expect(byID(getMenu(menues,901).action_key).exists).ok('The "Users" menu should exist',longTimeout)
        .wait(5000);
    await t
		//3. Check Page Title
        .expect(page.title.innerText).contains(labels['ui-usr-000'])
        //4. Check elements of Users Page
        .expect(usersPage.table.exists).ok('The "Users" table should exist')
        .expect(usersPage.roleMembershipDropdown.exists).ok('The "Role Membership" select should exist')
        .expect(usersPage.addUserButton.exists).ok('The "Add Users" button should exist')
        .expect(usersPage.resetFilter.exists).ok('The "Reset Filter" button should exist')
        .expect(usersPage.firstNameFilter.exists).ok('The "FirstName" input filter should exist')
        .expect(usersPage.lastNameFilter.exists).ok('The "LastName" input filter should exist')
        .expect(usersPage.dateFilter.exists).ok('The "Date" input filter should exist')
        .expect(usersPage.emailFilter.exists).ok('The "Email" input filter should exist')
        //5. Check Headers of table
        .expect(await checkLabels(usersPage.tableHeaders,tableHeaders)).ok('The "Headers" table should not correct');	
    await t
        //6. Click over elements
        .click(usersPage.roleMembershipDropdown.find('input'))
        .click(usersPage.roleMembershipDropdown.find('p').withText(roleMembreship))
        .click(usersPage.resetFilter)
        .wait(2000)
        .click(usersPage.addUserButton)
        //Check Lebels
        .expect(usersPage.labelsPage.withText(labels['ui-usr-109']).exists).ok('The "Username" lebel should exists')
        .expect(usersPage.labelsPage.withText(labels['ui-usr-110']).exists).ok('The "First name" lebel should exists')
        .expect(usersPage.labelsPage.withText(labels['ui-usr-111']).exists).ok('The "Middle name" lebel should exists')
        .expect(usersPage.labelsPage.withText(labels['ui-usr-112']).exists).ok('The "Last name" lebel should exists')
        .expect(usersPage.labelsPage.withText(labels['ui-usr-127']).exists).ok('The "Company" lebel should exists')
        .expect(usersPage.labelsPage.withText(labels['ui-usr-114']).exists).ok('The "Email" lebel should exists')
        .expect(usersPage.labelsPage.withText(labels['ui-usr-128']).exists).ok('The "Status" lebel should exists')
        .expect(usersPage.labelsPage.withText(labels['ui-usr-113']).exists).ok('The "Phone number" lebel should exists')
        .expect(usersPage.labelsPage.withText(labels['ui-usr-129']).exists).ok('The "Password expiration date" lebel should exists')
        //Check Elements
        .expect(usersPage.personalInfoTab.exists).ok('The "Personal Info" tab should exist')
        .expect(usersPage.usernameInput.exists).ok('The "Username" input should exist')
        .expect(usersPage.firstnameInput.exists).ok('The "First Name" input should exist')
        .expect(usersPage.middlenameInput.exists).ok('The "Middle Name" input should exist')
        .expect(usersPage.lastnameInput.exists).ok('The "Last Name" input should exist')
        .expect(usersPage.emailInput.exists).ok('The "Email" input should exist')
        .expect(usersPage.phoneInput.exists).ok('The "Phone" input should exist')
        .expect(usersPage.companyDropdown.exists).ok('The "Company" select should exist')
        .expect(usersPage.passwordExpire.exists).ok('The "Password expiration date" datepicker should exist')
        .expect(usersPage.statusDropdown.exists).ok('The "Status" select should exist')
        .expect(usersPage.saveButton.exists).ok('The "Save" button should exist')
        .expect(usersPage.cancelButton.exists).ok('The "Cancel" button should exist')
        .typeText(usersPage.usernameInput,'Test Cancel',paste)
        .wait(5000);
    await t
        .click(usersPage.cancelButton)
        .expect(usersPage.modalConfirm.exists).ok('The "Confirm Cancel" modal should exist')
        .click(usersPage.cancelModalButton)
        .click(usersPage.cancelButton)
        .expect(usersPage.modalConfirm.exists).ok('The "Confirm Cancel" modal should exist')
      //  .wait(10000)
      //  .click(usersPage.acceptButton,longTimeout);
});

test(`TC 26985: UI Validation - Platform Setup Page`, async t => {
	let labels = t.fixtureCtx.labels;
    let menues = t.fixtureCtx.menues;
    let setupPage = new SetupPage();
    let tableHeaders = [labels['ui-platf-offering-003'],	// Short Name
						labels['ui-platf-offering-004']	// Long Name
                    ];
    //TODO: Se toma manual
    let tableHeadersBE = ['Name' // Name
                    ];
    await t
		//2. Go to Platform Setup
		.expect(byID(getMenu(menues,90101).action_key).exists).ok('The "Platform Setup" menu should exist')
        .click(byID(getMenu(menues,90101).action_key))
        .wait(2000)
        //3. Check Page Title 
        .expect(page.title.innerText).contains(labels['ui-platf-000'])
        //4. Check elements of Users Page
        .expect(setupPage.table.exists).ok('The "Role" table should exist')
        .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist')
        //Tabs
        .expect(setupPage.offeringTab.exists).ok('The "Offering" tab should exist')
        .expect(setupPage.activityTab.exists).ok('The "Activity" tab should exist')
        .expect(setupPage.communityTab.exists).ok('The "Community" tab should exist')
        .expect(setupPage.bussinesEntityTab.exists).ok('The "Bussines Entity" tab should exist');
    
    let offeringResults = await apiHandler.getOffering();
    if (offeringResults['total'] > 0)
        await t.expect(await checkLabels(setupPage.tableHeaders,tableHeaders)).ok('The "Headers" table should not correct');
    await t    
        //5. Check all tabs
        .click(setupPage.communityTab)
        //No hay contenido
        .wait(2000)
        .click(setupPage.activityTab)
        .expect(setupPage.tableActivity.exists).ok('The "Activity" table should exist')            
        .click(setupPage.bussinesEntityTab)
        .expect(setupPage.tableBE.exists).ok('The "Bussines Entity" table should exist')
        .expect(await checkLabels(setupPage.tableHeadersBE,tableHeadersBE)).ok('The "Headers" table should not correct');
    await t
        .click(setupPage.offeringTab)
        .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist')
        .click(setupPage.addOffering)
        .expect(setupPage.shortNameInput.exists).ok('The "Short Name" input should exist')
        .expect(setupPage.longNameInput.exists).ok('The "Long Name" input should exist')
        .expect(setupPage.saveButton.exists).ok('The "Save" button should exist')
        .expect(setupPage.cancelButton.exists).ok('The "Cancel" button should exist')
        .click(setupPage.cancelButton)
        .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist');
        
});

test(`TC 27392: Check hamb menu navigation`, async t => {
	let labels = t.fixtureCtx.labels;
    let menues = t.fixtureCtx.menues;
    await t
		// Go to Platform Setup
		.expect(byID(getMenu(menues,90101).action_key).exists).ok('The "Platform Setup" menu should exist',longTimeout)
        .click(byID(getMenu(menues,90101).action_key),longTimeout)
        .wait(5000)
        .expect(page.title.innerText).contains(labels['ui-platf-000'],longTimeout)

        // Go to Users
		.expect(byID(getMenu(menues,901).action_key).exists).ok('The "Users" menu should exist',longTimeout)
        .click(byID(getMenu(menues,901).action_key),longTimeout)
        .wait(5000)
        .expect(page.title.innerText).contains(labels['ui-usr-000'],longTimeout) 
});

test(`TC 27694: UI Validation - Users Datails Page`, async t => {
	let labels = t.fixtureCtx.labels;
    let menues = t.fixtureCtx.menues;
    let usersPage = new UsersPage();
    let company = 'Corcentric'
    
	await t
		//2. Go to Users on Platform Admin
		.expect(byID(getMenu(menues,901).action_key).exists).ok('The "Users" menu should exist',longTimeout)
        .wait(5000);
    await t
		//3. Check Page Title
        .expect(page.title.innerText).contains(labels['ui-usr-000'])
        //4. Check elements of Users Page
        .expect(usersPage.table.exists).ok('The "Users" table should exist')
        .expect(usersPage.roleMembershipDropdown.exists).ok('The "Role Membership" select should exist')
        .expect(usersPage.addUserButton.exists).ok('The "Add Users" button should exist')
        .expect(usersPage.resetFilter.exists).ok('The "Reset Filter" button should exist')
        .expect(usersPage.firstNameFilter.exists).ok('The "FirstName" input filter should exist')
        .expect(usersPage.lastNameFilter.exists).ok('The "LastName" input filter should exist')
        .expect(usersPage.dateFilter.exists).ok('The "Date" input filter should exist')
        .expect(usersPage.emailFilter.exists).ok('The "Email" input filter should exist')
        //5. Select Company
        .click(usersPage.roleMembershipDropdown.find('input'))
        .click(usersPage.roleMembershipDropdown.find('p').withText(company))
        .wait(5000);
    if(usersPage.editUserIcon.exists){
        await t 
            .click(usersPage.editUserIcon)
            .wait(5000);
        await t
            // Check Tabas
            .expect(usersPage.personalInfoTab.exists).ok('The "Personal Info" tab should exist')
            .expect(usersPage.membershipTab.exists).ok('The "Membership" tab should exist')
            .expect(usersPage.activityTab.exists).ok('The "Activity" tab should exist')
            // Personal Info Tab
            .expect(usersPage.usernameInput.exists).ok('The "Username" input should exist')
            .expect(usersPage.firstnameInput.exists).ok('The "First Name" input should exist')
            .expect(usersPage.middlenameInput.exists).ok('The "Middle Name" input should exist')
            .expect(usersPage.lastnameInput.exists).ok('The "Last Name" input should exist')
            .expect(usersPage.emailInput.exists).ok('The "Email" input should exist')
            .expect(usersPage.phoneInput.exists).ok('The "Phone" input should exist')
            .expect(usersPage.companyDropdown.exists).ok('The "Company" select should exist')
            .expect(usersPage.passwordExpire.exists).ok('The "Password expiration date" datepicker should exist')
            .expect(usersPage.statusDropdown.exists).ok('The "Status" select should exist')
            .expect(usersPage.saveButton.exists).ok('The "Save" button should exist')
            .expect(usersPage.cancelButton.exists).ok('The "Cancel" button should exist');
        await t
            // Click on Membership tab
            .click(usersPage.membershipTab)
            .expect(usersPage.applicationDropdown.exists).ok('The "Application" dropdown should exist')
            .expect(usersPage.role.exists).ok('The "Role" element should exist')
            .expect(usersPage.addArrow.exists).ok('The "Add" arrow should exist')
            .expect(usersPage.removeArrow.exists).ok('The "Remove" arrow should exist');
        await t
            // Click on Activity tab
            .click(usersPage.activityTab)
            .expect(usersPage.activityTable.exists).ok('The "Activity" table should exist');
    }          
});

