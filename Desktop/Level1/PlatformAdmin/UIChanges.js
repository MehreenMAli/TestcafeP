import { Selector } from 'testcafe';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import Page from './../../../page-models/page';
import { byID, getMenu, checkRequests, logger, paste, clickable, longTimeout } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import UsersPage from '../../../page-models/platformadmin/usersPage';
import SetupPage from '../../../page-models/platformadmin/setupPage';

const localizator = new Localizator();
const uniqueId = Date.now().toString();
const apiHandler  = new APIHandler();
const page = new Page();
const args = parseArguments();
const category = {
	id: 100,
	name: "Platform Admin"
};


let pAdminFixture = fixture`Level 1 - Platform Admin - Edition - Running on"${args.env.toUpperCase()}"`
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

test(`TC 27018: 'Offering Edition`, async t => {
	let menues = t.fixtureCtx.menues;
    let setupPage = new SetupPage();
    let shortName = 'TEST_'+uniqueId;
    let longName = 'TC_27017_'+uniqueId;
    let shortNameEdit = 'EDIT_'+uniqueId;

    let newOffering = await apiHandler.addOffering(shortName,longName);
    try {
    await t
		//2. Go to Platform Setup
		.expect(byID(getMenu(menues,90101).action_key).exists).ok('The "Platform Setup" menu should exist')
        .click(byID(getMenu(menues,90101).action_key))
        .wait(5000);
    await t
        // 3. Click on edit button
        .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist')
        .expect(await setupPage.editOffering(shortName)).ok('The new offering must be exists')
        .expect(setupPage.shortNameInput.exists).ok('The "Short Name" input should exist')
        .expect(setupPage.longNameInput.exists).ok('The "Long Name" input should exist')
        // 4. Change data info
        .click(setupPage.shortNameInput)
        .pressKey('ctrl+a delete') 
        .typeText(setupPage.shortNameInput,shortNameEdit,paste)
        .wait(2000);
    await t
        .click(setupPage.saveButton)
        .click(setupPage.modaConfirmation.find('button').nth(1));
    await t
        //5. Check Offering edition
        .expect(setupPage.addOffering.exists).ok('The "Add Offering" button should exist')
        .expect(await setupPage.existsOffering(shortNameEdit)).ok('The new offering must be created')
        .wait(2000)
        //6. Delete Offering Edition
        .expect(await apiHandler.deleteOffering(newOffering.offering_id)).ok('The offering must be deleted')
    } catch(err) {
        await apiHandler.deleteOffering(newOffering.offering_id);
        throw err;
    }
    
});

test(`TC 27029: 'Users Edition`, async t => {
	let menues = t.fixtureCtx.menues;
    let usersPage = new UsersPage();
    let userName = 'TEST_'+uniqueId
    let firstName = 'TC_028_'+uniqueId
    let lastName = 'TEST LAST'
    let email = 'test@test.com'
    let company = 'Corcentric'
    let firstNameEdit = 'EDIT_'+uniqueId
    
    await t
        //2. Go to Platform Setup
        .expect(byID(getMenu(menues,901).action_key).exists).ok('The "Users" menu should exist')
        //3. Add User
        .expect(usersPage.addUserButton.exists).ok('The "Add User" button should exist');
    await t
        .click(usersPage.addUserButton)
        .typeText(usersPage.usernameInput,userName,paste)
        .typeText(usersPage.firstnameInput,firstName,paste)
        .typeText(usersPage.lastnameInput,lastName,paste)
        .typeText(usersPage.emailInput,email,paste)
        .click(usersPage.companyDropdown.find('input'))
        .click(usersPage.companyOptions.withText(company))
        .click(usersPage.passwordExpire)
        .click(usersPage.day)
        .click(usersPage.statusDropdown.find('i'))
        .expect(usersPage.statusDropdown.find('div.dropdown-options').exists).ok('the options should be displayed')
        .click(usersPage.statusDropdown.find('div.dropdown-options p').nth(2))
        .click(usersPage.saveButton)
        .wait(5000);
        let clients = await apiHandler.getAllClients();
        let client = await usersPage.getClientSessionInfo(clients, args.env);
    try{        
        await t
            .wait(5000)
            .click(await clickable(usersPage.okButton),longTimeout)
            //5. Click on Edit
            .expect(usersPage.addUserButton.exists).ok('The "Add Users" button should exist')
            .click(usersPage.companyDropdown.find('input'))
            .click(usersPage.companyOptions.withText(company))
            .click(usersPage.emailFilter)
            .typeText(usersPage.emailFilter,email,paste)
            .pressKey('enter');
        await t
            .expect(await usersPage.editUser(firstName)).ok('The new user must be created for edit')
            //6. Edit elements
            .expect(usersPage.saveButton.exists).ok('The "Add User" button should exist')
            .click(usersPage.firstnameInput)
            .pressKey('ctrl+a delete')
            .typeText(usersPage.firstnameInput,firstNameEdit,paste)
            .click(usersPage.saveButton)
            .wait(2000)
            .click(usersPage.okButton);
        try {
            await t
                //7. Check and Delete User
                .expect(usersPage.addUserButton.exists).ok('The "Add Users" button should exist')
                .click(usersPage.companyDropdown.find('input'))
                .click(usersPage.companyOptions.withText(company))
                .click(usersPage.emailFilter)
                .typeText(usersPage.emailFilter,email,paste)
                .pressKey('enter');
            await t
                .expect(await usersPage.existUser(firstNameEdit)).ok('The new user must be created')
                .expect(await usersPage.deleteUser(firstNameEdit)).ok('The new user must be deleted');
                
            } catch (err) {
                const users = await apiHandler.getAllUsers(client.client_id);
                const user = users.items.find(element => element.first_name === firstNameEdit);
                if(user != null) {
                    await apiHandler.deleteUserPA(user.user_id);  
                }
                throw err;
            }
        } catch (err) {
            const users = await apiHandler.getAllUsers(client.client_id);
            const user = users.items.find(element => element.first_name === firstName);
            if(user != null) {
                await apiHandler.deleteUserPA(user.user_id);  
            }
            throw err;
    }
    
});