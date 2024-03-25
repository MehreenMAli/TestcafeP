import { Selector } from 'testcafe';
import { byID, checkLabels, timeout, longTimeout, paste, getMenu, checkRequests, logger } from './../../../utils/helperFunctions';
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

let pAdminFixture = fixture`Mobile - Level 1 - Platform Admin - Editation - Running on "${args.env.toUpperCase()}"`
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
	

test(`TC 27223: Mobile Users Edition`, async t => {
    let usersPage = new UsersPage();
    let userName = 'TEST_'+uniqueId
    let firstName = 'TC_028_'+uniqueId
    let lastName = 'TEST LAST'
    let email = 'test@test.com'
    let company = 'Corcentric'
    let firstNameEdit = 'EDIT_'+uniqueId

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
        .click(usersPage.statusDropdown.find('i'))
        .click(usersPage.statusDropdownOptions.nth(2))
        .click(usersPage.companyDropdown.find('input'))
        .click(usersPage.companyOptions.withText(company))
        .click(usersPage.saveButton)
        .click(usersPage.okButton);
    await t
        .click(usersPage.companyDropdown.find('input'))
        .click(usersPage.companyOptions.withText(company));
    
    await t.click(await usersPage.table.rows.nth(0).find('th').nth(3));
    await t.click(await usersPage.table.rows.nth(0).find('th').nth(3));

    await t.click(await usersPage.table.rows.nth(2).find('td').nth(1).find('span'))
    
    try{     
        await t
            .click(usersPage.editClientMobile)    
            .click(usersPage.firstnameInput)
            .pressKey('ctrl+a delete')
            .typeText(usersPage.firstnameInput,firstNameEdit,paste)
            .click(usersPage.saveButton)
            .click(usersPage.okButton);
        await t
            .click(usersPage.companyDropdown.find('input'))
            .click(usersPage.companyOptions.withText(company));
        
        await t.click(await usersPage.table.rows.nth(0).find('th').nth(3));
        await t.click(await usersPage.table.rows.nth(0).find('th').nth(3));
    
        await t.click(await usersPage.table.rows.nth(2).find('td').nth(1).find('span'))
        await t
                .click(usersPage.deleteClientMobile)
                .click(usersPage.modalFooter.find('button').nth(1));
    }
    catch (err){
        await t
            await t
                .click(usersPage.deleteClientMobile)
                .click(usersPage.modalFooter.find('button').nth(1));
                throw err;
    }		
});
