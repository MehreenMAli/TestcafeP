import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import Page from '../../../page-models/page';
import { byID, checkLabels, getMenu, checkRequests, logger, paste, longTimeout, timeout, insensitive } from '../../../utils/helperFunctions';
import { parseArguments } from '../../../utils/parseArguments';
import { before, after } from '../../../hooks';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import SSAHomePage from '../../../page-models/capitalequipmentsolutions/ssahomePage';
import SSAHeaderPage from '../../../page-models/capitalequipmentsolutions/ssaheaderPage';
import SSAContactPage from '../../../page-models/capitalequipmentsolutions/ssacontactPage';
import SSAAnalysisListPage from '../../../page-models/capitalequipmentsolutions/ssaanalysislistPage';
import SSANewAnalysisPage from '../../../page-models/capitalequipmentsolutions/ssanewanalysisPage';
import SSAProcurementPage from '../../../page-models/capitalequipmentsolutions/ssaprocurementPage';
import SSACurrentLifecyclePage from '../../../page-models/capitalequipmentsolutions/ssacurrentlifecyclePage';
import SSAOperationsPage from '../../../page-models/capitalequipmentsolutions/ssaoperationsPage';
import SSANewLifecyclePage from '../../../page-models/capitalequipmentsolutions/ssanewLifecyclePage';
import SSASweetSpotPage from '../../../page-models/capitalequipmentsolutions/ssasweetSpotPage';
import SSALeaseBuyPage from '../../../page-models/capitalequipmentsolutions/ssaleasebuyPage';

const localizator = new Localizator();
const apiHandler  = new APIHandler();
const page = new Page();
const args = parseArguments();
const category = {
	id: 60100,
	name: "Sweet Spot Analysis"
};


