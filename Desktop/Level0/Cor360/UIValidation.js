import { Selector } from 'testcafe';
import { byID, getCopyright, timeout, getMenu, checkLabels, insensitive, toDateString, longTimeout } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import Page from './../../../page-models/page';
import UserDropdown from '../../../page-models/userDropdown';
import SideBarPage from '../../../page-models/sideBarPage';
import HeaderPage from '../../../page-models/headerPage';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import RecurringInvoicePage from '../../../page-models/cor360/recurringInvoicePage';
import IndexingInboxPage from '../../../page-models/cor360/indexingInboxPage';
import InfoModal from '../../../page-models/infoModal';

const page = new Page();
const apiHandler = new APIHandler();
const localizator = new Localizator();
const dashboardTitles = Selector('div[class=title]');
const userDropdown = new UserDropdown();
const sideBarPage = new SideBarPage();
const headerPage = new HeaderPage();
const args = parseArguments();
const category = {
	id: 60360,
	name: "Cor360"
};

let cor360Fixture = fixture`Level 0 - Cor360 UI Validations - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.before( async ctx  => {
		await before();
		let apps = await apiHandler.getApps();
		let application = apps.find(element => element['application_id'] === 60360);
		let menues = await apiHandler.getMenues(application.menu_param);
		ctx.apps = apps;
		ctx.app = application.title; //Cor360
		ctx.menues = menues;
		
		ctx.newMenu =await getMenu(menues,3611);
		ctx.recurringInvoice =await getMenu(ctx.newMenu.submenu,361101);
		ctx.indexingMenu = await getMenu(menues,3610);
		ctx.labels = await localizator.getLabelsAsJson('cor360-ri-*,cor360-in-*');
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
	});

loadFixture(users[args.user],category,cor360Fixture);


test(`TC 27186: Cor 360 - Recurring Invoice Page`, async t => {
	let labels = t.fixtureCtx.labels;
	let recurringInvoicePage = new RecurringInvoicePage();

	let tablesHeaders = [
        labels['cor360-ri-030'], //Name
        labels['cor360-ri-031'], //PO #
        labels['cor360-ri-032'], //Vendor # / Name
		labels['cor360-ri-033'], //Frequency
		labels['cor360-ri-034'], //Remaining Payment
        labels['cor360-ri-035'], //Create Date
        labels['cor360-ri-036'], //Prev. Payment Date
		labels['cor360-ri-037'], //Next Payment Date
		labels['cor360-ri-038'], //Final Payment Date
        labels['cor360-ri-039'], //PO Amount ($)
        labels['cor360-ri-040'], //Payment Amount ($)
		labels['cor360-ri-041'] //Remaining Amount ($)
		
    ];

	await t
		//2. Go to Cor360
		//3. Click the "New" > "Recurring Invoice" menu on the left
		.expect(byID(t.fixtureCtx.newMenu.action_key).exists).ok('New menu option should exist')
		.hover(byID(t.fixtureCtx.newMenu.action_key)).click(byID(t.fixtureCtx.newMenu.action_key), longTimeout)
		.hover(byID(t.fixtureCtx.recurringInvoice.action_key)).click(byID(t.fixtureCtx.recurringInvoice.action_key), longTimeout)
		.wait(2000)
		.expect(recurringInvoicePage.title.withText(labels['cor360-ri-000']).exists).ok('The "Title" page should exist')
		.expect(recurringInvoicePage.title.exists).ok('The "Title" page should exist')
		//4. Check Tabls and buttons
		.expect(recurringInvoicePage.allTab.exists).ok('The "All" tab should exist')
		.expect(recurringInvoicePage.nonPOBased.exists).ok('The "Non PO Based" tab should exist')
		.expect(recurringInvoicePage.poBased.exists).ok('The "PO Based" tab should exist')

		.expect(recurringInvoicePage.addInvoice.exists).ok('The "Add" button should exist')
		.expect(recurringInvoicePage.exportExcel.exists).ok('The "Export Excel" button should exist');
	await t
		//5. Check tables
		.click(recurringInvoicePage.allTab)
		.expect(recurringInvoicePage.tableAll.exists).ok('The "All" table should exist',longTimeout)
		.expect(await checkLabels(recurringInvoicePage.tableAllHeaders,tablesHeaders)).ok('The heardes of the table must be correct')
		.click(recurringInvoicePage.nonPOBased)
		.expect(recurringInvoicePage.tableNonP.exists).ok('The "Non PO Based" table should exist',longTimeout)
		.expect(await checkLabels(recurringInvoicePage.tableNonPoHeaders,tablesHeaders)).ok('The heardes of the table must be correct')
		.click(recurringInvoicePage.poBased)
		.expect(recurringInvoicePage.tablePo.exists).ok('The "PO Based" table should exist',longTimeout)
		.expect(await checkLabels(recurringInvoicePage.tablePOHeaders,tablesHeaders)).ok('The heardes of the table must be correct');
		
});

test(`TC 27191: UI Validation - Indexing Inbox Page`, async t => {
	let labels = t.fixtureCtx.labels;
	let indexingInbox = await getMenu(t.fixtureCtx.indexingMenu.submenu,361001);
	let indexingInboxPage = new IndexingInboxPage(); 

	let headers = [
		labels['cor360-in-001'], // Batch ID
		labels['cor360-in-002'], // Entity
		labels['cor360-in-003'], // Batch Type
		labels['cor360-in-004'], // Document Type
		labels['cor360-in-005'], // Status
		labels['cor360-in-006'], // Pages
		labels['cor360-in-007'], // Comments 
		labels['cor360-in-008'], // Batch Source
		labels['cor360-in-009'], // Batch State
		labels['cor360-in-010']  // Time in Queue
	];

	//2. Click on Indexing -> Inbox
	await t
		.click(byID(t.fixtureCtx.indexingMenu.action_key))
		.click(byID(indexingInbox.action_key))
	
	//3. Check Page Title
		.expect(page.title.innerText).match(insensitive(labels['cor360-in-000']),'The page title was not displayed')
	
	//4. Check Page Elements
		//.expect(indexingInboxPage.onlineIndexingButton.exists).ok('Online Indexing button was not displayed') TODO wait for develop.
		.expect(indexingInboxPage.table.exists).ok('Table was not displayed');

	//5. Check Inbox table headers
	await t
		.expect(await checkLabels(indexingInboxPage.table.headers,headers)).ok('Table headers were not displayed correctly')

	//6. Click Online Indexing button
		//.click(indexingInboxPage.onlineIndexingButton)
});

test(`TC 27193: UI Validation - Indexing Inbox View Details`, async t => {
	let labels = t.fixtureCtx.labels;
	let indexingInbox = await getMenu(t.fixtureCtx.indexingMenu.submenu,361001);
	let indexingInboxPage = new IndexingInboxPage(); 
	let indexingInboxItems = (await apiHandler.getIndexingInboxItems()).items;
	let viewModal = new InfoModal();

	//2. Click on Indexing -> Inbox
	await t
		.click(byID(t.fixtureCtx.indexingMenu.action_key))
		.click(byID(indexingInbox.action_key));

	//3. Click View Details icon on first document
	let showContent = (content) => {
		if(content) 
			return ` ${content}`;
		else 
			return "";
	}
	let firstItem = indexingInboxItems[0];
	await t
		.click(indexingInboxPage.viewIcon.nth(0))
		.expect(viewModal.header.find('.modal-title').innerText).match(insensitive(labels['cor360-in-011']),'View Modal title was not correctly displayed')

	//4. Check Details modal elements
		.expect(viewModal.body.find('p b').withText(`Details for Indexing Batch${showContent(firstItem.batch_id)}`)).ok()
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-001']}:${showContent(firstItem.batch_id)}`).exists).ok(`${labels['cor360-in-001']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-005']}:${showContent(firstItem.status_name)}`).exists).ok(`${labels['cor360-in-005']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-009']}:${showContent(firstItem.batch_state_name)}`).exists).ok(`${labels['cor360-in-009']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-002']}:${showContent(firstItem.entity_name)}`).exists).ok(`${labels['cor360-in-002']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-003']}:${showContent(firstItem.batch_type_name)}`).exists).ok(`${labels['cor360-in-003']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-004']}:${showContent(firstItem.document_type_name)}`).exists).ok(`${labels['cor360-in-004']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-007']}:${showContent(firstItem.comments)}`).exists).ok(`${labels['cor360-in-007']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-006']}:${showContent(firstItem.page_count)}`).exists).ok(`${labels['cor360-in-006']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-014']}:${showContent(firstItem.indexer)}`).exists).ok(`${labels['cor360-in-014']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-015']}:${showContent(toDateString(firstItem.assign_date))}`).exists).ok(`${labels['cor360-in-015']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-016']}:${showContent(firstItem.route_from_user)}`).exists).ok(`${labels['cor360-in-016']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-017']}:${showContent(toDateString(firstItem.route_date))}`).exists).ok(`${labels['cor360-in-017']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-018']}:${showContent(toDateString(firstItem.start_work_date))}`).exists).ok(`${labels['cor360-in-018']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-019']}:${showContent(toDateString(firstItem.pend_date))}`).exists).ok(`${labels['cor360-in-019']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-020']}:${showContent(firstItem.batch_source)}`).exists).ok(`${labels['cor360-in-020']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-021']}:${showContent(firstItem.source_type_name)}`).exists).ok(`${labels['cor360-in-021']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-022']}:${showContent(toDateString(firstItem.source_date))}`).exists).ok(`${labels['cor360-in-022']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-023']}:${showContent(firstItem.box_number)}`).exists).ok(`${labels['cor360-in-023']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-024']}:${showContent(firstItem.cor360_batch_number)}`).exists).ok(`${labels['cor360-in-024']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-025']}:${showContent(firstItem.original_user_name)}`).exists).ok(`${labels['cor360-in-025']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-026']}:${showContent(toDateString(firstItem.queue_date))}`).exists).ok(`${labels['cor360-in-026']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-027']}:${showContent(firstItem.update_user_name)}`).exists).ok(`${labels['cor360-in-027']} field was not correctly displayed`)
		.expect(viewModal.body.find('p').withText(`${labels['cor360-in-028']}:${showContent(toDateString(firstItem.update_date))}`).exists).ok(`${labels['cor360-in-028']} field was not correctly displayed`);
});

