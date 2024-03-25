import { Selector } from 'testcafe';
import { getCopyright, checkLabels, timeout, getMenu, insensitive, clickable, longTimeout } from './../../utils/helperFunctions';
import { parseArguments } from './../../utils/parseArguments';
import config from '../../config';
import users from '../../users';
import MobilePage from './../../page-models/mobilePage';
import HeaderPage from './../../page-models/headerPage'
import UserDropdown from './../../page-models/userDropdown'
import ChangePasswordPage from '../../page-models/changePasswordPage';
import APIHandler from '../../utils/apiHandler';
import { before, after, registerFixture } from '../../hooks';
import Localizator from '../../utils/localizator';
import MyAccountMobilePage from '../../page-models/myAccountMobilePage';
import Modal from '../../page-models/modal';
import ConfirmModal from '../../page-models/confirmModal';
import { loadFixture } from '../../tests-manager/categorization';

const localizator = new Localizator();
const dashboardTitles = Selector('div[class=title]');
const userDropdown = new UserDropdown();
const headerPage = new HeaderPage();
const page = new MobilePage();
const apiHandler  = new APIHandler();
const args = parseArguments();
const category = {
	id: 62000,
	name: "Corcentric Expense"
};

registerFixture();
let temFixture = fixture `Mobile - Level 0 - UI Validations - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.before( async ctx  => {
		await before();
		ctx.apps = await apiHandler.getApps(); 
		ctx.branding = await apiHandler.getBranding();
		ctx.labels = await localizator.getLabelsAsJson('ui-cm-005,mn-62000-04*,ui-chgpass-0*,ui-setup-0*,msg-00-002');
	})
	.after( async () => {
		await after();
	})
	.beforeEach( async () => {
		let currentUser = users[args.user];
		await page.login(currentUser.username,
						currentUser.password,
						currentUser.landingPage);
	})
	.afterEach( async () => {
        await page.logout();
	});

loadFixture(users[args.user],category,temFixture);
	
test(`TC 25081: Mobile Landing Page`, async t => {
	const copyrightSelector = Selector('#copyright');
	const apps = t.fixtureCtx.apps;
	const dropdownOptions = await apiHandler.getUserDropdown();

	const dropdownLabels = [ 	
								getMenu(dropdownOptions, 401).title, //Change password
								getMenu(dropdownOptions, 406).title, //Setup
								getMenu(dropdownOptions, 405).title  //Logout
								
	];
	let copyright = getCopyright(await apiHandler.getBranding());
    copyright = copyright.replace('  ', ' ');

	await t
		//2. Check the Page Title
		//.expect(page.title.innerText).eql(t.fixtureCtx.labels['ui-cm-005'])
		//3. Check the Corcentric Logo
		.expect(headerPage.logoIcon.exists).ok('The "Logo" icon should exist')
		//4. Check the User dropdown
		.expect(userDropdown.image.exists).ok('The logged user image should exist')
		.click(userDropdown.image)
		//4b. The user dropdown should be displayed at the top right corner of the page
		.expect(await checkLabels(userDropdown.items,dropdownLabels)).ok()
		//5. Check the App list
		.expect(await checkLabels(apps,dashboardTitles,'title')).ok()
		//6. Check the Copyright Footer
		.expect(copyrightSelector.innerText).contains(copyright); //From footer
});

test(`TC 25083: Mobile Logged user menu`, async t => {
	const labels = t.fixtureCtx.labels;

	await t
		.expect(userDropdown.image.exists).ok('The logged user image should be displayed')
		.click(userDropdown.image)
		.click(userDropdown.changePassword)
		.expect(page.title.innerText).match(insensitive(labels['ui-chgpass-000']),'The "Page Title" was wrong', timeout)
		.click(userDropdown.root)
		.click(userDropdown.myAccount)
		.expect(page.title.innerText).eql(labels['ui-setup-000'],'The "Page Title" was wrong', timeout);
});

test(`TC 25223: Mobile 'Change Password' Page`, async t => {
	let labels = t.fixtureCtx.labels;
	let changePasswordPage = new ChangePasswordPage();
	let requiredField = t.fixtureCtx.labels['msg-00-002'];
	let requiredCaptcha = Selector('div').withText(t.fixtureCtx.labels['ui-chgpass-007']);
	let passwordLabels=[labels['ui-chgpass-009'],//Minimum password length is 8 characters
						labels['ui-chgpass-010'],//Maximum password length is 15 characters
						labels['ui-chgpass-011'],//Password must contain at least one uppercase letter (A-Z)
						labels['ui-chgpass-012'],//Password must contain at least one lower case letter (a-z)
						labels['ui-chgpass-013'],//Password must contain at least one special character (example, ! % $ # ?)
						labels['ui-chgpass-014']];//Password must contain one number
	await t
		//2. Open the User dropdown
		.click(userDropdown.image)
		.expect(userDropdown.changePassword.exists).ok('The Change Password must be appear', longTimeout);
		//3. Click on the "Change Password" item
	await t
		.click(await clickable(userDropdown.changePassword))
		//4. Check the Title
		.expect(page.title.innerText).match(insensitive(labels['ui-chgpass-000']),'The "Page Title" was wrong', timeout)
		//5. Check the page elements
		.expect(changePasswordPage.oldPasswordInput.exists).ok('The "Old password" input should exist')
        .expect(changePasswordPage.newPasswordInput.exists).ok('The "New password" input should exist')
        .expect(changePasswordPage.repeatNewPasswordInput.exists).ok('The "Repeat new password" input should exist')
        .expect(changePasswordPage.recaptcha.exists).ok('The recaptcha should exist')
        .expect(changePasswordPage.cancelButton.exists).ok('The "Cancel" button should exist')
		.expect(changePasswordPage.saveButton.exists).ok('The "Save" button should exist')
		.click(changePasswordPage.saveButton)
		.expect(changePasswordPage.oldPasswordInput.error.innerText).contains(requiredField,'Should display "Required field"')
        .expect(changePasswordPage.newPasswordInput.error.innerText).contains(requiredField,'Should display "Required field"')
		.expect(changePasswordPage.repeatNewPasswordInput.error.innerText).contains(requiredField,'Should display "Required field"')
		.expect(requiredCaptcha.exists).ok('Should display "Required captcha"');
		//6. Check the password policies
		await t.expect(await checkLabels(changePasswordPage.legends,passwordLabels)).ok();
});
