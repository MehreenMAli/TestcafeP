import { Selector } from 'testcafe';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import Page from './../../../page-models/page';
import { byID, getMenu, checkRequests, logger, paste, timeout, longTimeout, clickable } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import UsersPage from '../../../page-models/platformadmin/usersPage';
import SetupPage from '../../../page-models/platformadmin/setupPage';
import InfoModal from '../../../page-models/infoModal';

const localizator = new Localizator();
const uniqueId = Date.now().toString();
const apiHandler  = new APIHandler();
const page = new Page();
const args = parseArguments();
const category = {
	id: 100,
	name: "Platform Admin"
};


let pAdminFixture = fixture`Level 1 - Platform Admin - Creation - Running on"${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before(async ctx => {
		await before();
		let apps = await apiHandler.getApps();
		let application = apps.find(element => element['application_id'] === 100);
		ctx.apps = apps;
		ctx.app = application.title; //Platform Admin
		ctx.menues = await apiHandler.getMenues(application.menu_param);
		ctx.labels = await localizator.getLabelsAsJson('ui-usr-*,ui-platf-offering-*');	
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

test(`TC 27017: 'Offering Creation`, async t => {
	let menues = t.fixtureCtx.menues;
    let setupPage = new SetupPage();
    let shortName = 'TEST_'+uniqueId
    let longName = 'TC_27017_'+uniqueId

    await t
		//2. Go to Platform Setup
		.expect(byID(getMenu(menues,90101).action_key).exists).ok('The "Platform Setup" menu should exist')
        .click(byID(getMenu(menues,90101).action_key))
        //3. Click on Add Offering
        .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist',longTimeout);
    await t
        .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist',longTimeout)
        .click(setupPage.addOffering)
        .expect(setupPage.shortNameInput.exists).ok('The "Short Name" input should exist',timeout)
        .expect(setupPage.longNameInput.exists).ok('The "Long Name" input should exist')
        //4. Complete the form
        .typeText(setupPage.shortNameInput,shortName,paste)
        .typeText(setupPage.longNameInput,longName,paste)
        .wait(2000)
        .click(setupPage.saveButton)
        .click(setupPage.modaConfirmation.find('button').nth(1));
        let offerings = await  apiHandler.getAllOfferings();
    try {
    await t
        //5. Check new Offering
        .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist')
        .expect(await setupPage.existsOffering(shortName)).ok('The new offering must be created');
    await t
        //6. Delete Offering
        .expect(await setupPage.deleteOffering(shortName)).ok('The new offering must be deleted')
        //7. Check new Offering Deleted
        .expect(await setupPage.existsOffering(shortName)).notOk('The new offering must be deleted');
    } catch(err) {
        let offering = offerings.items.find(element => element.offering_short_name == shortName)
        if(offering != null){
           await apiHandler.deleteOffering(offering.offering_id);
        }
        throw err;
    }
});

test(`TC 27028: 'Users Creation`, async t => {
	let menues = t.fixtureCtx.menues;
    let usersPage = new UsersPage();
    let userName = 'TEST_'+uniqueId;
    let firstName = 'TC_028_'+uniqueId;
    let lastName = 'TEST LAST';
    let email = 'test@test.com';

    await t
		//2. Go to Platform Setup
		.expect(byID(getMenu(menues,901).action_key).exists).ok('The "Users" menu should exist')
        //3. Click on Add User
        .expect(usersPage.addUserButton.exists).ok('The "Add User" button should exist');
    await t
        .click(usersPage.addUserButton)
        .expect(usersPage.usernameInput.exists).ok('The "Username" input should exist',timeout)
        .expect(usersPage.firstnameInput.exists).ok('The "First Name" input should exist')
        //4. Complete the form
        .typeText(usersPage.usernameInput,userName,paste)
        .typeText(usersPage.firstnameInput,firstName,paste)
        .typeText(usersPage.lastnameInput,lastName,paste)
        .typeText(usersPage.emailInput,email,paste)
        .click(usersPage.passwordExpire)
        .click(usersPage.day)
        .click(usersPage.statusDropdown.find('i'))
        .expect(usersPage.statusDropdown.find('div.dropdown-options').exists).ok('the options should be displayed')
        .click(usersPage.statusDropdown.find('div.dropdown-options p').nth(2))
        .click(usersPage.saveButton)
        .expect(usersPage.okButton.exists).ok('The "Ok" button should exist',timeout)
        .wait(2000)
        .click(await clickable(usersPage.okButton),longTimeout);
        let clients = await apiHandler.getAllClients();
        let client = await usersPage.getClientSessionInfo(clients, args.env)
    try{  
    await t
        //5. Check new User
        .expect(usersPage.addUserButton.exists).ok('The "Add Users" button should exist')
        .wait(1500)
        .expect(await usersPage.existUser(firstName)).ok('The new user must be created');
    await t
        //6. Delete User
        .expect(await usersPage.deleteUser(firstName)).ok('The new user must be deleted');
        let allUsers = await apiHandler.getAllUsers(client.client_id);
        //7. Check
        await t
        .expect(await usersPage.userNotExist(allUsers, firstName)).ok('The new user must be deleted');
    }
    catch (err){
        const users = await apiHandler.getAllUsers(client.client_id);
        const user = users.items.find(element => element.first_name === firstName);
        if(user != null){
            await apiHandler.deleteUserPA(user.user_id);
        }
        throw err;
    }
    
});


