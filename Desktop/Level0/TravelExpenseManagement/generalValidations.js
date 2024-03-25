import { insensitive, byID, timeout, getMenu, checkRequests, logger, visible, longTimeout } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from './../../../hooks';
import users from '../../../users';
import config from '../../../config';
import Page from './../../../page-models/page';
import ReportsPage from './../../../page-models/tem/reportsPage';
import Report from './../../../page-models/tem/report';
import APIHandler from '../../../utils/apiHandler';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';

const localizator = new Localizator();
const apiHandler  = new APIHandler();
const args = parseArguments();
const page = new Page();
const category = {
	id: 62000,
	name: "Corcentric Expense"
};

let temFixture = fixture`Level 0 - Corcentric Expense - General Validations - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before(async ctx => {
		await before();
		let apps = await apiHandler.getApps();
		let application = apps.find(element => element['application_id'] === 62000);
		ctx.apps = apps;
		ctx.app = application.title; //Corcentric Expense
		ctx.menues = await apiHandler.getMenues(application.menu_param);
		ctx.labels = await localizator.getLabelsAsJson('ui-00-03*,ui-rep-000,ui-glmap-*');
		//ctx.menues = menues;
		ctx.configurationMenu = getMenu(ctx.menues,301);
		ctx.complianceSetupMenu = getMenu(ctx.configurationMenu.submenu,30110);
		ctx.costAllocationMenu = getMenu(ctx.configurationMenu.submenu,30101);
		ctx.groupsMenu = getMenu(ctx.configurationMenu.submenu,30116);
        ctx.notificationMenu = getMenu(ctx.configurationMenu.submenu,30120);
		ctx.settingsMenu = getMenu(ctx.configurationMenu.submenu,30200);
		ctx.manageUsersMenu = getMenu(ctx.configurationMenu.submenu,30106);
		ctx.generalLedger = getMenu(ctx.configurationMenu.submenu,30117);
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
	
loadFixture(users[args.user],category,temFixture);

test(`TC 25799: Reports Page Browsing`, async t => { 
	let menues = t.fixtureCtx.menues;
	let labels = t.fixtureCtx.labels;
	let reports = byID(getMenu(menues, 102).action_key);
	let reportsPage = new ReportsPage();
	let report = new Report();
	let reportInformation;
	let reportName;
	let fromDate;
	let toDate;
	let total;

	await t
		//2. Go to Corcentric Expense
		
		//3. Click on "Reports"
		.click(reports)
		.expect(page.title.innerText).match(insensitive(labels['ui-rep-000']), 'The "Page Title" was wrong', timeout);
	let maxReports = await reportsPage.allTable.rows.count - 2;
	//4. Open each Report and get the Report information - The name, fromDate, todate and amount are the same as the saved information
	for (let index = 2; index < maxReports; index++) { // index = 2 to Skips headers and filters
		reportInformation = await reportsPage.allTable.getRow(index);
		reportName = reportInformation[2].slice(0, 20); //To remove '...'
		fromDate = reportInformation[3].split(" ")[0];
		toDate = reportInformation[3].split(" ")[2];
		total = reportInformation[5];
	
		await t
			//5. Open the Report 
			.click(reportsPage.allTable.rows.nth(index))
			//6. Check the Report information
			.expect(report.reportName.innerText).contains(reportName, 'The Report name in the details was wrong', timeout)
		//TODO:TEM-2484
		/*
			.expect(report.detailsfromDate.innerText).contains(fromDate, 'The "From" date was wrong', timeout)
			.expect(report.detailstoDate.innerText).contains(toDate, 'The "To" date was wrong', timeout);
		if (await report.total.exists)
			await t.expect(report.total.innerText).contains(total, 'The total was wrong', timeout)
		//7. Click Close
		await t
			.click(report.closeButton).wait(5000);
		*/
	}
});

test(`TC 27390: Check hamb menu navigation`, async t => { 
	let menues = t.fixtureCtx.menues;
	let labels = await localizator.getLabelsAsJson('ui-usrm-315,ui-gldefault-000,ui-usrm-318,ui-rolemembership-004,ui-usrm-300,ui-usrm-000,ui-group-000,ui-expcat-000,ui-dist-000,ui-rep-000,ui-exp-104,ui-rec-000,ui-apv-000,ui-reporting-000,ui-policy-000,ui-rule-000,ui-prjcod-000,ui-glmap-000,ui-groupmap-000,ui-group-000,ui-manageroles-017,ui-email-000,ui-ap-000,ui-apvmethod-000,ui-brand-000,ui-ccy-000,ui-date-000,ui-glmap-*');
	let reports = byID(getMenu(menues, 102).action_key);
	let expenses = byID(getMenu(menues,103).action_key);
	let receipts = byID(getMenu(menues,104).action_key);
	let approvals = byID(getMenu(menues,105).action_key);
	let dashboardsMenu = byID(getMenu(menues,106).action_key);
	let policiesMenu = getMenu(t.fixtureCtx.complianceSetupMenu.submenu,3011001);
	let rulesMenu = getMenu(t.fixtureCtx.complianceSetupMenu.submenu,3011002);
	let projectCodesMenu = getMenu(t.fixtureCtx.costAllocationMenu.submenu,3010103);
	let glMappingMenu = getMenu(t.fixtureCtx.costAllocationMenu.submenu,3010102);
	let groupsSubmenu = getMenu(t.fixtureCtx.groupsMenu.submenu,301161);
	let manageGroupsMenu = getMenu(t.fixtureCtx.groupsMenu.submenu,30107);
	let manageRoles = getMenu(t.fixtureCtx.groupsMenu.submenu,30114);
	//let emailTemplatesMenu = getMenu(t.fixtureCtx.notificationMenu.submenu,30111);
	let apIntegrationMenu = getMenu(t.fixtureCtx.settingsMenu.submenu,30113);
	let approvalRouting = getMenu(t.fixtureCtx.settingsMenu.submenu,30115);
	let brandingModuleMenu = getMenu(t.fixtureCtx.settingsMenu.submenu,30103);
	let currencySetup = getMenu(t.fixtureCtx.settingsMenu.submenu,30105);
	let dateFormat = getMenu(t.fixtureCtx.settingsMenu.submenu,30109);
	let distanceRateSetupMenu = getMenu(t.fixtureCtx.settingsMenu.submenu,30104);
	let expenseCategory = getMenu(t.fixtureCtx.settingsMenu.submenu,3010101);
	let manageUsersSubmenu = getMenu(t.fixtureCtx.manageUsersMenu.submenu,3010603);
	let userMappingMenu = getMenu(t.fixtureCtx.manageUsersMenu.submenu,3010602);
	let manageGroupRole = getMenu(t.fixtureCtx.manageUsersMenu.submenu,3010606);
	let glAllocation = getMenu(t.fixtureCtx.settingsMenu.submenu,302001);
	let defineGL = getMenu(t.fixtureCtx.generalLedger.submenu,301171);
	let manageGL = getMenu(t.fixtureCtx.generalLedger.submenu,301172);
	let manageGLMapping = getMenu(t.fixtureCtx.generalLedger.submenu,301173);
	let userGlDefault = getMenu(t.fixtureCtx.generalLedger.submenu,301174);
	let manageUserGlMapping = getMenu(t.fixtureCtx.generalLedger.submenu,301175);
	
	await t
		//2. Go to Corcentric Expense
		.click(reports)
		.expect(page.title.innerText).match(insensitive(labels['ui-rep-000']), 'The "Page Title" was wrong', timeout)

		.click(expenses)
		.expect(page.title.innerText).match(insensitive(labels['ui-exp-104']),'The "Page Title" was wrong', timeout)

		.click(receipts)
		.expect(page.title.innerText).match(insensitive(labels['ui-rec-000']),'The "Page Title" was wrong', timeout)

		.click(approvals)
		.expect(page.title.innerText).match(insensitive(labels['ui-apv-000']),'The "Page Title" was wrong', timeout)
		
		.click(dashboardsMenu)
		.expect(page.title.innerText).match(insensitive(labels['ui-reporting-000']),'The "Page Title" was wrong', timeout)
		
		// Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    	// Click on Compliance Setup
        .click(byID(t.fixtureCtx.complianceSetupMenu.action_key))
    	// Click on Policies
		.click(byID(policiesMenu.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-policy-000']),'The "Page Title" was wrong', timeout)
		// Click on Rules
		.click(byID(rulesMenu.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-rule-000']),'The "Page Title" was wrong', timeout)
		
		// Click on Cost Allocation 
        .click(byID(t.fixtureCtx.costAllocationMenu.action_key))
    	// Click on GL And Expense Category Allocation
		//.click(byID(glMappingMenu.action_key))
		//.wait(2000)
        //.expect(page.title.innerText).match(insensitive(labels['ui-glmap-000']),'The "Page Title" was wrong', timeout)
		// Click on Project Codes
		.click(byID(projectCodesMenu.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-prjcod-000']),'The "Page Title" was wrong', timeout)
		
		// Click on the "Groups" menu
        .click(byID(t.fixtureCtx.groupsMenu.action_key))
    	// Click on the "Groups Mapping" item
		.click(byID(groupsSubmenu.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-groupmap-000']),'The "Page Title" was wrong', timeout)
		// Click on Manage Groups
		.click(byID(manageGroupsMenu.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-group-000']),'The "Page Title" was wrong', timeout)
		// Click on "Manage Roles"
		.click(byID(manageRoles.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-manageroles-017']),'The "Page Title" was wrong', timeout)
		
		// Click on the Notification submenu
        //.click(byID(t.fixtureCtx.notificationMenu.action_key))
		//TODO: TEM-2475
		// Click on Email Templates
		//.click(byID(emailTemplatesMenu.action_key))
		//.wait(2000)
		//.expect(page.title.innerText).match(insensitive(labels['ui-email-000']),'The "Page Title" was wrong', timeout)
		
		// Click on Settings submenu
        .click(byID(t.fixtureCtx.settingsMenu.action_key))
    	// Click on AP Integration
		.click(byID(apIntegrationMenu.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-ap-000']),'The "Page Title" was wrong', timeout)
		// Click on Approval Routing
		.click(byID(approvalRouting.action_key))
		.wait(2000)
		.expect(page.title.innerText).contains(labels['ui-apvmethod-000'],'The "Page Title" was wrong', timeout)
		// Click on "Branding Module"
		.click(byID(brandingModuleMenu.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-brand-000']),'The "Page Title" was wrong', timeout)
		// Click on Currency Setup
		.click(byID(currencySetup.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-ccy-000']),'The "Page Title" was wrong', timeout)
		// Click on Date Format
		.click(byID(dateFormat.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-date-000']),'The "Page Title" was wrong', timeout)
		// Click on Distance Rate Setup
		.click(byID(distanceRateSetupMenu.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-dist-000']),'The "Page Title" was wrong', timeout)
		// Click on Expense Category
		.click(visible(byID(expenseCategory.action_key)))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-expcat-000']),'The "Page Title" was wrong', timeout)
		// Click on GL Allocation
		.click(visible(byID(glAllocation.action_key)))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-glmap-032']),'The "Page Title" was wrong', timeout)
		 //Click on Users
		 .click(byID(t.fixtureCtx.manageUsersMenu.action_key))
		// Click on Manage Users
		.click(byID(manageUsersSubmenu.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-usrm-000']),'The "Page Title" was wrong', timeout)
		// Click on User mapping
		.click(byID(userMappingMenu.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-usrm-300']),'The "Page Title" was wrong', timeout)
		// Click Manage Group-Role
		.click(byID(manageGroupRole.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-rolemembership-004']),'The "Page Title" was wrong', timeout)
		// Click on General Ledger submenu
		.click(byID(t.fixtureCtx.generalLedger.action_key))
		// Click on Define GL
		.click(byID(defineGL.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive('Define GL'),'The "Page Title" was wrong', timeout)
		// Click on Manage GL
		.click(byID(manageGL.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive('Manage GL'),'The "Page Title" was wrong', timeout)
		// Click on Manage GL Mapping
		.click(byID(manageGLMapping.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-usrm-318']),'The "Page Title" was wrong', timeout)
		// Click on User GL Default
		.click(byID(userGlDefault.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-gldefault-000']),'The "Page Title" was wrong', timeout)
		// Click on Manage User GL Mappings
		.click(byID(manageUserGlMapping.action_key))
		.wait(2000)
		.expect(page.title.innerText).match(insensitive(labels['ui-usrm-315']),'The "Page Title" was wrong', timeout);
});