/*	
test(`TC 25439: Cor360 "Dashboard" Page`, async t => {
	let menues = t.fixtureCtx.menues;
	let copyright = getCopyright(await apiHandler.getBranding());
	let profile = await apiHandler.getMyProfile();

	await t
		//2. Go to Cor360
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Check Page Title
		//.expect(page.title.innerText).match(insensitive(labels['ui-cte-000']),'The "Page Title" was wrong',timeout)
		//4. Check the Page Buttons
		//Not finished
		//5. Check Headers 
		.expect(headerPage.logoIcon.exists).ok('The Header Logo Icon should exist')
		.expect(headerPage.hambMenu.exists).ok('The Header Hamb Menu should exist')
		//6. Check the User dropdown
		.expect(userDropdown.image.exists).ok('The User Dropdown image should exist')
		.expect(userDropdown.userName.innerText).eql(profile.user_name)
		//7. Check Left menu - Nine options are displayed and the Copyright message
		.expect(byID(getMenu(menues,3602).action_key).exists).ok('The "Inbox" menu should exist')
		.expect(byID(getMenu(menues,3603).action_key).exists).ok('The "Check Request" menu should exist')
		.expect(byID(getMenu(menues,3604).action_key).exists).ok('The "Online Invoice" menu should exist')
		.expect(byID(getMenu(menues,3605).action_key).exists).ok('The "Adjustment Form" menu should exist')
		.expect(byID(getMenu(menues,3606).action_key).exists).ok('The "PO Requisition" menu should exist')
		.expect(byID(getMenu(menues,3607).action_key).exists).ok('The "Workflow" menu should exist')
		.expect(byID(getMenu(menues,3608).action_key).exists).ok('The "Barcodes" menu should exist')
		.expect(byID(getMenu(menues,3609).action_key).exists).ok('The "Reports" menu should exist')
		.expect(sideBarPage.copyright.innerText).contains(copyright);
});

test(`TC 25471: Cor360 "Inbox" Page`, async t => {
	let menues = t.fixtureCtx.menues;

	await t
		//2. Go to Cor360
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Click the "Inbox" menu on the left
		.click(byID(getMenu(menues,3602).action_key))
		//4. Check Page Title - The Title is "Inbox"
		.expect(page.title.innerText).eql("Inbox",'The "Page Title" was wrong',timeout);
		//5. Check the Buttons
		//The page has the following elements at the top: "Begin Working", "Mass Decline", "Export to Excel", "Download" and "Filter" buttons
		//6. Click on "Export to Excel" button
		//A new window is displayed with Export options: "All Sections", "New Documents", "Pended", "CC'd" and "Unassigned"
		//7. Close the submenu and click on the "Download" button
		//The window with the Export options is closed and a new window is displayed with a list with documents "Available to download" and documents "Queued for Processing"
		//8. Close the window and click on the "Filter" button
		//A Filter modal is displayed with the following elements: A "Filter by activity" dropdown, a "Page Size" dropdown, a "Filter by section" dropdown, and a "Filter by" dropdown
		//9. Check the Filter by activity dropdown
		//According to the logged user permissions, the filter might have the following options: "All Invoice Activities", "All PO Activities", "All Activities", "Invoice Processing - AP Exception", "Invoice Processing - Initial Approval", "Invoice Processing - Final Approval", "PO Workflow - PO Initial Approval", "PO Workflow - PO Final Approval", "PO Workflow - Waiting" and "PO Workflow - Review"
		//10. Check the Page Size dropdown
		//The dropdown has the following options: "5", "10", "15", "20", "25", "30", "40", "50", "100"
		//11. Check the Filter by section dropdown
		//The dropdown has the following options: "All Sections", "New Documents", "Pended" and "Unassigned"
		//12. Check the Filter by dropdown
		//The dropdown has the following options: "No Filter", "Voucher Number", "Vendor Number", "Vendor Name", "Invoice Number", "Invoice Date", "Amount" and "PO Number"
		//13. Check the remaining window elements
		//Besides the dropdowns, the window has a "Filter" input, "Apply", "Save as Default", "Reset" and "Restore Defaults" buttons
		//14. Close the Window
		//The Filter window is closed
		//15. Check the Tabs
		//The page has the following tabs: "All", "New Documents", "Pended", "CC'd" and "Unassigned"
		//16. Check the Table Headers
		//The table has the following headers: "Type", "Number", "Date", "Amount", "Vendor #", "Vendor Name" and "State"
		//17. Check the Table Elements
		//Every row has on the left 4 elements: A checkbox, a "Start" icon, an "Eye" icon and a "File" (Work) icon. On the right, it has 4 elements: a "Clock" icon (Pend), a "Play" icon (Route) and a "Documents" icon (CC)
		//18. Click the "Star" icon
		//A new window is displayed with a textarea to add a comment, and two buttons, "Cancel" and "OK"
		//19. Close the window
		//The comment window is closed
		//20. Click the "Eye" icon
		//A new window is displayed with three tabs: "Documents", "Details" and "Indexed Line Items"
		//21. Close the window
		//The window is closed
		//22. Click the "Pend" icon
		//A new window is displayed with a "Days" input, a "Comment" text area, a "Reasons" dropdown and "Cancel" / "Save" buttons
		//23. Close the window
		//The "Pend" window is closed
		//24. Click the "Route" icon
		//A new window is displayed with a "Route type" dropdown, a "Route item to" dropdown, a "Comment" text area, and "Cancel" / "Save" buttons
		//25. Click the "CC" icon
		//A new window is displayed with a "Route type" dropdown, a filter input, a "Copy item to" element to Add/Remove items, a "Comment" text area and "Cancel" / "Save" buttons
});

test(`TC 25472: Cor360 "Check Request" Page`, async t => {
	let menues = t.fixtureCtx.menues;
	
	await t
		//2. Go to Cor360
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Click the "Check Request" menu on the left
		.click(byID(getMenu(menues,3603).action_key))
		//4. Check Page Title
		.expect(page.title.innerText).eql("Check Requests",'The "Page Title" was wrong',timeout);
		
});

test(`TC 25473: Cor360 "Online Invoice" Page`, async t => {
	let menues = t.fixtureCtx.menues;
	
	await t
		//2. Go to Cor360
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Click the "Online Invoice" menu on the left
		.click(byID(getMenu(menues,3604).action_key))
		//4. Check Page Title
		.expect(page.title.innerText).eql("Online Invoice",'The "Page Title" was wrong',timeout);
});

test(`TC 25474: Cor360 "Adjustment Form" Page`, async t => {
	let menues = t.fixtureCtx.menues;
	
	await t
		//2. Go to Cor360
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Click on the "Adjustment Form" menu on the left
		.click(byID(getMenu(menues,3605).action_key))
		//4. Check Page Title
		.expect(page.title.innerText).eql("Adjustment Form",'The "Page Title" was wrong',timeout);
});

test(`TC 25475: Cor360 "PO Requisition" Page`, async t => {
	let menues = t.fixtureCtx.menues;

	await t
		//2. Go to Cor360
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Click the "PO Requisition" menu on the left
		.click(byID(getMenu(menues,3606).action_key))
		//4. Check Page Title
		.expect(page.title.innerText).eql("PO Requisition",'The "Page Title" was wrong',timeout);
		//5. Check the Page Elements - On the top, the page has a Logo image of 205 x 88 pixels, a PO #, a Date with a datepicker, and a Requisitioner. Below, it displays a "Company" dropdown and a "Currency" dropdown. Below, a Vendor search input is displayed. When a Vendor is searched, it will fill the Vendor Number and Address. To the right, there are three dropdowns, "Ship to location", "Ship Via" and "PO Terms". Next, the page displays a Note input, and PO data: "Bill to name", "Bill to address", a "Bill to Attn" dropdown, "Bill to email" and "Bill to directions". Below, it displays a "Special instructions" input, an "Add on Cost" input, and the Requisition total. Lastly, it displays 7 action icons, a "Decline" button and a Table grid 
		//6. Check the Table Headers - The following headers are displayed: "Line Number", "Buyer", "Major Class", "Minor Class", "Item Number", "Item Description", "Vendor Item", "WTY", "Unit Price", "UM", "Tax", "Amount", "Delivery Date", "Allocated" and "Activity ID"
});

test.skip(`TC 25476: Cor360 "Workflow" Page`, async t => {
	let menues = t.fixtureCtx.menues;

	await t
		//2. Go to Cor360
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Click the "PO Requisition" menu on the left
		.click(byID(getMenu(menues,3607).action_key))
});

test.skip(`TC 25477: Cor360 "Barcodes" Page`, async t => {
	let menues = t.fixtureCtx.menues;

	await t
		//2. Go to Cor360
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Click the "PO Requisition" menu on the left
		.click(byID(getMenu(menues,3608).action_key))
});

test(`TC 25478: Cor360 "Reports" Page`, async t => { //TODO Localize
	let menues = t.fixtureCtx.menues;
	let reportsButtons = Selector('div.report-btn');

	await t
		//2. Go to Cor360
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		//3. Click on the Reports menu on the left
		.click(byID(getMenu(menues,3609).action_key))
		//4. Check the Page Title
		.expect(page.title.innerText).eql("Reports",'The "Page Title" was wrong',timeout) 
		//5. Check the Page Buttons
		.expect(reportsButtons.withText("Ad-Hoc").exists).ok('The "Ad-Hoc" button should exist')
		.expect(reportsButtons.withText("Ad-Hoc").find('i').hasClass('fa-filter')).ok('The "Ad-Hoc" button should have a "Filter" icon')
		.expect(reportsButtons.withText("Accrual").exists).ok('The "Accrual" button should exist')
		.expect(reportsButtons.withText("Accrual").find('i').hasClass('fa-line-chart')).ok('The "Accrual" button should have a "Line chart" icon')
		.expect(reportsButtons.withText("Admin").exists).ok('The "Admin" button should exist')
		.expect(reportsButtons.withText("Admin").find('i').hasClass('fa-area-chart')).ok('The "Admin" button should have an "Area chart" icon')
		.expect(reportsButtons.withText("AP").exists).ok('The "AP" button should exist')
		.expect(reportsButtons.withText("AP").find('i').hasClass('fa-star')).ok('The "AP" button should have a "Star" icon')
		.expect(reportsButtons.withText("Custom").exists).ok('The "Custom" button should exist')
		.expect(reportsButtons.withText("Custom").find('i').hasClass('fa-gear')).ok('The "Custom" button should have a "Gear" icon')
		.expect(reportsButtons.withText("Doc Type").exists).ok('The "Doc Type" button should exist')
		.expect(reportsButtons.withText("Doc Type").find('i').hasClass('fa-file')).ok('The "Doc Type" button should have a "File" icon')
		.expect(reportsButtons.withText("Indexing Data").exists).ok('The "Indexing Data" button should exist')
		.expect(reportsButtons.withText("Indexing Data").find('i').hasClass('fa-tachometer')).ok('The "Indexing Data" button should have a "Tachometer" icon')
		.expect(reportsButtons.withText("Match Report").exists).ok('The "Match Report" button should exist')
		.expect(reportsButtons.withText("Match Report").find('i').hasClass('fa-list-ul')).ok('The "Match Report" button should have a "List" icon')
		.expect(reportsButtons.withText("Metrics").exists).ok('The "Metrics" button should exist')
		.expect(reportsButtons.withText("Metrics").find('i').hasClass('fa-rocket')).ok('The "Metrics" button should exist')
		.expect(reportsButtons.withText("Standard").exists).ok('The "Standard" button should exist')
		.expect(reportsButtons.withText("Standard").find('i').hasClass('fa-folder-open')).ok('The "Standard" button should exist');
});*/