test(`TC 27381: 'Duplication User`, async t => {
	let menues = t.fixtureCtx.menues;
    let usersPage = new UsersPage();
    let userName = 'TEST_'+uniqueId
    let firstName = 'TC_'+uniqueId
    let lastName = 'TEST'
    let email = 'qa@test.com'
    let infoModal = new InfoModal();

    await t
		//2. Go to Platform Setup
		.expect(byID(getMenu(menues,901).action_key).exists).ok('The "Users" menu should exist',longTimeout)
        //3. Click on Add User
        .expect(usersPage.addUserButton.exists).ok('The "Add User" button should exist');
    await t
        .click(usersPage.addUserButton)
        .expect(usersPage.usernameInput.exists).ok('The "Username" input should exist',timeout)
        .expect(usersPage.firstnameInput.exists).ok('The "First Name" input should exist')
        //4. Complete the form
        .typeText(usersPage.usernameInput,userName,paste)
        .typeText(usersPage.firstnameInput,firstName,paste)
        .typeText(usersPage.lastnameInput,lastName,paste)
        .typeText(usersPage.emailInput,email,paste)
        .click(usersPage.passwordExpire)
        .click(usersPage.day)
        .click(usersPage.statusDropdown.find('i'))
        .expect(usersPage.statusDropdown.find('div.dropdown-options').exists).ok('the options should be displayed')
        .click(usersPage.statusDropdown.find('div.dropdown-options p').nth(2))
        .click(usersPage.saveButton)
        .expect(usersPage.okButton.exists).ok('The "Ok" button should exist',timeout);
    await t
        .click(await clickable(usersPage.okButton),longTimeout);
        let clients = await apiHandler.getAllClients();
        let client = await usersPage.getClientSessionInfo(clients, args.env);
    try{
    await t
        //5. Duplicate user
        .click(usersPage.addUserButton)
        .expect(usersPage.usernameInput.exists).ok('The "Username" input should exist',timeout)
        .expect(usersPage.firstnameInput.exists).ok('The "First Name" input should exist')
        //4. Complete the form
        .typeText(usersPage.usernameInput,userName,paste)
        .typeText(usersPage.firstnameInput,firstName,paste)
        .typeText(usersPage.lastnameInput,lastName,paste)
        .typeText(usersPage.emailInput,email,paste)
        .click(usersPage.passwordExpire)
        .click(usersPage.day)
        .click(usersPage.statusDropdown.find('i'))
        .expect(usersPage.statusDropdown.find('div.dropdown-options').exists).ok('the options should be displayed')
        .click(usersPage.statusDropdown.find('div.dropdown-options p').nth(2))
        .click(usersPage.saveButton)
        .wait(5000)
        .expect(infoModal.message.innerText).eql('Username is already being used by another user','Duplicate message error were not correctly')
        .click(infoModal.closeButton)
        .click(usersPage.cancelButton).wait(1000);
    await t
        //6. Delete User
        .wait(5000)
        .expect(await usersPage.deleteUser(firstName)).ok('The new user must be deleted')
        //7. Check
        .wait(5000);
        let allUsers = await apiHandler.getAllUsers(client.client_id);
        await t
        .expect(await usersPage.userNotExist(allUsers, firstName)).ok('The new user must be deleted');
    }
    catch (err){
        const users = await apiHandler.getAllUsers(client.client_id);
        const user = users.items.find(element => element.first_name === firstName);
        if(user != null){
            await apiHandler.deleteUserPA(user.user_id);
        }
        throw err;
    }  
});
