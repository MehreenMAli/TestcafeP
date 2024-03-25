import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import Page from './../../../page-models/page';
import { byID, getMenu, checkRequests, logger, paste, timeout} from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import { loadFixture } from '../../../tests-manager/categorization';
import UsersPage from '../../../page-models/platformadmin/usersPage';

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

test(`TC 90000: UI Validation - Users Page`, async t => {
    let menues = t.fixtureCtx.menues;
    let usersPage = new UsersPage();
	await t
		//2. Go to Users on Platform Admin
        .click(byID(getMenu(menues,901).action_key));
    await t
		//3. Check Page Title
        .expect(page.title.innerText).eql('Users','The "Page Title" was wrong', timeout)
        //4. Check elements of Users Page
        .expect(usersPage.table.exists).ok('The "Users" table should exist')
        .expect(usersPage.addUserButton.exists).ok('The "Add Users" button should exist')
        .expect(usersPage.resetFilter.exists).ok('The "Reset Filter" button should exist')
        .expect(usersPage.firstNameFilter.exists).ok('The "FirstName" input filter should exist')
        //5. Click Add user Button
        .click(usersPage.addUserButton)
        //6. Check elements of Add User page
        .expect(usersPage.firstnameInput.exists).ok('The "First Name" input should exist')
        .expect(usersPage.middlenameInput.exists).ok('The "Middle Name" input should exist')
        .expect(usersPage.lastnameInput.exists).ok('The "Last Name" input should exist')
        //7. Complete one input
        .typeText(usersPage.usernameInput,'Test Demo')
        .wait(3000);
});