let pAdminFixture = fixture`Level 0 - Capital Equipment Solutions - UI Validations - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before(async ctx => {
		await before();
		let apps = await apiHandler.getApps();
		let application = apps.find(element => element['application_id'] === 60100);
		ctx.apps = apps;
		ctx.app = application.title; //Sweet Spot Analysis
		ctx.menues = await apiHandler.getMenues(application.menu_param);
		ctx.labels = await localizator.getLabelsAsJson('ui-ssaleasevsbuy-*,ui-ssasweetspot-*,ui-lifecycle-*,ui-ssaanalysislist-*,ui-ssafinancial-*,ui-ssaprocurement-*,msg-00-*,ui-ssaoperations-*,ui-ssahome-*');	
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


test(`TC 28092: UI Validation - Sweet Spot Page`, async t => {
	let ssaHeader =  new SSAHeaderPage();
	let ssaAnalysisList =  new SSAAnalysisListPage();
	let ssaSweetSpot =  new SSASweetSpotPage();
	let menues = t.fixtureCtx.menues;
	let sweetSpotMenu = byID(getMenu(menues, 6106).action_key);
	let sweetSpotTitle =  getMenu(menues, 6106).title;
	let labels = t.fixtureCtx.labels;

	let tableHeaders = [ 	labels['ui-ssasweetspot-006'], 
							labels['ui-ssasweetspot-007'],
							labels['ui-ssasweetspot-008'],
							labels['ui-ssasweetspot-009'],
							labels['ui-ssasweetspot-010'],
							labels['ui-ssasweetspot-011'],
							labels['ui-ssasweetspot-012']
						]; 

	let tableTotalHeaders = [ 	labels['ui-ssasweetspot-014'], 
								labels['ui-ssasweetspot-015'],
								labels['ui-ssasweetspot-016']
							]; 					

	
	await t
		//Go to contact page
		.expect(ssaHeader.header.exists).ok('The Header element must be appear')
		.click(ssaHeader.ssaAnalysisListButton)
		.wait(5000);
	await t
		.typeText(ssaAnalysisList.searchInput,'SweetSpotLeaseAutomated')
		.wait(3000);
	await t
		.pressKey('enter')
		.wait(5000)
		.click(ssaAnalysisList.userNameFilter.find('i'))
		.click(ssaAnalysisList.optionsFilter.find('p').withText('Test Good'));
	await t
		.pressKey('enter')
		.wait(2000)
		.pressKey('enter');
	
	if(await ssaAnalysisList.editButton.exists){
		await t
			//Click Edit Button
			.click(ssaAnalysisList.editButton)
			.wait(3000)
			//Click Sweet Spot option
			.click(sweetSpotMenu)
			.wait(8000);
		let titlePage = await page.title.innerText;
		await t
			//Check title
			.expect(titlePage == "Sweet Spot Analysis").ok('The "Page Title" was wrong', timeout)
			//Check Header
			.expect(ssaHeader.header.exists).ok('The Header element must be appear')
			.expect(ssaHeader.corsLogo.exists).ok('The Corcentric Logo must be appear')
			.expect(ssaHeader.titleApp.exists).ok('The Title of Application must be appear')
			.expect(ssaHeader.titleApp.innerText).contains('Capital Equipment Solutions',longTimeout)
			.expect(ssaHeader.newAnalysisButton.exists).ok('The New Analysis button must be appear')
			.expect(ssaHeader.ssaHomeButton.exists).ok('The Home button must be appear')
			.expect(ssaHeader.ssaAnalysisListButton.exists).ok('The Analysis List button must be appear')
			.expect(ssaHeader.ssaContacButton.exists).ok('The Analysis List button must be appear')
			.expect(ssaHeader.userProfile.exists).ok('The User Profile Dropdown must be appear')
			//Check tabs
			.expect(ssaSweetSpot.summaryTab.exists).ok('The Summary tab must be appear')
			.expect(ssaSweetSpot.maintenanceRepairTab.exists).ok('The Maintenance & Repair tab must be appear')
			.expect(ssaSweetSpot.fuelTab.exists).ok('The Fuel tab must be appear')
			.expect(ssaSweetSpot.tiresTab.exists).ok('The Tires tab must be appear')
			.expect(ssaSweetSpot.fixedTab.exists).ok('The Fixed tab must be appear')
			
			//Check Elements of Summary Tab
			.expect(ssaSweetSpot.yearlySummaryTable.exists).ok('The Yearly Summary table must be appear')
			.expect(ssaSweetSpot.totalSummaryTable.exists).ok('The Total Summary must	 be appear')
			.wait(2000)
			.expect(ssaSweetSpot.totalNetLabel.innerText).contains(labels['ui-ssasweetspot-042'],'Total Net Savings must be appear')
			.expect(await checkLabels(ssaSweetSpot.yearlySummaryTable.headers,tableHeaders)).ok('The headers are not correctly')
			.expect(await checkLabels(ssaSweetSpot.totalSummaryTable.headers,tableTotalHeaders)).ok('The headers are not correctly')
			//Check Elements of  Maintenance & Repair Tab
			.click(ssaSweetSpot.maintenanceRepairTab)
			.expect(ssaSweetSpot.yearlyMaintRepairTable.exists).ok('The Yearly Maint Repair table must be appear')
			.expect(ssaSweetSpot.totalMaintRepairTable.exists).ok('The Total Maint Repair must be appear')
			.expect(ssaSweetSpot.graphCanvas.exists).ok('The Graphic must be appear')
			.expect(await checkLabels(ssaSweetSpot.yearlyMaintRepairTable.headers,tableHeaders)).ok('The headers are not correctly')
			.expect(await checkLabels(ssaSweetSpot.totalMaintRepairTable.headers,tableTotalHeaders)).ok('The headers are not correctly')
			//Check Elements of Fuel Tab
			.click(ssaSweetSpot.fuelTab)
			.expect(ssaSweetSpot.yearlyFuelTable.exists).ok('The Yearly Fuel table must be appear')
			.expect(ssaSweetSpot.totalFuelTable.exists).ok('The Total Fuel must be appear')
			.expect(ssaSweetSpot.graphCanvas.exists).ok('The Graphic must be appear')
			.expect(await checkLabels(ssaSweetSpot.yearlyFuelTable.headers,tableHeaders)).ok('The headers are not correctly')
			.expect(await checkLabels(ssaSweetSpot.totalFuelTable.headers,tableTotalHeaders)).ok('The headers are not correctly')
			//Check Elements of Tires Tab
			.click(ssaSweetSpot.tiresTab)
			.expect(ssaSweetSpot.yearlyTiresTable.exists).ok('The Yearly Tires table must be appear')
			.expect(ssaSweetSpot.totalTiresTable.exists).ok('The Total Tires must be appear')
			.expect(ssaSweetSpot.graphCanvas.exists).ok('The Graphic must be appear')
			.expect(await checkLabels(ssaSweetSpot.yearlyTiresTable.headers,tableHeaders)).ok('The headers are not correctly')
			.expect(await checkLabels(ssaSweetSpot.totalTiresTable.headers,tableTotalHeaders)).ok('The headers are not correctly')
			//Check Elements of Fixed Tab
			.click(ssaSweetSpot.fixedTab)
			.expect(ssaSweetSpot.yearlyFixedTable.exists).ok('The Yearly Fixed table must be appear')
			.expect(ssaSweetSpot.totalFixedTable.exists).ok('The Total Fixed must be appear')
			.expect(ssaSweetSpot.graphCanvas.exists).ok('The Graphic must be appear')
			.expect(await checkLabels(ssaSweetSpot.yearlyFixedTable.headers,tableHeaders)).ok('The headers are not correctly')
			.expect(await checkLabels(ssaSweetSpot.totalFixedTable.headers,tableTotalHeaders)).ok('The headers are not correctly')
	}		
});


test(`TC 28101: UI Validation - Lease vs Buy Page`, async t => {
	let ssaHeader =  new SSAHeaderPage();
	let ssaAnalysisList =  new SSAAnalysisListPage();
	let ssaLeaseBuy =  new SSALeaseBuyPage();
	let menues = t.fixtureCtx.menues;
	let leaseBuyMenu = byID(getMenu(menues, 6107).action_key);
	let labels = t.fixtureCtx.labels;
	
	let cashPurchaseHeaders = [ labels['ui-ssaleasevsbuy-007'], 
								labels['ui-ssaleasevsbuy-008'],
								labels['ui-ssaleasevsbuy-009'],
								labels['ui-ssaleasevsbuy-010']
							]; 
	
	let tableHeaders = [ 	labels['ui-ssaleasevsbuy-004'], 
							labels['ui-ssaleasevsbuy-005'],
							labels['ui-ssaleasevsbuy-006']
						]; 	
						
	let leaseHeaders = [ 	labels['ui-ssaleasevsbuy-007'], 
							labels['ui-ssaleasevsbuy-011'],
							labels['ui-ssaleasevsbuy-012'],
							labels['ui-ssaleasevsbuy-013'],
							labels['ui-ssaleasevsbuy-014']
						]; 

	
	await t
		//Go to contact page
		.expect(ssaHeader.header.exists).ok('The Header element must be appear')
		.click(ssaHeader.ssaAnalysisListButton)
		.wait(5000);
	await t
		.typeText(ssaAnalysisList.searchInput,'SweetSpotLeaseAutomated')
		.wait(3000);
	await t
		.pressKey('enter')
		.wait(5000)
		.click(ssaAnalysisList.userNameFilter.find('i'))
		.click(ssaAnalysisList.optionsFilter.find('p').withText('Test Good'));
	await t
		.pressKey('enter')
		.wait(2000)
		.pressKey('enter');
	if(await ssaAnalysisList.editButton.exists){
		await t
			//Click Edit Button
			.click(ssaAnalysisList.editButton)
			.wait(3000)
			//Click Procurement option
			.click(leaseBuyMenu)
			.wait(5000);
		await t
			//Check Header
			.expect(ssaHeader.header.exists).ok('The Header element must be appear')
			.expect(ssaHeader.corsLogo.exists).ok('The Corcentric Logo must be appear')
			.expect(ssaHeader.titleApp.exists).ok('The Title of Application must be appear')
			.expect(ssaHeader.titleApp.innerText).contains('Capital Equipment Solutions',longTimeout)
			.expect(ssaHeader.newAnalysisButton.exists).ok('The New Analysis button must be appear')
			.expect(ssaHeader.ssaHomeButton.exists).ok('The Home button must be appear')
			.expect(ssaHeader.ssaAnalysisListButton.exists).ok('The Analysis List button must be appear')
			.expect(ssaHeader.ssaContacButton.exists).ok('The Analysis List button must be appear')
			.expect(ssaHeader.userProfile.exists).ok('The User Profile Dropdown must be appear')
			//Check Labels and titles
			.expect(ssaLeaseBuy.label.withText(labels['ui-ssaleasevsbuy-018']).exists).ok('The "Assumptions" title should exists')
			.expect(ssaLeaseBuy.label.withText(labels['ui-ssaleasevsbuy-019']).exists).ok('The "New Lifecycle Lease Payments" title should exists')
			.expect(ssaLeaseBuy.label.withText(labels['ui-ssaleasevsbuy-000']).exists).ok('The "Annualized After-Tax Present Value Analysis" title should exists')
			.expect(ssaLeaseBuy.label.withText(labels['ui-ssaleasevsbuy-001']).exists).ok('The "Second Asset Equipment Finance" title should exists')
			.expect(ssaLeaseBuy.label.withText(labels['ui-ssaleasevsbuy-002']).exists).ok('The "Cash Purchase" title should exists')
			.expect(ssaLeaseBuy.label.withText(labels['ui-ssaleasevsbuy-003']).exists).ok('The "Lease" title should exists')
			//Check Buttons
			.expect(ssaLeaseBuy.addButton.exists).ok('The Add button must be appear')
			.expect(ssaLeaseBuy.calculateButton.exists).ok('The Calculate button must be appear')
			//Check Tables
			.expect(ssaLeaseBuy.annualizedAfterTaxTable.exists).ok('The Annualized After-Tax Present Value Analysis table must be appear')
			.expect(ssaLeaseBuy.leaseTable.exists).ok('The Lease table must be appear')
			.expect(ssaLeaseBuy.cashPurchaseTable.exists).ok('The Cash Purchase table must be appear')
			.expect(ssaLeaseBuy.newLifecycleTable.exists).ok('The New Lifecycle Lease Payments table must be appear')
			.expect(ssaLeaseBuy.secondAssetTable.exists).ok('The Second Asset Equipment Finance table must be appear');
		await t
			.expect(await checkLabels(ssaLeaseBuy.cashPurchaseTable.headers,cashPurchaseHeaders)).ok('The headers are not correctly')
			.expect(await checkLabels(ssaLeaseBuy.newLifecycleTable.headers,tableHeaders)).ok('The headers are not correctly')
			.expect(await checkLabels(ssaLeaseBuy.secondAssetTable.headers,tableHeaders)).ok('The headers are not correctly')
			.expect(await checkLabels(ssaLeaseBuy.leaseTable.headers,leaseHeaders)).ok('The headers are not correctly');

	}		
});


test(`TC 27927: UI Validation - Home`, async t => {
	let ssaHome =  new SSAHomePage();
	let ssaHeader =  new SSAHeaderPage();
	let  labels = t.fixtureCtx.labels;
	await t
		// Go to Sweet Spot Analysis
		//.expect(page.title.innerText).contains('Welcome',longTimeout)

        // Check elements page
		.expect(ssaHome.imgHome.exists).ok('The Image must be appear') 
		.expect(ssaHome.titleHome.exists).ok('The title of home page must be appear')
		.expect(ssaHome.titleHome.innerText).contains(labels['ui-ssahome-000'],longTimeout)
		.expect(ssaHome.textHome.innerText).contains(labels['ui-ssahome-001'],longTimeout)

		//Check Header
		.expect(ssaHeader.header.exists).ok('The Header element must be appear');
});

test(`TC 27928: UI Validation - Header`, async t => {
	let ssaHeader =  new SSAHeaderPage();
	await t
		//Check Header
		.expect(ssaHeader.header.exists).ok('The Header element must be appear')
		.expect(ssaHeader.corsLogo.exists).ok('The Corcentric Logo must be appear')
		.expect(ssaHeader.titleApp.exists).ok('The Title of Application must be appear')
		.expect(ssaHeader.titleApp.innerText).contains('Capital Equipment Solutions',longTimeout)
		.expect(ssaHeader.newAnalysisButton.exists).ok('The New Analysis button must be appear')
		.expect(ssaHeader.ssaHomeButton.exists).ok('The Home button must be appear')
		.expect(ssaHeader.ssaAnalysisListButton.exists).ok('The Analysis List button must be appear')
		.expect(ssaHeader.ssaContacButton.exists).ok('The Analysis List button must be appear')
		.expect(ssaHeader.userProfile.exists).ok('The User Profile Dropdown must be appear');
});

test(`TC 27929: SSA - Check hamb menu navigation`, async t => {
	let ssaHeader =  new SSAHeaderPage();
	let ssaNewAnalysis = new SSANewAnalysisPage();
	let menues = t.fixtureCtx.menues;
	let financials = byID(getMenu(menues, 6101).action_key);
	let financialsTitle =  getMenu(menues, 6101).title;
	
	await t
		.click(ssaHeader.newAnalysisButton)
		.wait(500)
		.click(financials);
	
	let titlePage = await page.title.innerText;
	await t
		.expect(titlePage == financialsTitle).ok('The "Page Title" was wrong', timeout);
	await t
		.wait(200)
		.expect(ssaNewAnalysis.procurementMenu.innerText).contains('Procurement','The text should exist')
		.click(ssaNewAnalysis.procurementMenu)
		.expect(titlePage == financialsTitle).ok('The "Page Title" was wrong', timeout)
		.expect(await ssaNewAnalysis.currentLifecycleMenu.innerText).contains('Current Lifecycle','The text should exist')
		.click(ssaNewAnalysis.currentLifecycleMenu)
		.expect(titlePage == financialsTitle).ok('The "Page Title" was wrong', timeout)
		.expect(await ssaNewAnalysis.operationsMenu.innerText).contains('Operations','The text should exist')
		.click(ssaNewAnalysis.operationsMenu)
		.expect(titlePage == financialsTitle).ok('The "Page Title" was wrong', timeout)
		.expect(await ssaNewAnalysis.newLifecycleMenu.innerText).contains('New Lifecycle','The text should exist')
		.click(ssaNewAnalysis.newLifecycleMenu)
		.expect(titlePage == financialsTitle).ok('The "Page Title" was wrong', timeout)
		.expect(await ssaNewAnalysis.ssaMenu.innerText).contains('Sweet Spot','The text should exist')
		.click(ssaNewAnalysis.ssaMenu)
		.expect(titlePage == financialsTitle).ok('The "Page Title" was wrong', timeout)
		.expect(await ssaNewAnalysis.leasebuyMenu.innerText).contains('Lease vs Buy','The text should exist')
		.click(ssaNewAnalysis.leasebuyMenu)
		.expect(titlePage == financialsTitle).ok('The "Page Title" was wrong', timeout);
});

test(`TC 28064: UI Validation - Contact Page`, async t => {
	let ssaHeader =  new SSAHeaderPage();
	let ssaContact =  new SSAContactPage();
	let contactTextPage = await apiHandler.getCapitalEquimetContact();
	
	await t
		//Go to contact page
		.expect(ssaHeader.header.exists).ok('The Header element must be appear')
		.click(ssaHeader.ssaContacButton)
		//Check Header
		.expect(ssaHeader.header.exists).ok('The Header element must be appear')
		.expect(ssaHeader.corsLogo.exists).ok('The Corcentric Logo must be appear')
		.expect(ssaHeader.titleApp.exists).ok('The Title of Application must be appear')
		.expect(ssaHeader.titleApp.innerText).contains('Capital Equipment Solutions',longTimeout)
		.expect(ssaHeader.newAnalysisButton.exists).ok('The New Analysis button must be appear')
		.expect(ssaHeader.ssaHomeButton.exists).ok('The Home button must be appear')
		.expect(ssaHeader.ssaAnalysisListButton.exists).ok('The Analysis List button must be appear')
		.expect(ssaHeader.ssaContacButton.exists).ok('The Analysis List button must be appear')
		.expect(ssaHeader.userProfile.exists).ok('The User Profile Dropdown must be appear')
		//Check page
		.expect(ssaContact.titlePage.exists).ok('The Contact title must be appear')
		.expect(ssaContact.imgPage.exists).ok('The Image Logo must be appear')
		.expect(ssaContact.infoContact.exists).ok('The Info Contact must be appear')
		.expect(ssaContact.imgProfile.exists).ok('The Image Profile section must be appear')
		.expect(ssaContact.contactText.exists).ok('The Contact text must be appear')

		//Check text
		.expect(ssaContact.titlePage.innerText).contains(contactTextPage[0].Label,'The "Contact" title should exist')
		.expect(ssaContact.contactText.find('p').nth(0).innerText).contains(contactTextPage[1].Label,'The text should exist')
		.expect(ssaContact.contactText.find('p').nth(1).innerText).contains(contactTextPage[2].Label,'The text should exist')
});

test(`TC 28065: UI Validation - Analysis List Page`, async t => {
	let ssaHeader =  new SSAHeaderPage();
	let ssaAnalysisList =  new SSAAnalysisListPage();
	let analysisList = await apiHandler.getAnalysis();
	let  labels = t.fixtureCtx.labels;
	let analysisHeaders = [ labels['ui-ssaanalysislist-002'], //COMPANY
							labels['ui-ssaanalysislist-003'], //ASSET TYPE
							labels['ui-ssaanalysislist-004'], //YEAR
							labels['ui-ssaanalysislist-005'], //MAKE
							labels['ui-ssaanalysislist-006'], //MODEL
							labels['ui-ssaanalysislist-007'], //Fleet Size
							labels['ui-ssaanalysislist-008'], //Current LC
							labels['ui-ssaanalysislist-009'], //New LC
							labels['ui-ssaanalysislist-010'], //Date Created
							labels['ui-ssaanalysislist-011'] //User Name
						]; 
	await t
		//Go to contact page
		.expect(ssaHeader.header.exists).ok('The Header element must be appear')
		.click(ssaHeader.ssaAnalysisListButton)
		//Check Header
		.expect(ssaHeader.header.exists).ok('The Header element must be appear')
		.expect(ssaHeader.corsLogo.exists).ok('The Corcentric Logo must be appear')
		.expect(ssaHeader.titleApp.exists).ok('The Title of Application must be appear')
		.expect(ssaHeader.titleApp.innerText).contains('Capital Equipment Solutions',longTimeout)
		.expect(ssaHeader.newAnalysisButton.exists).ok('The New Analysis button must be appear')
		.expect(ssaHeader.ssaHomeButton.exists).ok('The Home button must be appear')
		.expect(ssaHeader.ssaAnalysisListButton.exists).ok('The Analysis List button must be appear')
		.expect(ssaHeader.ssaContacButton.exists).ok('The Analysis List button must be appear')
		.expect(ssaHeader.userProfile.exists).ok('The User Profile Dropdown must be appear');
	if(analysisList.total > 0){
		await t
			//Check page
			.expect(ssaAnalysisList.searchInput.exists).ok('The Search input must be appear')
			.expect(ssaAnalysisList.analysisTable.exists).ok('The Analysis table must be appear')
			.expect(await checkLabels(ssaAnalysisList.analysisTable.headers,analysisHeaders)).ok('The headers are not correctly')
			.expect(ssaAnalysisList.analysisTable.filters.exists).ok('The Filters table must be appear')
			//Check Filter
			.expect(ssaAnalysisList.companyFilter.exists).ok('The Company filter must be appear')
			.expect(ssaAnalysisList.assetTypeFilter.exists).ok('The Asset Type filter must be appear')
			.expect(ssaAnalysisList.yearFilter.exists).ok('The Year filter must be appear')
			.expect(ssaAnalysisList.makeFilter.exists).ok('The Make filter must be appear')
			.expect(ssaAnalysisList.userNameFilter.exists).ok('The User Name filter must be appear')
			.expect(ssaAnalysisList.resetButton.exists).ok('The Reset button must be appear')
			.expect(ssaAnalysisList.copyButton.exists).ok('The Copy button on table must be appear')
			.expect(ssaAnalysisList.editButton.exists).ok('The Edit button on table must be appear')
			//Click Edit Button
			.click(ssaAnalysisList.editButton)
			.wait(3000);
		await t
			.expect(await ssaAnalysisList.financialsTitle.innerText == 'Financials').ok('The "Page Title" was wrong')
			.click(ssaHeader.ssaAnalysisListButton);	
	}	
});

test(`TC 28068: UI Validation - Financials Page`, async t => {
	let ssaHeader =  new SSAHeaderPage();
	let menues = t.fixtureCtx.menues;
	let financialsTitle =  getMenu(menues, 6101).title;
	let ssaNewAnalysis = new SSANewAnalysisPage();
	let labels = t.fixtureCtx.labels;
	let macrsOptions = await apiHandler.getMacrs();
	await t
		.click(ssaHeader.newAnalysisButton)
		.wait(500);

	//Check title	
	let titlePage = await page.title.innerText;
	await t
		.expect(titlePage == financialsTitle).ok('The "Page Title" was wrong', timeout)
		.wait(200)
		//Check Elements
		.expect(ssaNewAnalysis.saveButton.exists).ok('The "Save" button must be exist', timeout)
		.expect(ssaNewAnalysis.companyNameInput.exists).ok('The "Company Name" input must be exist', timeout)
		.expect(ssaNewAnalysis.macrsDropdown.exists).ok('The "Macrs" dropdown must be exist', timeout)
		.expect(ssaNewAnalysis.bonusDropdown.exists).ok('The "Bonus" dropdown must be exist', timeout)
		.expect(ssaNewAnalysis.taxBraketInput.exists).ok('The "Tax Braket" input must be exist', timeout)
		.expect(ssaNewAnalysis.weightedAvgCostDebtInput.exists).ok('The "Weighted average cost of debt" input must be exist', timeout)
		.expect(ssaNewAnalysis.avgReturnEquityInput.exists).ok('The "Average Return on Equity" input must be exist', timeout)
		.expect(ssaNewAnalysis.debtEquityRatioInput.exists).ok('The "Debt Equity Ratio" input must be exist', timeout)
		.expect(ssaNewAnalysis.waccOverrideInput.exists).ok('The "WACC Override" input must be exist', timeout)
		//Check Icons
		.expect(ssaNewAnalysis.percentIcon.nth(0).exists).ok('The "Percent" icon must be exist', timeout)
		//Check Labels
		.expect(ssaNewAnalysis.label.withText(labels['ui-ssafinancial-000']).exists).ok('The "Company name" label should exists')
		.expect(ssaNewAnalysis.label.withText(labels['ui-ssafinancial-001']).exists).ok('The "Macrs" label should exists')
		.expect(ssaNewAnalysis.label.withText(labels['ui-ssafinancial-002']).exists).ok('The "Bonus" label should exists')
		.expect(ssaNewAnalysis.label.withText(labels['ui-ssafinancial-003']).exists).ok('The "Tax Backet" label should exists')
		.expect(ssaNewAnalysis.label.withText(labels['ui-ssafinancial-004']).exists).ok('The "Weighted average cost of debt" label should exists')
		.expect(ssaNewAnalysis.label.withText(labels['ui-ssafinancial-005']).exists).ok('The "Average Return on Equity" label should exists')
		.expect(ssaNewAnalysis.label.withText(labels['ui-ssafinancial-006']).exists).ok('The "Debt Equity Ratio" label should exists')
		.expect(ssaNewAnalysis.label.withText(labels['ui-ssafinancial-010']).exists).ok('The "WACC Override" label should exists')
		//Check titles
		.expect(ssaNewAnalysis.calculationTitle.withText(labels['ui-ssafinancial-011']).exists).ok('The "Calculation" label should exists')
		//Check Tables
		.expect(ssaNewAnalysis.calculationtable.exists).ok('The "Calculation" table must be exist', timeout)
		//Check Controls on inputs
		.click(ssaNewAnalysis.saveButton)
		.expect(ssaNewAnalysis.labelError.exists).ok('The "Errors" labels must be exist', timeout)
		.expect(ssaNewAnalysis.labelError.withText(labels['msg-00-002']).exists).ok('The "Required field" label should exists')
		//Check MACRS dropdown
		.click(ssaNewAnalysis.macrsDropdown)
		.expect(ssaNewAnalysis.macrsOptions.find('p').withText(macrsOptions[0].period_name).exists).ok('The "3 Years" option should exists')
		.expect(ssaNewAnalysis.macrsOptions.find('p').withText(macrsOptions[1].period_name).exists).ok('The "5 Years" option should exists')
		//Check Bonus dropdown
		.click(ssaNewAnalysis.bonusDropdown)
		.expect(ssaNewAnalysis.bonusOptions.find('p').withText('100%').exists).ok('The "100%" option should exists')
		.expect(ssaNewAnalysis.bonusOptions.find('p').withText('0% (No Bonus)').exists).ok('The "0% (No Bonus)" option should exists');
});

test(`TC 28074: UI Validation - Procurement Page`, async t => {
	let ssaHeader =  new SSAHeaderPage();
	let ssaAnalysisList =  new SSAAnalysisListPage();
	let ssaProcurement =  new SSAProcurementPage();
	let analysisList = await apiHandler.getAnalysis();
	let menues = t.fixtureCtx.menues;
	let procurementMenu = byID(getMenu(menues, 6102).action_key);
	let procurementTitle =  getMenu(menues, 6102).title;
	let labels = t.fixtureCtx.labels;
	let assettypeOptions = await apiHandler.getAssetType();

	await t
		//Go to contact page
		.expect(ssaHeader.header.exists).ok('The Header element must be appear')
		.click(ssaHeader.ssaAnalysisListButton)
	if(analysisList.total > 0){
		await t
			//Click Edit Button
			.click(ssaAnalysisList.editButton)
			.wait(3000)
			//Click Procurement option
			.click(procurementMenu);
		let titlePage = await page.title.innerText;
		await t
			//Check title
			.expect(titlePage == procurementTitle).ok('The "Page Title" was wrong', timeout)
			//Check Header
			.expect(ssaHeader.header.exists).ok('The Header element must be appear')
			.expect(ssaHeader.corsLogo.exists).ok('The Corcentric Logo must be appear')
			.expect(ssaHeader.titleApp.exists).ok('The Title of Application must be appear')
			.expect(ssaHeader.titleApp.innerText).contains('Capital Equipment Solutions',longTimeout)
			.expect(ssaHeader.newAnalysisButton.exists).ok('The New Analysis button must be appear')
			.expect(ssaHeader.ssaHomeButton.exists).ok('The Home button must be appear')
			.expect(ssaHeader.ssaAnalysisListButton.exists).ok('The Analysis List button must be appear')
			.expect(ssaHeader.ssaContacButton.exists).ok('The Analysis List button must be appear')
			.expect(ssaHeader.userProfile.exists).ok('The User Profile Dropdown must be appear')
			//Check Elements
			.expect(ssaProcurement.assetType.exists).ok('The Asset Type dropdown must be appear')
			.expect(ssaProcurement.modelYear.exists).ok('The Model Year dropdown must be appear')
			.expect(ssaProcurement.equipmentTypeInput.exists).ok('The Equipment Type input must be appear')
			.expect(ssaProcurement.oemInput.exists).ok('The Original Equipment Manufacturer input must be appear')
			.expect(ssaProcurement.modelInput.exists).ok('The Model input must be appear')
			.expect(ssaProcurement.oecInput.exists).ok('The Original Equipment Cost input must be appear')
			.expect(ssaProcurement.inflationRateInput.exists).ok('The Inflation Rate input must be appear')
			.expect(ssaProcurement.estimatedResaleValueInput.exists).ok('The Estimated Resale Value input must be appear')
			.expect(ssaProcurement.saveButton.exists).ok('The Estimated Resale Value input must be appear')
			//Check Labels
			.expect(ssaProcurement.label.withText(labels['ui-ssaprocurement-000']).exists).ok('The "Asset type" label should exists')
			.expect(ssaProcurement.label.withText(labels['ui-ssaprocurement-001']).exists).ok('The "Equipment type" label should exists')
			.expect(ssaProcurement.label.withText(labels['ui-ssaprocurement-002']).exists).ok('The "Original Equipment Manufacturer (OEM)" label should exists')
			.expect(ssaProcurement.label.withText(labels['ui-ssaprocurement-003']).exists).ok('The "Model" label should exists')
			.expect(ssaProcurement.label.withText(labels['ui-ssaprocurement-004']).exists).ok('The "Model year" label should exists')
			.expect(ssaProcurement.label.withText(labels['ui-ssaprocurement-005']).exists).ok('The "Original Equipment Cost (OEC)" label should exists')
			.expect(ssaProcurement.label.withText(labels['ui-ssaprocurement-006']).exists).ok('The "Estimated Resale Value" label should exists')
			.expect(ssaProcurement.label.withText(labels['ui-ssaprocurement-007']).exists).ok('The "Inflation Rate (Average OEC Price Increase)" label should exists')
			//Click on Dropdown
			.click(ssaProcurement.assetType.find('i'))
			//Check Options
			.expect(ssaProcurement.assetType.find('div[class="dropdown-options"]').exists).ok('The Options dropdown must be appear');
			for(let i=0; i<assettypeOptions.length; i++){
				await t.expect(ssaProcurement.assetType.find('div[class="dropdown-options"]').find('p').withText(assettypeOptions[i].asset_type_name).exists).ok('The asset type option should exists')
			}
		await t
			.click(ssaProcurement.assetType.find('i'))
			.click(ssaProcurement.modelYear.find('i'))
			//Check Options
			.expect(ssaProcurement.modelYear.find('div[class="dropdown-options"]').exists).ok('The Options dropdown must be appear')
			.click(ssaProcurement.modelYear.find('i'))
	}		
});

test(`TC 28078: UI Validation - Operations Page`, async t => {
	let ssaHeader =  new SSAHeaderPage();
	let ssaAnalysisList =  new SSAAnalysisListPage();
	let ssaOperations =  new SSAOperationsPage();
	let analysisList = await apiHandler.getAnalysis();
	let menues = t.fixtureCtx.menues;
	let currentlifecycleMenu = byID(getMenu(menues, 6104).action_key);
	let currentlifecycleTitle =  getMenu(menues, 6104).title;
	let labels = t.fixtureCtx.labels;

	let operationsHeaders = [ 	labels['ui-ssaoperations-006'], //Years old
								labels['ui-ssaoperations-007'] //M&R Cost Per Mile
							]; 

	
	await t
		//Go to contact page
		.expect(ssaHeader.header.exists).ok('The Header element must be appear')
		.click(ssaHeader.ssaAnalysisListButton)
	if(analysisList.total > 0){
		await t
			//Click Edit Button
			.click(ssaAnalysisList.editButton)
			.wait(3000)
			//Click Procurement option
			.click(currentlifecycleMenu);
		let titlePage = await page.title.innerText;
		await t
			//Check title
			.wait(3000)
			.expect(titlePage == currentlifecycleTitle).ok('The "Page Title" was wrong', timeout)
			//Check Header
			.expect(ssaHeader.header.exists).ok('The Header element must be appear')
			.expect(ssaHeader.corsLogo.exists).ok('The Corcentric Logo must be appear')
			.expect(ssaHeader.titleApp.exists).ok('The Title of Application must be appear')
			.expect(ssaHeader.titleApp.innerText).contains('Capital Equipment Solutions',longTimeout)
			.expect(ssaHeader.newAnalysisButton.exists).ok('The New Analysis button must be appear')
			.expect(ssaHeader.ssaHomeButton.exists).ok('The Home button must be appear')
			.expect(ssaHeader.ssaAnalysisListButton.exists).ok('The Analysis List button must be appear')
			.expect(ssaHeader.ssaContacButton.exists).ok('The Analysis List button must be appear')
			.expect(ssaHeader.userProfile.exists).ok('The User Profile Dropdown must be appear')
			//Check Elements
			.expect(ssaOperations.fuelcostpergallonInput.exists).ok('The fuel cost per gallon input must be appear')
			.expect(ssaOperations.annualmpgimprovementInput.exists).ok('The annual mpg improvement input must be appear')
			.expect(ssaOperations.fueldegradationmileagestartInput.exists).ok('The fuel degradation mileage start input must be appear')
			.expect(ssaOperations.incrementalmpgdegradationdecreaseInput.exists).ok('The incremental mpg degradation decrease input must be appear')
			.expect(ssaOperations.allocationfortiresInput.exists).ok('The allocation fortires input must be appear')
			.expect(ssaOperations.operationTable.exists).ok('The Operations table must be appear')
			.expect(ssaOperations.saveButton.exists).ok('The Save button must be appear')
			
			//Check Label
			.expect(ssaOperations.label.withText(labels['ui-ssaoperations-000']).exists).ok('The "Fuel Cost per Gallon" label should exists')
			.expect(ssaOperations.label.withText(labels['ui-ssaoperations-001']).exists).ok('The "Miles per Gallon (MPG)" label should exists')
			.expect(ssaOperations.label.withText(labels['ui-ssaoperations-002']).exists).ok('The "Annual MPG Improvement" label should exists')
			.expect(ssaOperations.label.withText(labels['ui-ssaoperations-003']).exists).ok('The "Fuel Degradation Start Mileage" label should exists')
			.expect(ssaOperations.label.withText(labels['ui-ssaoperations-004']).exists).ok('The "Incremental MPG Degradation Decrease" label should exists')
			.expect(ssaOperations.label.withText(labels['ui-ssaoperations-008']).exists).ok('The "Allocation for Tires" label should exists')
			.expect(ssaOperations.titleTable.withText(labels['ui-ssaoperations-005']).exists).ok('The "Maintenance & Repair Cost Per Mile" label should exists')
			
			//Check Tables
			.expect(await checkLabels(ssaOperations.operationTable.headers,operationsHeaders)).ok('The headers are not correctly')
			//Check Rows if exist
			if(await ssaOperations.operationTable.rows.count > 2){
				await t
					.expect(ssaOperations.operationTable.rows.nth(1).find('td').nth(1).find('input').exists).ok('The "M&R Cost Per Mile" inpunt table must be appear');
			}
			
	}		
});

test(`TC 28075: UI Validation - Current Lifecycle Page`, async t => {
	let ssaHeader =  new SSAHeaderPage();
	let ssaAnalysisList =  new SSAAnalysisListPage();
	let ssaCurrentLifecycle =  new SSACurrentLifecyclePage();
	let analysisList = await apiHandler.getAnalysis();
	let menues = t.fixtureCtx.menues;
	let currentlifecycleMenu = byID(getMenu(menues, 6103).action_key);
	let currentlifecycleTitle =  getMenu(menues, 6103).title;
	let labels = t.fixtureCtx.labels;

	let yearHeaders = [ labels['ui-lifecycle-005'], //Years old
						labels['ui-lifecycle-006'], //Months in year
						labels['ui-lifecycle-007'], //Number of units
						labels['ui-lifecycle-008'] //Avg annual miles per unit
						]; 

	let monthsHeaders = [ 	labels['ui-lifecycle-009'], //Start month
							labels['ui-lifecycle-010'], //End month
							//labels['ui-lifecycle-022'], //Pre-Tax Monthly Cash Flow Equivalent
							labels['ui-lifecycle-012'] //Finance type
						]; 
	
	await t
		//Go to contact page
		.expect(ssaHeader.header.exists).ok('The Header element must be appear')
		.click(ssaHeader.ssaAnalysisListButton)
	if(analysisList.total > 0){
		await t
			//Click Edit Button
			.click(ssaAnalysisList.editButton)
			.wait(3000)
			//Click Procurement option
			.click(currentlifecycleMenu);
		let titlePage = await page.title.innerText;
		await t
			//Check title
			.expect(titlePage == currentlifecycleTitle).ok('The "Page Title" was wrong', timeout)
			//Check Header
			.expect(ssaHeader.header.exists).ok('The Header element must be appear')
			.expect(ssaHeader.corsLogo.exists).ok('The Corcentric Logo must be appear')
			.expect(ssaHeader.titleApp.exists).ok('The Title of Application must be appear')
			.expect(ssaHeader.titleApp.innerText).contains('Capital Equipment Solutions',longTimeout)
			.expect(ssaHeader.newAnalysisButton.exists).ok('The New Analysis button must be appear')
			.expect(ssaHeader.ssaHomeButton.exists).ok('The Home button must be appear')
			.expect(ssaHeader.ssaAnalysisListButton.exists).ok('The Analysis List button must be appear')
			.expect(ssaHeader.ssaContacButton.exists).ok('The Analysis List button must be appear')
			.expect(ssaHeader.userProfile.exists).ok('The User Profile Dropdown must be appear')
			
			//Check Elements
			.expect(ssaCurrentLifecycle.saveButton.exists).ok('The Save button must be appear')
			.expect(ssaCurrentLifecycle.submitButton.exists).ok('The Submit button must be appear')
			.expect(ssaCurrentLifecycle.monthsInput.exists).ok('The Months input must be appear')
			.click(ssaCurrentLifecycle.monthsInput)
			.pressKey('ctrl+a delete')
			.typeText(ssaCurrentLifecycle.monthsInput,'12')
			.click(ssaCurrentLifecycle.submitButton)
			.wait(5000)
			.click(ssaCurrentLifecycle.monthsInput)
			.pressKey('ctrl+a delete')
			.typeText(ssaCurrentLifecycle.monthsInput,'15')
			//TODO: CES-807
			.click(ssaCurrentLifecycle.submitButton)
			.wait(5000)
			//.click(ssaCurrentLifecycle.modal.find('button'))
			.expect(ssaCurrentLifecycle.tableYears.exists).ok('The Years table must be appear')
			.expect(await checkLabels(ssaCurrentLifecycle.tableYears.headers,yearHeaders)).ok('The headers are not correctly');
			//Check Rows if exist
			if(await ssaCurrentLifecycle.tableYears.rows.count > 2){
				await t
					.expect(ssaCurrentLifecycle.tableYears.rows.nth(1).find('td').nth(2).find('input').exists).ok('The "Number of units" inpunt table must be appear')
					.expect(ssaCurrentLifecycle.tableYears.rows.nth(1).find('td').nth(3).find('input').exists).ok('The "Number of units" inpunt table must be appear');
			}
			
			if(await ssaCurrentLifecycle.table.count > 1){
				await t
					.expect(ssaCurrentLifecycle.tableMonths.exists).ok('The Months table must be appear')
					.expect(await checkLabels(ssaCurrentLifecycle.tableMonths.headers,monthsHeaders)).ok('The headers are not correctly');
			}
			if(await ssaCurrentLifecycle.table.count > 1){
				if(await ssaCurrentLifecycle.tableMonths.rows.count > 2){
					await t
						.expect(ssaCurrentLifecycle.tableMoths.rows.nth(1).find('td').nth(1).find('input').exists).ok('The "Number of units" inpunt table must be appear')
						.expect(ssaCurrentLifecycle.tableMoths.rows.nth(1).find('td').nth(2).find('input').exists).ok('The "Number of units" inpunt table must be appear')
						.expect(ssaCurrentLifecycle.tableMoths.rows.nth(1).find('td').nth(3).find('input').exists).ok('The "Number of units" inpunt table must be appear')
						.expect(ssaCurrentLifecycle.tableMoths.rows.nth(1).find('td').nth(3).find('i').exists).ok('The "Number of units" inpunt table must be appear')
						.click(ssaCurrentLifecycle.tableMoths.rows.nth(1).find('td').nth(3).find('i'))
						//Check options
						.expect(ssaCurrentLifecycle.dropdownOptions.exists).ok('The "Opciones" dropdown must be appear')
						.expect(ssaCurrentLifecycle.dropdownOptions.find('p').withText('No Payment').exists).ok('The "No Payment" option should exists')
						.expect(ssaCurrentLifecycle.dropdownOptions.find('p').withText('Cash').exists).ok('The "Cash" option should exists')
						.expect(ssaCurrentLifecycle.dropdownOptions.find('p').withText('Lease').exists).ok('The "Lease" option should exists')
						.expect(ssaCurrentLifecycle.dropdownOptions.find('p').withText('Loan').exists).ok('The "Loan" option should exists')
						.expect(ssaCurrentLifecycle.dropdownOptions.find('p').withText('Depreciate').exists).ok('The "Depreciate" option should exists')
				
				}
			}
	}		
});

test(`TC 28082: UI Validation - New Lifecycle Page`, async t => {
	let ssaHeader =  new SSAHeaderPage();
	let ssaAnalysisList =  new SSAAnalysisListPage();
	let ssaNewLifecycle =  new SSANewLifecyclePage();
	let analysisList = await apiHandler.getAnalysis();
	let menues = t.fixtureCtx.menues;
	let newlifecycleMenu = byID(getMenu(menues, 6105).action_key);
	let newlifecycleTitle =  getMenu(menues, 6105).title;
	let labels = t.fixtureCtx.labels;

	let monthsHeaders = [ 	labels['ui-lifecycle-005'], 
							labels['ui-lifecycle-006'],
							labels['ui-lifecycle-007']
						]; 

	let monthspayHeaders = [ 	labels['ui-lifecycle-009'], 
								labels['ui-lifecycle-010'],
								labels['ui-lifecycle-011']
						]; 					

	
	await t
		//Go to contact page
		.expect(ssaHeader.header.exists).ok('The Header element must be appear')
		.click(ssaHeader.ssaAnalysisListButton)
	if(analysisList.total > 0){
		await t
			//Click Edit Button
			.click(ssaAnalysisList.editButton)
			.wait(3000)
			//Click Procurement option
			.click(newlifecycleMenu);
		let titlePage = await page.title.innerText;
		await t
			//Check title
			.expect(titlePage == newlifecycleTitle).ok('The "Page Title" was wrong', timeout)
			//Check Header
			.expect(ssaHeader.header.exists).ok('The Header element must be appear')
			.expect(ssaHeader.corsLogo.exists).ok('The Corcentric Logo must be appear')
			.expect(ssaHeader.titleApp.exists).ok('The Title of Application must be appear')
			.expect(ssaHeader.titleApp.innerText).contains('Capital Equipment Solutions',longTimeout)
			.expect(ssaHeader.newAnalysisButton.exists).ok('The New Analysis button must be appear')
			.expect(ssaHeader.ssaHomeButton.exists).ok('The Home button must be appear')
			.expect(ssaHeader.ssaAnalysisListButton.exists).ok('The Analysis List button must be appear')
			.expect(ssaHeader.ssaContacButton.exists).ok('The Analysis List button must be appear')
			.expect(ssaHeader.userProfile.exists).ok('The User Profile Dropdown must be appear')
			//Check Elements
			.expect(ssaNewLifecycle.newOperatingTermInput.exists).ok('The New operating term input must be appear')
			.expect(ssaNewLifecycle.saveButton.exists).ok('The Save button must be appear')
			.expect(ssaNewLifecycle.submitButton.exists).ok('The Submit button must be appear')
			.click(ssaNewLifecycle.newOperatingTermInput)
			.pressKey('ctrl+a delete')
			.typeText(ssaNewLifecycle.newOperatingTermInput,'12')
			.click(ssaNewLifecycle.submitButton)
			.wait(5000)
			.click(ssaNewLifecycle.newOperatingTermInput)
			.pressKey('ctrl+a delete')
			.typeText(ssaNewLifecycle.newOperatingTermInput,'15')
			.click(ssaNewLifecycle.submitButton)
			.wait(5000)
			.expect(ssaNewLifecycle.monthsTable.exists).ok('The Months table must be appear')
			.expect(ssaNewLifecycle.monthspaymentsTable.exists).ok('The Months payments table must be appear')
			.expect(await checkLabels(ssaNewLifecycle.monthsTable.headers,monthsHeaders)).ok('The headers are not correctly')
			.expect(await checkLabels(ssaNewLifecycle.monthspaymentsTable.headers,monthspayHeaders)).ok('The headers are not correctly')
			.expect(ssaNewLifecycle.addButton.exists).ok('The Add button must be appear')
			//.expect(ssaNewLifecycle.improvement.find('input').exists).ok('The Improvement input must be appear')
			//Check Label
			.expect(ssaNewLifecycle.label.withText(labels['ui-lifecycle-014']).exists).ok('The "New operating term" label should exists')
			.expect(ssaNewLifecycle.label.withText(labels['ui-lifecycle-016']).exists).ok('The "Average annual miles per unit" label should exists')
			.expect(ssaNewLifecycle.label.withText(labels['ui-lifecycle-017']).exists).ok('The "Annual fleet miles" label should exists')
			//.expect(ssaNewLifecycle.label.withText(labels['ui-lifecycle-018']).exists).ok('The "Improvement (Fleet Reduction)" label should exists');		
	}		
});