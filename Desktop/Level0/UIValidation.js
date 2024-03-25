import { Selector } from 'testcafe';
import { byID, getCopyright, timeout, getMenu, insensitive, checkLabels, checkRequests, logger } from './../../utils/helperFunctions';
import { parseArguments } from './../../utils/parseArguments';
import { before, after, registerFixture } from './../../hooks';
import users from '../../users';
import config from '../../config';
import Page from './../../page-models/page';
import ChangePasswordPage from '../../page-models/changePasswordPage';
import MyAccountPage from '../../page-models/myAccountPage';
import UserDropdown from '../../page-models/userDropdown';
import SideBarPage from '../../page-models/sideBarPage';
import HeaderPage from '../../page-models/headerPage';
import APIHandler from '../../utils/apiHandler';
import Localizator from '../../utils/localizator';

const localizator = new Localizator();
const dashboardTitles = Selector('div[class=title]');
const userDropdown = new UserDropdown();
const myAccountPage = new MyAccountPage();
const sideBarPage = new SideBarPage();
const headerPage = new HeaderPage();
const page = new Page();
const args = parseArguments();
const apiHandler = new APIHandler();

registerFixture();
fixture `Level 0 - UI Validations - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before( async ctx  => {
		await before();
		let apps = await apiHandler.getApps();
		let application = apps.find(element => element['application_id'] === 63000);
		ctx.app = application.title; //ePayment
		ctx.menues = await apiHandler.getMenues(application.menu_param);
		ctx.labels = await localizator.getLabelsAsJson('ui-pay-*,ui-chgpass-0*,ui-oood-000,ui-proxy-000,ui-setup-0*,msg-00-002,ui-chgpass-007');
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
		await checkRequests(logger.requests);	
	});
	
test(`TC 24151: Landing Page`, async t => {
	let profile = await apiHandler.getMyProfile();
	let name = `${profile.first_name} ${profile.middle_name} ${profile.last_name}`;
	let label = t.fixtureCtx.labels['ui-pay-000'];
	let menues = t.fixtureCtx.menues;
	let payments = byID(getMenu(menues,201).action_key);
	let clients = byID(getMenu(menues,202).action_key);
	let paymentAccount = byID(getMenu(menues,203).action_key);
	let bankSetup = byID(getMenu(menues,204).action_key);
	let copyright = getCopyright(await apiHandler.getBranding());
    copyright = copyright.replace('  ', ' ');
    

	await t
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		.expect(page.title.innerText).match(insensitive(label),'The "Page Title" was wrong', timeout)
		.expect(headerPage.logoIcon.exists).ok('The Header Logo Icon should exist')
		.expect(headerPage.hambMenu.exists).ok('The Header Hamb Menu should exist')
		.expect(userDropdown.image.exists).ok('The User Dropdown image should exist')
		.expect(userDropdown.userName.innerText).contains(name)
		.expect(payments.exists).ok('The "Payments" menu should exist')
		.expect(clients.exists).ok('The "Clients" menu should exist')
		.expect(paymentAccount.exists).ok('The "Payment Account" menu should exist')
		.expect(bankSetup.exists).ok('The "Bank Setup" menu should exist')
		.expect(sideBarPage.copyright.innerText).contains(copyright);
});

test(`TC 24184: Logged User Menu`, async t => {
	let labels = t.fixtureCtx.labels;
	
	await t
		//2. Click on the dropdown next to the avatar image
		.click(userDropdown.toggle)
		//3. Click on "Change Password"
		.click(userDropdown.changePassword)
		.expect(page.title.innerText).match(insensitive(labels['ui-chgpass-000']),'The "Page Title" was wrong', timeout)
		//4. Click on the dropdown next to the avatar image
		.click(userDropdown.toggle)
		//5. Click on "My Account"
		.click(userDropdown.myAccount)
		.expect(page.title.innerText).eql(labels['ui-setup-000'],'The "Page Title" was wrong', timeout);
});

test(`TC 25102: 'My Account' Page`, async t => {
	let labels = t.fixtureCtx.labels;
	
	//2. Click on Userdropdown
	await t
		.click(userDropdown.toggle)
		
	//3. Click on "My Account"
		.click(userDropdown.myAccount)
		
	//4. Check Page Title
		.expect(page.title.innerText).match(insensitive(labels['ui-setup-000']),'The "Page Title" was wrong', timeout)
		
	//5. Check Page Elements:
		.expect(myAccountPage.saveButton.exists).ok('The "Save" button should exist')
		.expect(myAccountPage.cancelButton.exists).ok('The "Cancel" button should exist')
		.expect(myAccountPage.personalInfoTab.exists).ok('The "Personal Info" tab should exist')
		.expect(myAccountPage.usernameInput.exists).ok('The "Username" input should exist')
		.expect(myAccountPage.firstnameInput.exists).ok('The "Firstname" input should exist')
		.expect(myAccountPage.middlenameInput.exists).ok('The "Middlename" input should exist')
		.expect(myAccountPage.lastnameInput.exists).ok('The "Lastname" input should exist')
		.expect(myAccountPage.titleInput.exists).ok('The "Title" input should exist')
		.expect(myAccountPage.phoneNumberInput.exists).ok('The "Phone Number" input should exist')
		.expect(myAccountPage.emailInput.exists).ok('The "Email" input should exist')
		.expect(myAccountPage.uploadFileInput.exists).ok('The "Upload File" input should exist')
		.expect(myAccountPage.resetPasswordButton.exists).ok('The "Reset Password" input should exist')
		.expect(myAccountPage.profileLanguageTab.exists).ok('The "Profile Language" tab should exist')
		
	//8. Click on the "Language" tab
		.click(myAccountPage.profileLanguageTab)
		
	//9. Check Page Elements
		.expect(myAccountPage.label.withText(insensitive(labels['ui-setup-003'])).exists).ok('The dropdown label is not correct')
		.expect(myAccountPage.languageDropdown.exists).ok('The "Language" dropdown should exist')
		.click(myAccountPage.languageDropdown);
	let preferredLanguages = await apiHandler.getPreferredLanguages();
	await t
		.expect(await checkLabels(myAccountPage.dropdownOptions,preferredLanguages,'language_name')).ok('Preferred Languages options are not correct')
		.expect(myAccountPage.profileNotificationsTab.exists).ok('The "Profile Notifications" tab should exist');
		
	//10. Click on the "Notifications" tab
	let notifications = await apiHandler.getNotificationTypes();
	let deliveryTypes = await apiHandler.getDeliveryTypes();
	let notificationHeaders = [
		labels['ui-setup-021'], // Notification
		labels['ui-setup-022']  // Delivery Type
	];
	await t.click(myAccountPage.profileNotificationsTab)
	await t
		.expect(await checkLabels(myAccountPage.notificationsTable.headers,notificationHeaders)).ok('Notification Table headers are not correct')
		.expect(await checkLabels(myAccountPage.notificationsTable.cells,notifications,'notification_type_name')).ok('Notifications were not displayed correctly');
	let firstDeliveryOptions = myAccountPage.notificationsTable.rows.nth(1).find('td').nth(1).find('.dropdown-option');
	await t.click(myAccountPage.notificationsTable.rows.nth(1).find('td').nth(1).find('input'));
	await t.expect(await checkLabels(firstDeliveryOptions,deliveryTypes,'delivery_type_name')).ok('Delivery Type options were not displayed correctly')
	
	//11. Check Page Elements
		.expect(myAccountPage.profileActivityTab.exists).ok('The "Profile Activity" tab should exist')
		
	//12. Click on the "Activity" tab
		.click(myAccountPage.profileActivityTab)
		
	//13. Check Page Elements
		.expect(myAccountPage.profileActivityTable.exists).ok('The "Profile Activity" table grid should exist', timeout);
});

test(`TC 25202: 'Change Password' Page`, async t => {
	let labels = t.fixtureCtx.labels;
	let requiredField = t.fixtureCtx.labels['msg-00-002'];
	let requiredCaptcha = Selector('div').withText(t.fixtureCtx.labels['ui-chgpass-007']);
	let changePasswordPage = new ChangePasswordPage();
	let passwordLabels=[labels['ui-chgpass-009'],//Minimum password length is 8 characters
						labels['ui-chgpass-010'],//Maximum password length is 15 characters
						labels['ui-chgpass-011'],//Password must contain at least one uppercase letter (A-Z)
						labels['ui-chgpass-012'],//Password must contain at least one lower case letter (a-z)
						labels['ui-chgpass-013'],//Password must contain at least one special character (example, ! % $ # ?)
						labels['ui-chgpass-014']];//Password must contain one number
	await t
		//2. Open the User dropdown
		.click(userDropdown.toggle)
		//3. Click on the "Change Password" item
		.click(userDropdown.changePassword)
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
		.expect(requiredCaptcha.exists).ok('Should display "Required captcha"')
		//6. Check the password policies
		.expect(await checkLabels(changePasswordPage.legends,passwordLabels)).ok();
});
