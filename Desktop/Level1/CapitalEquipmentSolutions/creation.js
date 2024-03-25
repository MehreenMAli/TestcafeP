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

const localizator = new Localizator();
const apiHandler = new APIHandler();
const uniqueId = Date.now().toString();
const page = new Page();
const args = parseArguments();
const category = {
    id: 60100,
    name: "Sweet Spot Analysis"
};


let pAdminFixture = fixture`Level 1 - Capital Equipment Solutions - Creation - Running on "${args.env.toUpperCase()}"`
    .page(config[args.env].baseUrl)
    .requestHooks(logger)
    .before(async ctx => {
        await before();
        let apps = await apiHandler.getApps();
        let application = apps.find(element => element['application_id'] === 60100);
        ctx.apps = apps;
        ctx.app = application.title; //Sweet Spot Analysis
        ctx.menues = await apiHandler.getMenues(application.menu_param);
        ctx.labels = await localizator.getLabelsAsJson('ui-ssaanalysislist-*,ui-ssafinancial-*,ui-ssaprocurement-*,msg-00-*');
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

loadFixture(users[args.user], category, pAdminFixture);

test(`TC 28084 - New Analysis - Capital Equipment`, async t=>{
    let labels = t.fixtureCtx.labels;
    let capitalHomePage = new SSAHomePage();
    let newAnalysisPage = new SSANewAnalysisPage();
    let analysisListPage = new SSAAnalysisListPage();
    let companyName = 'Testing Company' + uniqueId;
    let description = 'Testing Description' + uniqueId;
    let taxBraquet = '20';
    let weightedAvg = '10';
    let returnEquity = '10';
    let debtEquityRatio = '5';

    await t
        .expect(page.title.innerText).contains('Welcome', longTimeout).wait(10000);
    await t
        .expect(capitalHomePage.newAnalysisButtonMenuDesktop.exists).ok('The new analysis button should be displayed')
        .click(capitalHomePage.newAnalysisButtonMenuDesktop);
    await t
        .expect(page.title.innerText).eql(labels['ui-ssafinancial-008'], 'The title should be displayed')
        .typeText(newAnalysisPage.companyNameInput, companyName, paste)
        .typeText(newAnalysisPage.descriptionInput, description, paste)
        .typeText(newAnalysisPage.taxBraketInput, taxBraquet, paste)
        .typeText(newAnalysisPage.weightedAvgCostDebtInput, weightedAvg, paste)
        .typeText(newAnalysisPage.avgReturnEquityInput, returnEquity,paste)
        .typeText(newAnalysisPage.debtEquityRatioInput, debtEquityRatio, paste)
        .click(newAnalysisPage.macrsDropdown)
        .expect(newAnalysisPage.dropDownOptions.exists).ok('The dropdown options should be displayed')
        .click(newAnalysisPage.dropDownOptions.find('p').withText('3 Years'));
    try {
        await t
            .click(newAnalysisPage.saveButton)
            .click(newAnalysisPage.confirmationModal.footerButtons.nth(0));
        await t
            .click(capitalHomePage.analysisListButtonMenuDesktop).wait(4000);
        await t
            .expect(analysisListPage.searchInput.exists).ok('The analysis list search inputshould be displayed')
            .expect(analysisListPage.analysisTable.exists).ok('The analysis table should be displayed');
        await t
            .expect(await analysisListPage.getAnalysis(companyName)).ok('The new analysis should be displayed');
        await t
            .expect(await analysisListPage.deleteAnalysis(companyName)).ok('The analysis should be deleted')
            .click(newAnalysisPage.confirmationModal.footerButtons.nth(0));
        await t
            .typeText(analysisListPage.searchInput, companyName, paste)
            .pressKey('enter');
        await t
            .expect(analysisListPage.noRecordsTableLabel.withExactText(labels['ui-ssaanalysislist-014']).exists).ok('The no record found label should be displayed');
    } catch (error) {
        let allAnalysis = await apiHandler.getAllAnalysis();
        let analysis = allAnalysis.find(element => element.company == companyName);
        if(analysis != null) {
            await apiHandler.deleteAnalysis(analysis.ssa_analysis_id);
        }
        throw error;
    }
});

test(`TC 28146 - New Procurement - Capital Equipment`, async t =>{
    let labels = t.fixtureCtx.labels;
    let capitalHomePage = new SSAHomePage();
    let analysisListPage = new SSAAnalysisListPage();
    let procurementPage = new SSAProcurementPage();
    let menues = t.fixtureCtx.menues;
    let procurementMenu = byID(getMenu(menues, 6102).action_key);

    let companyName = 'Testing Company' + uniqueId;
    let description = 'Testing Description' + uniqueId;
    let equipmentType = 'Testing Equipment' + uniqueId;
    let oem = 'TestingOEM';
    //analysis data
    let data = {
        avgReturnOnEquity: 10,
        bonus: 100,
        companyName: companyName,
        debtEquityRatio: 1,
        description: description,
        macrsId: 1,
        taxBracket: 10,
        waccOverride: null,
        weightedCostOfDebt: 10
    };
    await apiHandler.addNewAnalysis(data);
    try {
        await t
            .expect(capitalHomePage.imgHome.exists).ok('Home image should be displayed', longTimeout)
            .click(capitalHomePage.analysisListButtonMenuDesktop)
            .expect(analysisListPage.analysisTable.exists).ok('The analysis list should be displayed').wait(3000);
        await t
            .expect(await analysisListPage.getAnalysis(data.companyName)).ok('The analysis should exists', longTimeout);
        await analysisListPage.selectAnalysis(data.companyName);
        await t
            .expect(procurementMenu.exists).ok('the procurement menu should be displayed')
            .click(procurementMenu)
            .expect(procurementPage.assetType.exists).ok('The asset type combo box should be displayed')
            .click(procurementPage.assetType)
            .expect(procurementPage.dropDownOptions.exists).ok('The dropdown option should be displayed')
            .click(procurementPage.dropDownOptions.nth(0))
            .typeText(procurementPage.equipmentTypeInput, equipmentType, paste)
            .typeText(procurementPage.oemInput, oem, paste)
            .typeText(procurementPage.modelInput, '2016', paste)
            .click(procurementPage.modelYear)
            .expect(procurementPage.dropDownOptions.exists).ok('The dropdown options should be displayed')
            .click(procurementPage.dropDownOptions.withText('2016'))
            .typeText(procurementPage.oecInput, '200', paste)
            .typeText(procurementPage.estimatedResaleValueInput, '200', paste)
            .typeText(procurementPage.inflationRateInput, '3', paste)
            .click(procurementPage.saveButton)
            .expect(procurementPage.confirmationModal.root.exists).ok('The modal should be displayed')
            .click(procurementPage.confirmationModal.footerButtons.nth(0));
        await t
            .click(capitalHomePage.analysisListButtonMenuDesktop)
        await t
            .expect(analysisListPage.searchInput.exists).ok('The analysis list search inputshould be displayed')
            .expect(analysisListPage.analysisTable.exists).ok('The analysis table should be displayed')
            .expect(await analysisListPage.getAnalysis(oem)).ok('The analysis should exists with procurement data recorded', longTimeout);
        await t
            .expect(await analysisListPage.deleteAnalysis(companyName)).ok('The analysis should be deleted')
            .click(procurementPage.confirmationModal.footerButtons.nth(0)).wait(3000);
        await t
            .typeText(analysisListPage.searchInput, companyName, paste)
            .pressKey('enter');
        await t
            .expect(analysisListPage.noRecordsTableLabel.withExactText(labels['ui-ssaanalysislist-014']).exists).ok('The no record found label should be displayed');
    } catch (error) {
        let allAnalysis = await apiHandler.getAllAnalysis();
        let analysis = allAnalysis.find(element => element.company == companyName);
        if (analysis != null) {
            await apiHandler.deleteAnalysis(analysis.ssa_analysis_id);
        }
        throw error;
    }
});