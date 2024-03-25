import { Selector } from 'testcafe';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import Page from './../../../page-models/page';
import { byID, checkLabels, getMenu, checkRequests, logger } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import ManageQueuePage from '../../../page-models/esupport/manageQueuePage';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';

const localizator = new Localizator();
const apiHandler  = new APIHandler();
const page = new Page();
const args = parseArguments();
const category = {
	id: 500,
	name: "eSupport"
};


let eSuppFixture = fixture`Level 0 - eSupport - UI Validations - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before(async ctx => {
		await before();
		let apps = await apiHandler.getApps();
		let application = apps.find(element => element['application_id'] === 500);
		ctx.apps = apps;
		ctx.app = application.title; //eSupport
		ctx.menues = await apiHandler.getMenues(application.menu_param);
		ctx.labels = await localizator.getLabelsAsJson('esu-que-0*');	
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

loadFixture(users[args.user],category,eSuppFixture);


test(`TC 25768: 'Manage Queue' Page`, async t => {
	let labels = t.fixtureCtx.labels;
	let menues = t.fixtureCtx.menues;
	let manageQueuePage = new ManageQueuePage();
	let tableHeaders = [labels['esu-que-011'],	// Document #
						labels['esu-que-020'],	// Document Name
						labels['esu-que-012'],	// Seller code
						labels['esu-que-013'],	// Buyer code
						labels['esu-que-014'],	// Transaction id
						labels['esu-que-015'],	// Community
						labels['esu-que-016'],	// Type
						labels['esu-que-017'],	// Date received 
						labels['esu-que-018']	// Status
					];

	await t
		//2. Go to eSupport
		.expect(byID(getMenu(menues,1201).action_key).exists).ok('The "eSupport" menu should exist')
		.wait(2000)
		//3. Check Page Title
		.expect(page.title.innerText).contains(labels['esu-que-000'])
		//4. Check labels
		.expect(manageQueuePage.labels.withText(labels['esu-que-001']).exists).ok()
		.expect(manageQueuePage.labels.withText('Filter')).ok('The "Filter" label should exist')
		//5. Check radio buttons
		.expect(manageQueuePage.allRadioButton.exists).ok('The "All" radio button should exist')
		.expect(manageQueuePage.oneDayRadioButton.exists).ok('The "One Day" radio button should exist')
		.expect(manageQueuePage.oneWeekRadioButton.exists).ok('The "One Week" radio button should exist')
		.expect(manageQueuePage.otherRadioButton.exists).ok('The "Other" radio button should exist')
		.expect(manageQueuePage.communityInput.exists).ok('The "Community" input should exist')
		//6. Check date picker
		.expect(manageQueuePage.leftDatepicker.exists).ok('The "Left date picker" input should exist')
		.expect(manageQueuePage.rightDatepicker.exists).ok('The "Right date picker" input should exist')
		//6. Check realod button
		.expect(manageQueuePage.reloadButton.exists).ok('The "Reload" button should exist')
		.wait(3000);
		//7. Check table and it's headers
	await checkLabels(manageQueuePage.tableHeaders,tableHeaders);
		if(manageQueuePage.table.find('i.fa.fa-pencil').exists){
			let manageQueuePageEdit = new ManageQueuePage();
			await t
				.click(manageQueuePage.table.find('i.fa.fa-pencil'))
				.expect(manageQueuePage.communityInput.exists).ok('The "Period" dropdown should exist')
				.expect(manageQueuePageEdit.lightBlueDiv.find('select').nth(0).exists).ok('The "Vendor" dropdown should exist')
				.expect(manageQueuePageEdit.lightBlueDiv.find('select').nth(1).exists).ok('The "Buyer" dropdown should exist')
				.expect(manageQueuePageEdit.lightBlueDiv.find('select').nth(2).exists).ok('The "Ship to location" dropdown should exist')
				.expect(manageQueuePageEdit.lightBlueDiv.find('select').nth(3).exists).ok('The "Currency" dropdown should exist')
				.expect(manageQueuePageEdit.lightBlueDiv.find('select').nth(4).exists).ok('The "Route" dropdown should exist')
				.expect(manageQueuePageEdit.lightBlueDiv.find('input').nth(0).exists).ok('The "Vendor code" input should exist')
				.expect(manageQueuePageEdit.lightBlueDiv.find('input').nth(1).exists).ok('The "Buyer code" input should exist')
				.expect(manageQueuePageEdit.lightBlueDiv.find('input').nth(2).exists).ok('The "Ship code" input should exist')
				.expect(manageQueuePageEdit.paddingDiv.find('textarea').nth(0).exists).ok('The "Vendor details" textarea should exist')
				.expect(manageQueuePageEdit.paddingDiv.find('textarea').nth(1).exists).ok('The "Buyer details" textarea should exist')
				.expect(manageQueuePageEdit.paddingDiv.find('textarea').nth(2).exists).ok('The "Ship To location details" textarea should exist')
				.expect(manageQueuePageEdit.buttonDiv.find('button').nth(0).exists).ok('The "Cancel" button should exist')
				.expect(manageQueuePageEdit.buttonDiv.find('button').nth(1).exists).ok('The "Save changes" button should exist')
				.expect(manageQueuePageEdit.buttonDiv.find('button').nth(2).exists).ok('The "Update Cross Ref & Route" button should exist')
				.expect(manageQueuePageEdit.paddingDiv.nth(1).exists).ok('The "Raw XML Transaction" div should exist');
		}
		
});
