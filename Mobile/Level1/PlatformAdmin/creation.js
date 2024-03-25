import { Selector } from 'testcafe';
import { byID, checkLabels, timeout, longTimeout, paste, getMenu, checkRequests, logger, clickable } from './../../../utils/helperFunctions';
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
import InfoModal from '../../../page-models/infoModal';


process.removeAllListeners('unhandledRejection');

const localizator = new Localizator();
const uniqueId = Date.now().toString();
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

let pAdminFixture = fixture`Mobile - Level 1 - Platform Admin - UI Validations - Running on "${args.env.toUpperCase()}"`
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
	

test(`TC 27224: Mobile Offering Creation`, async t => {
    let platformSetup = (getMenu(t.fixtureCtx.menues,90101)).title;
    let setupPage = new SetupPage();
    let shortName = 'TEST_'+uniqueId
    let longName = 'TC_27017_'+uniqueId
    
	await t
		//2. Go to Platform Setup - The Platform Setup page is displayed
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		.click(headerPage.navBarToggler)
		//3. Click Platform Setup in the left menu - Platform Setup page is displayed
		.click(sideBarPage.items.withText(platformSetup))
		//4. Check the title of the page - The title of the page is Platform Setup
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-platf-000'],'The "Page Title" was wrong', timeout)
		//5. Click on Add Offering
        .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist',longTimeout);
    await t
        .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist',longTimeout)
        .click(setupPage.addOffering);
    await t
        .expect(setupPage.shortNameInput.exists).ok('The "Short Name" input should exist',timeout)
        .expect(setupPage.longNameInput.exists).ok('The "Long Name" input should exist')
        //6. Complete the form
        .typeText(setupPage.shortNameInput,shortName,paste)
        .typeText(setupPage.longNameInput,longName,paste)
        .wait(2000)
        .click(setupPage.saveButton)
        .click(setupPage.modaConfirmation.find('button').nth(1));
    try{
        await t
            //7. Check new Offering
            .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist')
            .expect(await setupPage.existsOffering(shortName)).ok('The new offering must be created');
        let allOffering = await apiHandler.getOffering();
        let idOffering = await setupPage.get_idOffering(shortName, allOffering.items);
        await t
            //8. Delete Offering
            .expect(await apiHandler.deleteOffering(idOffering)).ok('The new offering must be deleted')
        }
    catch (err){
            let allOffering = await apiHandler.getOffering();
            let idOffering = setupPage.get_idOffering(shortName, allOffering);
            if(idOffering > 0){
                await apiHandler.deleteOffering(idOffering);
            }
            throw err;
    }
});


test(`TC 27222: Mobile Users Creation`, async t => {
    let usersPage = new UsersPage();
    let userName = 'TEST_'+uniqueId
    let firstName = 'TC_028_'+uniqueId
    let lastName = 'TEST LAST'
    let email = 'test@test.com'

    await t
		//2. Go to Platform Setup - The Platform Setup page is displayed
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Check the title of the page - The title of the page is Users
		.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-usr-000'],'The "Page Title" was wrong', timeout)
		//4. Check elements of Users Page
		.expect(usersPage.roleMembershipDropdown.exists).ok('The "Role Membership" select should exist')
        .expect(usersPage.addUserButton.exists).ok('The "Add Users" button should exist')
        .click(usersPage.addUserButton)
        //5. Complete the form
        .typeText(usersPage.usernameInput,userName,paste)
        .typeText(usersPage.firstnameInput,firstName,paste)
        .typeText(usersPage.lastnameInput,lastName,paste)
        .typeText(usersPage.emailInput,email,paste)
        .click(usersPage.passwordExpire)
        .click(usersPage.day)
        .click(usersPage.saveButton)
        .expect(usersPage.okButton.exists).ok('The "Ok" button should exist',timeout);
    let allUsers = await apiHandler.getAllUsers();
    let idUser = await usersPage.getIdUser(userName,allUsers.items); 
        //6. Delete User
    await apiHandler.deleteUserPA(idUser);   	
});

test(`TC 27861: Mobile User Duplication`, async t =>{
    let usersPage = new UsersPage();
    let userName = 'TEST_' + uniqueId
    let firstName = 'TC_028_' + uniqueId
    let lastName = 'TEST LAST'
    let email = 'test@test.com'
    let infoModal = new InfoModal()
    await t
        //2. Go to Platform Setup - The Platform Setup page is displayed
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Check the title of the page - The title of the page is Users
        .expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-usr-000'], 'The "Page Title" was wrong', timeout)
        //4. Check elements of Users Page
        .expect(usersPage.roleMembershipDropdown.exists).ok('The "Role Membership" select should exist')
        .expect(usersPage.addUserButton.exists).ok('The "Add Users" button should exist')
        .click(usersPage.addUserButton)
        //5. Complete the form
        .typeText(usersPage.usernameInput, userName, paste)
        .typeText(usersPage.firstnameInput, firstName, paste)
        .typeText(usersPage.lastnameInput, lastName, paste)
        .typeText(usersPage.emailInput, email, paste)
        .click(usersPage.passwordExpire)
        .click(usersPage.day)
        .click(usersPage.statusDropdown.find('i'))
        .click(usersPage.statusDropdownOptions.nth(2))
    let clients = await apiHandler.getAllClients();
    let client = await usersPage.getClientSessionInfo(clients, args.env);
    try {
        await t
            .click(usersPage.saveButton, longTimeout);
        await t
            .expect(usersPage.okButton.exists).ok('The "Ok" button should exist', timeout)
            .click(usersPage.okButton);
        let users = await apiHandler.getAllUsers(client.client_id);
        await t
            .expect(await usersPage.userNotExist(users, firstName)).notOk('The new user should be created')
            .expect(usersPage.addUserButton.exists).ok('The "Add Users" button should exist');
        //Creating a user with the same data used before.
        await t    
            .click(usersPage.addUserButton)
            .typeText(usersPage.usernameInput, userName, paste)
            .typeText(usersPage.firstnameInput, firstName, paste)
            .typeText(usersPage.lastnameInput, lastName, paste)
            .typeText(usersPage.emailInput, email, paste)
            .click(usersPage.passwordExpire)
            .click(usersPage.day)
            .click(usersPage.statusDropdown.find('i'))
            .click(usersPage.statusDropdownOptions.nth(2))
            .click(usersPage.saveButton)
        await t
            .expect(infoModal.message.innerText).eql('Username is already being used by another user', 'Duplicate message error were not correctly')
            .click(infoModal.buttonClose)
            .click(usersPage.cancelButton)
        //Delete user
            .click(await usersPage.table.rows.find('td').find('span').withText(firstName))
            .click(usersPage.deleteClientMobile)
            .expect(usersPage.modalConfirm.exists).ok('Confirmation modal should be displayed')
            .click(usersPage.acceptButton);
        users = await apiHandler.getAllUsers(client.client_id);
        await t
            .expect(await usersPage.userNotExist(users, firstName)).ok('User must not exists')
    } catch (error) {
        let allUsers = await apiHandler.getAllUsers();
        let idUser = await usersPage.getIdUser(userName, allUsers.items);
        if(idUser != null) {
            await apiHandler.deleteUserPA(idUser);
        }
        throw error;
    }
});
