import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import Page from '../../../page-models/page';
import { byID, checkLabels, getMenu, checkRequests, logger, paste, longTimeout, timeout, insensitive, clickElement, replace } from '../../../utils/helperFunctions';
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
import SideBarPage from '../../../page-models/sideBarPage';

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

test(`TC 28131: Edition of a new analysis`,async  t => {
    let labels = t.fixtureCtx.labels;
    let capitalHomePage = new SSAHomePage();
    let newAnalysisPage = new SSANewAnalysisPage();
    let analysisListPage = new SSAAnalysisListPage();
    let editedCompanyName = "Testing company edited " + uniqueId
    let editedDescription = "Testing description edited " + uniqueId
    let data = {
        avgReturnOnEquity: 10,
        bonus: 100,
        companyName: "Testing company " + uniqueId,
        debtEquityRatio: 1,
        description: "Testing description " + uniqueId,
        macrsId: 1,
        taxBracket: 10,
        waccOverride: null,
        weightedCostOfDebt: 10
    }
    await apiHandler.addNewAnalysis(data);
    try {
        await t
            .expect(capitalHomePage.imgHome.exists).ok('Home image should be displayed', longTimeout)
            .click(capitalHomePage.analysisListButtonMenuDesktop)
            .expect(analysisListPage.analysisTable.exists).ok('The analysis list should be displayed').wait(3000);
        await t
            .expect(await analysisListPage.getAnalysis(data.companyName)).ok('The analysis should exists', longTimeout)
            .expect(await analysisListPage.editAnalysis(data.companyName)).ok('The analysis should be displayed for edition', longTimeout)
            .expect(newAnalysisPage.companyNameInput.exists).ok('Company name input should be displayed')
            .typeText(newAnalysisPage.companyNameInput, editedCompanyName, replace)
            .typeText(newAnalysisPage.descriptionInput, editedDescription, replace);
        try {
            await t
                .click(newAnalysisPage.saveButton);
            await t
                .click(newAnalysisPage.confirmationModal.footerButtons.nth(0));
            let allAnalysis = await apiHandler.getAllAnalysis();
            let editedAnalysis = allAnalysis.find(element => element.company == editedCompanyName);
            let financialAnalysis = await apiHandler.getFinancialAnalysis(editedAnalysis.ssa_analysis_id);
            await t
                .expect(financialAnalysis[0].description).eql(editedDescription, 'The description should have been edited')
                .expect(financialAnalysis[0].avg_return_on_equity).eql(data.avgReturnOnEquity, 'The avg return of equity should not have been edited')
                .expect(financialAnalysis[0].debt_equity_ratio).eql(data.debtEquityRatio, 'The debt equity ratios should not have been edited')
                .expect(financialAnalysis[0].tax_bracket).eql(data.taxBracket, 'The tax bracket should not have been edited');
            await t
                .click(capitalHomePage.analysisListButtonMenuDesktop)
                .expect(analysisListPage.analysisTable.exists).ok('The analysis list should be displayed').wait(3000);
            await t
                .expect(await analysisListPage.getAnalysis(editedCompanyName)).ok('The analysis should exists', longTimeout);
            await t
                .expect(await analysisListPage.deleteAnalysis(editedCompanyName)).ok('The analysis should be deleted')
                .click(newAnalysisPage.confirmationModal.footerButtons.nth(0));
        } catch (error) {
            let analyses = await apiHandler.getAllAnalysis();
            let analysis = analyses.find(element => element.company == editedCompanyName);
            await apiHandler.deleteAnalysis(analysis.ssa_analysis_id);
            throw error;
        }
    } catch (err) {
        let analyses = await apiHandler.getAllAnalysis();
        let analysis = analyses.find(element => element.company == data.companyName);
        await apiHandler.deleteAnalysis(analysis.ssa_analysis_id);
        throw err;
    }
})

test(`TC 28233: Edition of new Procurement `, async t =>{
    let labels = t.fixtureCtx.labels;
    let capitalHomePage = new SSAHomePage();
    let newAnalysisPage = new SSANewAnalysisPage();
    let analysisListPage = new SSAAnalysisListPage();
    let procurementPage = new SSAProcurementPage();
    let sideBar = new SideBarPage();
    let data = {
        avgReturnOnEquity: 10,
        bonus: 100,
        companyName: "Testing company " + uniqueId,
        debtEquityRatio: 1,
        description: "Testing description " + uniqueId,
        macrsId: 1,
        taxBracket: 10,
        waccOverride: null,
        weightedCostOfDebt: 10
    }
    
    let analysis = await apiHandler.addNewAnalysis(data);

    let procurementData = {
        asset_type_id: 1,
        equipment_type: "testing",
        estimated_resale_value: 30000,
        inflation_rate: 2,
        model: "2016",
        oec: 50000,
        oem: "test",
        procurement_id: 0,
        ssa_analysis_id: analysis.ssa_analysis_id,
        year: 2016
    }
    let procurement = await apiHandler.addProcurement(procurementData);
    try {
        await t
            .click(capitalHomePage.analysisListButtonMenuDesktop).wait(4000);
        await t
            .expect(await analysisListPage.selectAnalysis(data.companyName)).ok('The analysis should exists', longTimeout);
        await t
            .click(sideBar.items.withExactText('Procurement'))
            .expect(procurementPage.assetType.exists).ok('The assent type should be displayed')
            .typeText(procurementPage.equipmentTypeInput, procurementData.equipment_type + ' Edited' + uniqueId, { replace: true, paste: true })
            .typeText(procurementPage.oemInput, procurementData.oem + ' Edited ' + uniqueId, { replace: true, paste: true })
            .click(procurementPage.saveButton);
        await t
            .expect(procurementPage.confirmationModal.root.exists).ok('The confirmation modal should be displayed')
            .click(procurementPage.confirmationModal.footerButtons.nth(0))
            .expect(procurementPage.confirmationModal.root.exists).notOk('The confirmation modal should NOT be displayed');
        await t
            .click(capitalHomePage.analysisListButtonMenuDesktop)
            .expect(analysisListPage.analysisTable.exists).ok('The analysis list should be displayed').wait(3000);
        await t
            .expect(await analysisListPage.getAnalysis(procurementData.oem + ' Edited ' + uniqueId)).ok('The analysis should exists', longTimeout);
        await t
            .expect(await analysisListPage.deleteAnalysis(procurementData.oem + ' Edited ' + uniqueId)).ok('The analysis should be deleted')
            .click(newAnalysisPage.confirmationModal.footerButtons.nth(0));
    } catch (error) {
        let analyses = await apiHandler.getAllAnalysis();
        let analysis = analyses.find(element => element.company == data.companyName);
        if(analysis != null){
            await apiHandler.deleteAnalysis(analysis.ssa_analysis_id);
        }
        throw error;
    }
})