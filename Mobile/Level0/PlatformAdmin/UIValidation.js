import { Selector } from 'testcafe';
import { byID, checkLabels, timeout, getMenu, checkRequests, logger , paste, Criteria } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import MobilePage from './../../../page-models/mobilePage';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import SideBarPage from './../../../page-models/sideBarPage';
import HeaderPage from './../../../page-models/headerPage';
import SetupPage from '../../../page-models/platformadmin/setupPage';
import UsersPage from '../../../page-models/platformadmin/usersPage';


process.removeAllListeners('unhandledRejection');

const localizator = new Localizator();
const dashboardTitles = Selector('div[class=title]');
const apiHandler = new APIHandler();
const page = new MobilePage();

const headerPage = new HeaderPage();
const sideBarPage = new SideBarPage();

const args = parseArguments();
const category = {
	id: 100,
	name: "Platform Admin"
};

let pAdminFixture = fixture`Mobile - Level 0 - Platform Admin - UI Validations - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before( async ctx  => {
		await before();
		let apps = await apiHandler.getApps(); 
		let application = apps.find(element => element['application_id'] === 100);
		ctx.apps = apps;
		ctx.app = application.title; //Platform Admin
		ctx.menues = await apiHandler.getMenues(application.menu_param);
		ctx.labels = await localizator.getLabelsAsJson('ui-platf-offering-*, ui-platf-*,ui-usr-*');
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

loadFixture(users[args.user],category,pAdminFixture);
	

test(`TC 27200: Mobile UI Validation - Platform Setup Page`, async t => {
    let platformSetup = (getMenu(t.fixtureCtx.menues,90101)).title;
    let labels = t.fixtureCtx.labels;
    let setupPage = new SetupPage();
    let tableHeaders = [labels['ui-platf-offering-003'],	// Short Name
						labels['ui-platf-offering-004']	// Long Name
                    ];
    //TODO: Se toma manual
    let tableHeadersBE = ['Name' // Name
					];
	
	//TODO: Se toma manual
	let tableActivityHeaders = ['Who',	// Who
								'Action',// Action
								'Date'// Date
					];
				
	await t
		//2. Go to Platform Setup - The Platform Setup page is displayed
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		.click(headerPage.navBarToggler)
		//3. Click Platform Setup in the left menu - Platform Setup page is displayed
		.click(sideBarPage.items.withText(platformSetup));
	await t
		//4. Check the title of the page - The title of the page is Platform Setup
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-platf-000'],'The "Page Title" was wrong', timeout)
		//5. Check elements of Page
        .expect(setupPage.table.exists).ok('The "Role" table should exist')
        .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist')
		.expect(setupPage.buttonTab.exists).ok('The "Button" tab should exist');
		
		let offeringResults = await apiHandler.getOffering();
    	if (offeringResults['total'] > 0)
        	await t.expect(await checkLabels(setupPage.tableHeaders,tableHeaders)).ok('The "Headers" table should not correct');
	await t
		//6. Check Tabs
		// Community
		.click(setupPage.buttonTab)
		.click(setupPage.buttonTabOptions.find('li').nth(1))
		// Bussines Entity
		.click(setupPage.buttonTab)
		.click(setupPage.buttonTabOptions.find('li').nth(2))
		.expect(setupPage.tableBE.exists).ok('The "Bussines Entity" table should exist')
		.expect(await checkLabels(setupPage.tableHeadersBE,tableHeadersBE)).ok('The "Headers" table should not correct')
		// Activity
		.click(setupPage.buttonTab)
		.click(setupPage.buttonTabOptions.find('li').nth(3))
		.expect(setupPage.tableActivity.exists).ok('The "Activity" table should exist')
		.expect(await checkLabels(setupPage.tableHeadersAct,tableActivityHeaders)).ok('The "Headers" table should not correct')
		//7. Check 
		// Community
		.click(setupPage.buttonTab)
		.click(setupPage.buttonTabOptions.find('li').nth(0))
		.expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist')
        .click(setupPage.addOffering)
        .expect(setupPage.shortNameInput.exists).ok('The "Short Name" input should exist')
        .expect(setupPage.longNameInput.exists).ok('The "Long Name" input should exist')
        .expect(setupPage.saveButton.exists).ok('The "Save" button should exist')
        .expect(setupPage.cancelButton.exists).ok('The "Cancel" button should exist')
        .click(setupPage.cancelButton)
        .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist');
});

test(`TC 27201: Mobile UI Validation - Users Page`, async t => {
    let labels = t.fixtureCtx.labels;
	let usersPage = new UsersPage();
	let roleMembreship = 'Corcentric';
	let tableHeaders = [labels['ui-usr-004'],	// First Name
						labels['ui-usr-005'],	// Last Name
						labels['ui-usr-014'],	// Date
						labels['ui-usr-007']	// E-Mail
					];

	await t
		//2. Go to Platform Setup - The Platform Setup page is displayed
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Check the title of the page - The title of the page is Users
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-usr-000'],'The "Page Title" was wrong', timeout)
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
		.expect(await checkLabels(usersPage.tableHeaders,tableHeaders)).ok('The "Headers" table should not correct')
		//6. Click over elements
		.click(usersPage.roleMembershipDropdown.find('input'))
		.click(usersPage.roleMembershipDropdown.find('p').withText(roleMembreship))
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
		.typeText(usersPage.usernameInput,'Test Cancel',paste)
		.expect(usersPage.saveButton.exists).ok('The "Save" button should exist')
		.expect(usersPage.cancelButton.exists).ok('The "Cancel" button should exist')
		.click(usersPage.cancelButton)
        .expect(usersPage.modalConfirm.exists).ok('The "Confirm Cancel" modal should exist')
        .expect(usersPage.acceptButton.exists).ok('The "Accept" button in modal should exist')
        .click(usersPage.acceptButton);
			
});

test(`TC 27497: Check hamb menu navigation on Platform Admin`, async t => {
	let platformSetup = (getMenu(t.fixtureCtx.menues,90101)).title;
	let users = (getMenu(t.fixtureCtx.menues,901)).title;
    await t
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//2. Go to Platform Setup - The Platform Setup page is displayed
		.click(headerPage.navBarToggler)
		.click(sideBarPage.items.withText(platformSetup))
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-platf-000'],'The "Page Title" was wrong', timeout)
		//3. Go to Users - The User page is displayed
		.click(headerPage.navBarToggler)
		.click(sideBarPage.items.withText(users))
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-usr-000'],'The "Page Title" was wrong', timeout);
});

test(`TC 27780 Mobile UI Validation - User Details Page`, async t => {
	let labels = t.fixtureCtx.labels;
	let usersPage = new UsersPage();
	let roleMembreship = 'Corcentric';
	let clients = await apiHandler.getAllClients();
	let client = await usersPage.getClientSessionInfo(clients, args.env)
	let allUsers = await apiHandler.getAllUsers(client.client_id);
	let tableHeaders = [
						labels['ui-usr-004'], 
						labels['ui-usr-005'], 
						labels['ui-usr-014'], 
						labels['ui-usr-007']
						];
	
	await t
		//2. Go to Platform Setup - The Platform Setup page is displayed			
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-usr-000'],'The "Page Title" was wrong', timeout)
		.expect(usersPage.table.exists).ok('The "Users" table should exist')
        .expect(usersPage.roleMembershipDropdown.exists).ok('The "Role Membership" select should exist')
        .expect(usersPage.addUserButton.exists).ok('The "Add Users" button should exist')
		.expect(await checkLabels(usersPage.tableHeaders,tableHeaders)).ok('The "Headers" table should not correct')
		.click(usersPage.roleMembershipDropdown.find('input'))
		//Select the company
		.click(usersPage.roleMembershipDropdown.find('p').withText(roleMembreship))
		.wait(2000);
		//the test will end if there's no users
		if(allUsers != null) {
			await t
			//Select the first user on the table
			.click(await usersPage.table.rows.nth(2).find('td').nth(1).find('span'))			
			//Select edit option
			.click(usersPage.editClientMobile);
			await t	
			//Verify personal info
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
			.click(usersPage.tabSelectorCombo)
			.expect(usersPage.tabSelectorComboOptions.exists).ok('Combo options should exists')
			//Select Mermbership option
			.click(usersPage.tabSelectorComboOptions.find('li').withText('Membership'))
			//Varify elements
			.expect(usersPage.applicationDropdown.exists).ok('Application dropdown should exists')
			.expect(usersPage.role.exists).ok('Roles tables should exists') 
			.expect(usersPage.addArrow.exists).ok('Add arrow icon should exists')
			.expect(usersPage.removeArrow.exists).ok('Remove arrow icon should exists');
			await t
			.click(usersPage.tabSelectorCombo)
			.expect(usersPage.tabSelectorComboOptions.exists).ok('Combo options should exists')
			//Select Activity option
			.click(usersPage.tabSelectorComboOptions.find('li').withText('Activity'))
			//Verify elements
			.expect(usersPage.activityTable.exists).ok('Activity table should exists');
			await t
			//Cancel the edition mode
			.click(usersPage.cancelButton);
		}
});