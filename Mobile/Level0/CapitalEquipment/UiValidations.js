import { Selector } from 'testcafe';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
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
import MobilePage from '../../../page-models/mobilePage';


const dashboardTitles = Selector('div[class=title]');
const localizator = new Localizator();
const apiHandler  = new APIHandler();
const page = new MobilePage();
const args = parseArguments();
const category = {
	id: 60100,
	name: "Sweet Spot Analysis"
};


let pAdminFixture = fixture`Level 0 - Capital Equipment Solutions - UI Mobile Validations - Running on "${args.env.toUpperCase()}"`
	
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before(async ctx => {
		await before();
		let apps = await apiHandler.getApps();
		let application = apps.find(element => element['application_id'] === 60100);
		ctx.apps = apps;
		ctx.app = application.title; //Sweet Spot Analysis
		ctx.menues = await apiHandler.getMenues(application.menu_param);
		ctx.labels = await localizator.getLabelsAsJson('ui-ssaanalysislist-*,ui-ssafinancial-*,ui-ssaprocurement-*,msg-00-*,ui-ssaoperations-*,ui-ssahome-*');	
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

test.skip(`TC 28081: UI Validation - New Analysis`, async t => {
	page.changeResizeiPad();
	let ssaHomePage = new SSAHomePage();
	let ssaNewAnalysis = new SSANewAnalysisPage();
	let labels = t.fixtureCtx.labels;
	
	await t
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		.expect(ssaHomePage.titleHome.innerText).match(insensitive(labels['ui-ssahome-000']), 'Title home should be displayed')
		.expect(ssaHomePage.imgHome.exists).ok('The image should be displayed');
	await t
		.click(ssaHomePage.floatingMenuButton)
		.expect(ssaHomePage.newAnalysisButtonMenu.exists).ok('The new analysis button should be displayed')
		.expect(ssaHomePage.homeButtonMenu.exists).ok('The home button menu should be displayed')
		.expect(ssaHomePage.contactButtonMenu.exists).ok('The contact buttone menu should be displayed')
		.expect(ssaHomePage.analysisListButtonMenu.exists).ok('The analysis list button menu should exists')
		.click(ssaHomePage.newAnalysisButtonMenu)
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
		//Check Bonus dropdown
		.click(ssaNewAnalysis.bonusDropdown);
});

test.skip(`TC 28209: UI Validation - Contact Page`, async t => {
	page.changeResizeiPad();
	let ssaHeader =  new SSAHeaderPage();
	let ssaHomePage = new SSAHomePage();
	let ssaContact =  new SSAContactPage();
	let contactTextPage = await apiHandler.getCapitalEquimetContact();
	
	await t
		//Go to contact page
		.expect(ssaHeader.header.exists).ok('The Header element must be appear')
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		.click(ssaHomePage.floatingMenuButton)
		.click(ssaHeader.ssaMobileContacButton)
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


test.skip(`TC 28210: UI Validation - Analysis List Page`, async t => {
	page.changeResizeiPad();
	let ssaHeader =  new SSAHeaderPage();
	let ssaHomePage = new SSAHomePage();
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
		.click(dashboardTitles.withText(t.fixtureCtx.app))
		.click(ssaHomePage.floatingMenuButton)
		.click(ssaHeader.ssaMobileAnalysisList)
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
		.expect(ssaAnalysisList.searchInput.exists).ok('The Search input must be appear');
		if(analysisList.total > 0){
			await t
				.expect(ssaAnalysisList.analysisTable.exists).ok('The Analysis table must be appear')
				.expect(await checkLabels(ssaAnalysisList.analysisTable.headers,analysisHeaders)).ok('The headers are not correctly')
				.expect(ssaAnalysisList.copyButton.exists).ok('The Copy button on table must be appear')
				.expect(ssaAnalysisList.editButton.exists).ok('The Edit button on table must be appear')
				//Click Edit Button
				.click(ssaAnalysisList.editButton)
				.wait(3000);
		await t
			.expect(await ssaAnalysisList.financialsTitle.innerText == 'Financials').ok('The "Page Title" was wrong')
			.click(ssaHomePage.floatingMenuButton)
			.click(ssaHeader.ssaMobileAnalysisList);
		}
		
});