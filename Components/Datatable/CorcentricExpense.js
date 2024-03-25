import { getMenu, checkRequests, logger, checkLabels, byID, timeout, checkLabelsNotPresent, visible, paste } from '../../utils/helperFunctions';
import { parseArguments } from '../../utils/parseArguments';
import { before, after } from '../../hooks';
import users from '../../users';
import config from '../../config';
import Page from '../../page-models/page';
import APIHandler from '../../utils/apiHandler';
import { loadFixture } from '../../tests-manager/categorization';
import Localizator from '../../utils/localizator';
import ReportsPage from '../../page-models/tem/reportsPage';
import ExpensesPage from '../../page-models/tem/expensesPage';
import ApprovalsPage from '../../page-models/tem/approvalsPage';

const localizator = new Localizator();
const page = new Page();
const args = parseArguments();
const apiHandler = new APIHandler();
const category = {
    id: 62000,
    name: "Corcentric Expense"
};

let temFixture = fixture`Level 0 - Corcentric Expense - UI Validations - Running on "${args.env.toUpperCase()}"`
    .page(config[args.env].baseUrl)
    .requestHooks(logger)
    .before(async ctx => {
        await before();
        let apps = await apiHandler.getApps();
        let application = apps.find(element => element['application_id'] === 62000);
        let menues = await apiHandler.getMenues(application.menu_param);
        ctx.apps = apps;
        ctx.app = application.title; //Corcentric Expense
        ctx.menues = menues;
        ctx.configurationMenu = getMenu(menues, 301);
        ctx.labels = await localizator.getLabelsAsJson('ui-rep-0*,ui-exp-0*,ui-apv-0*');
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

loadFixture(users[args.user], category, temFixture);

test(`TC 27199: Corcentric Expense - Validate 'Reports' table`, async t => {
    let reportsMenu = byID(getMenu(t.fixtureCtx.menues, 102).action_key);
    let reportsPage = new ReportsPage();
    let labels = t.fixtureCtx.labels;
    let headers = [
        labels['ui-rep-007'], // Name
        labels['ui-rep-008'], // Pediod
        labels['ui-rep-009'], // Date Submitted
        labels['ui-rep-010'], // Amount
        labels['ui-rep-011'], // Compliance
        labels['ui-rep-012']  // Status
    ];

    //2. Go to Corcentric Expense -> Reports
    await t
        .click(reportsMenu)

        //3. Validate behavior of display columns toggle
        .click(reportsPage.allTable.ellipsisIcon);
    await t
        .expect(await checkLabels(reportsPage.allTable.displayColumnOptions, headers)).ok('Toggle headers options were not displayed')
        .expect(reportsPage.allTabRestore.exists).ok('Restore button was not displayed')
        .expect(reportsPage.allTabApply.exists).ok('Restore button was not displayed');
    //Restore columns to default.
    let restoreDisabled = await reportsPage.allTabRestore.hasAttribute('disabled');
    if (!restoreDisabled) {
        await t
            .click(reportsPage.allTabRestore)
            .click(reportsPage.allTabApply)
            .click(reportsPage.allTable.ellipsisIcon);
        await t
            .expect(await checkLabels(reportsPage.allTable.headers, headers)).ok(`Columns were not restored`);
    }
    //Disable two columns.
    //Disable Name
    await t
        .click(reportsPage.allTable.displayColumnOptions.withText(labels['ui-rep-007']))
        .click(reportsPage.allTabApply);
    await t
        .expect(await checkLabelsNotPresent(reportsPage.allTable.headers, [labels['ui-rep-007']])).ok(`${labels['ui-rep-007']} column was not disabled`, timeout)
        //Disable Period.
        .click(reportsPage.allTable.ellipsisIcon)
        .click(reportsPage.allTable.displayColumnOptions.withText(labels['ui-rep-008']))
        .click(reportsPage.allTabApply);
    await t
        .expect(await checkLabelsNotPresent(reportsPage.allTable.headers, [labels['ui-rep-007'], labels['ui-rep-008']])).ok(`${labels['ui-rep-007']} and ${labels['ui-rep-008']} columns were not disabled`)
        //Restore.
        .click(reportsPage.allTable.ellipsisIcon)
        .click(reportsPage.allTabRestore)
        .click(reportsPage.allTabApply)

        //4. Validate column filters
        .expect(reportsPage.allNameInput.exists).ok('Name input is not present')
        .expect(reportsPage.allPeriodDatepicker.exists).ok('Perdiod input is not present')
        .expect(reportsPage.allDateSubmittedDatepicker.exists).ok('Date Submitted input is not present')
        .expect(reportsPage.allAmountStartInput.exists).ok('Amout min input is not present')
        .expect(reportsPage.allAmountEndInput.exists).ok('Amount max is not present')
        .expect(reportsPage.allCompDropdown.exists).ok('Compliance dropdown is not present')
        .expect(reportsPage.allStatDropdown.exists).ok('Status is not present')
        .expect(reportsPage.resetButton.exists).ok('Reset button is not present');

    //5. Complete all filter inputs and click Reset button 
    let nameInput = 'test';
    let minAmount = '0';
    let maxmount = '100';
    await t
        .typeText(reportsPage.allNameInput, nameInput, paste)
        .typeText(reportsPage.allAmountStartInput, minAmount, paste)
        .typeText(reportsPage.allAmountEndInput, maxmount, paste)
        .click(reportsPage.allCompDropdown)
        .click(reportsPage.allCompDropdownOptions.nth(0))
        .click(reportsPage.allStatDropdown)
        .click(reportsPage.allStatDropdownOptions.nth(0))
        .click(reportsPage.resetButton);

    nameInput = await reportsPage.allNameInput.value;
    minAmount = await reportsPage.allAmountStartInput.value;
    maxmount = await reportsPage.allAmountEndInput.value;
    await t
        .expect(nameInput).eql("", 'Name filter was not reset')
        .expect(minAmount).eql("", 'Min amout filter was not reset')
        .expect(maxmount).eql("", 'Max amount filter was not reset');

    //6. Click second page
    //Table should display second page data.
    let reports = await apiHandler.getTEMReports();
    if (reports.total > 10) {
        await t
            .expect(reportsPage.allTable.pagination.next.exists).ok('Pagination should be displayed')
            .click(reportsPage.allTable.pagination.next);
        let secondPageReports = await apiHandler.getTEMReports(2);
        let reportName = secondPageReports.items[0].report_name.substr(0, 20)
        await t.expect(await reportsPage.findReport(reportName)).ok('Second page reports were not displayed')
    }
});

test(`TC 27205: Corcentric Expenses - Validate 'Expenses' table`, async t => {
    let expensesMenu = byID(getMenu(t.fixtureCtx.menues, 103).action_key);
    let expensesPage = new ExpensesPage();
    let labels = t.fixtureCtx.labels;
    let headers = await localizator.getLabelsAsJson('ui-exp-2*');

    //2. Go to Corcentric Expense -> Expenses
    await t
        .click(expensesMenu)

        //3. Validate behavior of display columns toggle
        .click(expensesPage.allTable.ellipsisIcon);
    await t
        .expect(await checkLabels(expensesPage.allTable.displayColumnOptions, headers)).ok('Toggle headers options were not displayed')
        .expect(expensesPage.restoreToDefaultButton.exists).ok('Restore button was not displayed')
        .expect(expensesPage.applyButton.exists).ok('Restore button was not displayed');
    //Restore columns to default.
    let restoreDisabled = await expensesPage.restoreToDefaultButton.hasAttribute('disabled');
    if (!restoreDisabled) {
        await t
            .click(expensesPage.restoreToDefaultButton)
            .click(expensesPage.applyButton)
            .click(expensesPage.allTable.ellipsisIcon);
        await t
            .expect(await checkLabels(expensesPage.allTable.headers, headers)).ok(`Columns were not restored`);
    }
    //Disable two columns.
    //Disable Name
    await t
        .click(expensesPage.allTable.displayColumnOptions.withText(headers['ui-exp-200']))
        .click(expensesPage.applyButton);
    await t
        .expect(await checkLabelsNotPresent(expensesPage.allTable.headers, [headers['ui-exp-200']])).ok(`${headers['ui-exp-200']} column was not disabled`, timeout)
        //Disable Period.
        .click(expensesPage.allTable.ellipsisIcon)
        .click(expensesPage.allTable.displayColumnOptions.withText(headers['ui-exp-201']))
        .click(expensesPage.applyButton);
    await t
        .expect(await checkLabelsNotPresent(expensesPage.allTable.headers, [headers['ui-exp-200'], headers['ui-exp-201']])).ok(`${headers['ui-exp-200']} and ${headers['ui-exp-201']} columns were not disabled`)
        //Restore.
        .click(expensesPage.allTable.ellipsisIcon)
        .click(expensesPage.restoreToDefaultButton)
        .click(expensesPage.applyButton)

        //4. Validate column filters
        .expect(expensesPage.allDate.exists).ok('Date input is not present')
        .expect(expensesPage.allCategory.exists).ok('Category input is not present')
        .expect(expensesPage.allReport.exists).ok('Report input is not present')
        .expect(expensesPage.allBusinessPurpose.exists).ok('Business Purpose input is not present')
        .expect(expensesPage.allMinAmount.exists).ok('Amount min is not present')
        .expect(expensesPage.allMaxAmount.exists).ok('Amount max is not present')
        .expect(expensesPage.allProjectCode.exists).ok('Project Code is not present')
        .expect(expensesPage.allCompliance.exists).ok('Compliance is not present')
        .expect(expensesPage.allResetButton.exists).ok('Reset button is not present');

    //5. Complete all filter inputs and click Reset button 
    let categoryInput = 'test';
    let reportInput = 'test';
    let businessInput = 'test';
    let minAmount = '0';
    let maxmount = '100';
    let projectInput = 'test';
    await t
        .typeText(expensesPage.allCategory, categoryInput, paste)
        .typeText(expensesPage.allReport, reportInput, paste)
        .typeText(expensesPage.allBusinessPurpose, businessInput, paste)
        .typeText(expensesPage.allProjectCode, projectInput, paste)
        .typeText(expensesPage.allMinAmount, minAmount, paste)
        .typeText(expensesPage.allMaxAmount, maxmount, paste)
        .click(expensesPage.allCompliance)
        .click(expensesPage.complianceDropdownOptions.nth(0))
        .click(expensesPage.allResetButton);

    categoryInput = await expensesPage.allCategory.value;
    reportInput = await expensesPage.allReport.value;
    businessInput = await expensesPage.allBusinessPurpose.value;
    minAmount = await expensesPage.allMinAmount.value;
    maxmount = await expensesPage.allMaxAmount.value;
    projectInput = await expensesPage.allProjectCode.value;

    await t
        .expect(categoryInput).eql("", 'Category filter was not reset')
        .expect(reportInput).eql("", 'Report filter was not reset')
        .expect(businessInput).eql("", 'Business Purpose filter was not reset')
        .expect(projectInput).eql("", 'Purpose Code filter was not reset')
        .expect(minAmount).eql("", 'Min amout filter was not reset')
        .expect(maxmount).eql("", 'Max amount filter was not reset');

    //6. Click second page
    //Table should display second page data.
    let reports = await apiHandler.getTEMExpenses();
    if (reports.total > 10) {
        await t
            .expect(expensesPage.allTable.pagination.next.exists).ok('Pagination should be displayed')
            .click(expensesPage.allTable.pagination.next);
        let secondPageExpenses = await apiHandler.getTEMExpenses(2);
        let expenseName = secondPageExpenses.items[0].report_name;
        await t.expect(await expensesPage.existsExpense(expenseName)).ok('Second page expenses were not displayed')
    }
});

test(`TC 27209: Corcentric Expenses - Validate 'Approvals' table`, async t => {
    let approvalsMenu = byID(getMenu(t.fixtureCtx.menues, 105).action_key);
    let approvalsPage = new ApprovalsPage();
    let labels = t.fixtureCtx.labels;
    let headers = [
        labels['ui-apv-006'], // Report Name
        labels['ui-apv-007'], // Period
        labels['ui-apv-008'], // Date Submitted
        labels['ui-apv-009'], // Amount
        labels['ui-apv-010'], // Compliance
        labels['ui-apv-011'], // Status
        labels['ui-apv-012']  // Submitted By
    ];

    //2. Go to Corcentric Expense -> Expenses
    await t
        .click(approvalsMenu);

    //3. Validate column filters
    await t
        .expect(await checkLabels(approvalsPage.allTable.headers, headers)).ok('Headers were not displayed')
        .expect(approvalsPage.allReportName.exists).ok('Report Name input is not present')
        .expect(approvalsPage.allSubmittedBy.exists).ok('Submitted By input is not present')
        .expect(approvalsPage.allPeriod.exists).ok('Period input is not present')
        .expect(approvalsPage.allDateSubmitted.exists).ok('Date Submitted input is not present')
        .expect(approvalsPage.allMinAmount.exists).ok('Amount min is not present')
        .expect(approvalsPage.allMaxAmount.exists).ok('Amount max is not present')
        .expect(approvalsPage.allCompliance.exists).ok('Compliance is not present')
        .expect(approvalsPage.allStatus.exists).ok('Statis is not present')
        .expect(approvalsPage.allResetButton.exists).ok('Reset button is not present');

    //4. Complete all filter inputs and click Reset button 
    let reportInput = 'test';
    let submittedByInput = 'test';
    let minAmount = '0';
    let maxAmount = '100';

    await t
        .typeText(approvalsPage.allReportName, reportInput, paste)
        .typeText(approvalsPage.allSubmittedBy, submittedByInput, paste)
        .typeText(approvalsPage.allMinAmount, minAmount, paste)
        .typeText(approvalsPage.allMaxAmount, maxAmount, paste)
        .click(approvalsPage.allResetButton);

    reportInput = await approvalsPage.allReportName.value;
    submittedByInput = await approvalsPage.allSubmittedBy.value;
    minAmount = await approvalsPage.allMinAmount.value;
    maxAmount = await approvalsPage.allMaxAmount.value;

    await t
        .expect(reportInput).eql("", 'Report Name filter was not reset')
        .expect(submittedByInput).eql("", 'Submitted By filter was not reset')
        .expect(minAmount).eql("", 'Min amout filter was not reset')
        .expect(maxAmount).eql("", 'Max amount filter was not reset');

    //6. Click second page
    //Table should display second page data.
    let approvals = await apiHandler.getTEMApprovals();
    if (approvals.total > 10) {
        await t
            .expect(approvalsPage.allTable.pagination.next.exists).ok('Pagination should be displayed')
            .click(approvalsPage.allTable.pagination.next);
        let secondPageApprovals = await apiHandler.getTEMApprovals(2);
        let approvalsName = secondPageApprovals.items[0].report_name;
        await t.expect(await approvalsPage.existsExpense(approvalsName)).ok('Second page approvals were not displayed')
    }
});