import { Selector } from 'testcafe';
import { timeout, checkRequests, logger} from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import MobilePage from '../../../page-models/mobilePage';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import UsersPage from '../../../page-models/platformadmin/usersPage';


process.removeAllListeners('unhandledRejection');

//Class with config parameters
const localizator = new Localizator();
//Take titles of dashboard page
const dashboardTitles = Selector('div[class=title]');
//Class with all resquest backend
const apiHandler = new APIHandler();
//Create page mobile with all parameters of mobile
const page = new MobilePage();


const args = parseArguments();
//Define category of app to want check
const category = {
	id: 100,
	name: "Platform Admin"
};

//Define fixture of testcafe
let pAdminFixture = fixture`Mobile - Level 0 DEMO - Platform Admin - UI Validations - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
    .requestHooks(logger)
    //Action before first test case
	.before( async ctx  => {
		await before();
		let apps = await apiHandler.getApps(); 
		let application = apps.find(element => element['application_id'] === 100);
        ctx.apps = apps;
        //Take of Platform Admin title
        ctx.app = application.title; 
        //Get all elements of the menu
        ctx.menues = await apiHandler.getMenues(application.menu_param);
        //Get labels values of backend
		ctx.labels = await localizator.getLabelsAsJson('ui-platf-offering-*, ui-platf-*,ui-usr-*');
    })
    //Action after last test case
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
	
test(`TC 90001: Mobile UI Validation - Users Page`, async t => {
    let usersPage = new UsersPage();
	
	await t
		//2. Go to Platform Setup - The Platform Setup page is displayed
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Check the title of the page - The title of the page is Users
		.expect(page.title.innerText).eql('Users','The "Page Title" was wrong', timeout)
		//4. Check elements of Users Page
		.expect(usersPage.table.exists).ok('The "Users" table should exist')
        .expect(usersPage.addUserButton.exists).ok('The "Add Users" button should exist')
        .wait(3000)
        //5. Click on add user button
        .click(usersPage.addUserButton)
        //6. Check elements of Add Users Page
        .wait(3000)
        .expect(usersPage.lastnameInput.exists).ok('The "Last Name" input should exist')
        .expect(usersPage.emailInput.exists).ok('The "Email" input should exist')
        //7. Click on Cancel button
        .click(usersPage.cancelButton)
        .wait(3000);
});