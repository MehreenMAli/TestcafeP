import { Selector } from 'testcafe';
import Page from '../../../page-models/page';
import Report from '../../../page-models/tem/report';
import Expense from '../../../page-models/tem/expense';
import ExpensesLibraryModal from '../../../page-models/tem/expensesLibraryModal';
import ProjectCodesPage from '../../../page-models/tem/cost-allocation/projectCodesPage';
import { byID, paste, getVariable, getMenu, checkRequests, logger, getByKey, clickable, replace, timeout, longTimeout, insensitive } from '../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from '../../../hooks';
import users from '../../../users';
import config from '../../../config';
import DistanceRateSetupPage from '../../../page-models/tem/distanceRateSetupPage';
import EmailTemplatesPage from '../../../page-models/tem/emailTemplatesPage';
import PoliciesPage from '../../../page-models/tem/compliance-setup/policiesPage';
import RulesPage from '../../../page-models/tem/compliance-setup/rulesPage';
import GroupsPage from '../../../page-models/tem/groupsPage';
import ManageUsersPage from '../../../page-models/tem/users/manageUsersPage';
import ManageRolesPage from '../../../page-models/tem/manageRolesPage';
import ConfirmModal from '../../../page-models/confirmModal';
import UploadingModal from '../../../page-models/uploadingModal';
import InfoModal from '../../../page-models/infoModal';
import NewUser from '../../../page-models/tem/users/newUser';
import NewRole from '../../../page-models/tem/newRole';
import ExpensesPage from '../../../page-models/tem/expensesPage';
import APIHandler from '../../../utils/apiHandler';
import ManageGroupRolePage from '../../../page-models/tem/users/manageGroupRolePage'
import { loadFixture } from '../../../tests-manager/categorization';
import AddEditGroupsModal from '../../../page-models/tem/addEditGroupsModal';
import UserDropdown from '../../../page-models/userDropdown';
import Localizator from '../../../utils/localizator';
import ReceiptsPage from '../../../page-models/tem/receiptsPage';
import ExpenseCategoryPage from '../../../page-models/tem/cost-allocation/expenseCategoryPage';
import { p_Test } from '../../../tests-manager/parameterization';
import ShortError from '../../../error-types/shortError';
import ReportsPage from '../../../page-models/tem/reportsPage'
import ManageGL from '../../../page-models/tem/generalLedger/manageGL';
import ManageGLMapping from '../../../page-models/tem/generalLedger/manageGLMapping';
import UserGLDefault from '../../../page-models/tem/generalLedger/userGLDefault'
import UserGLDefaultMapping from '../../../page-models/tem/generalLedger/userGLDefaultMapping';


const localizator = new Localizator();
const uniqueId = Date.now().toString();
const dashboardTitles = Selector('div[class=title]');
const page = new Page();
const args = parseArguments();
const expense = new Expense();
const report = new Report();
const reportsPage = new ReportsPage();
const expensesLibraryModal = new ExpensesLibraryModal();
const position = { offsetX: 40, offsetY: 25 };
const apiHandler = new APIHandler();
const category = {
	id: 62000,
	name: "Corcentric Expense"
};

process.removeAllListeners('unhandledRejection');

let temFixture = fixture`Level 1 - Corcentric Expense - Creation - Running on "${args.env.toUpperCase()}"`
    .page(config[args.env].baseUrl)
    .requestHooks(logger)
    .before(async ctx  => {
        await before();
        let apps = await apiHandler.getApps(); 
        let application = apps.find(element => element['application_id'] === 62000);
        let menues = await apiHandler.getMenues(application.menu_param);
        ctx.apps = apps;
        ctx.application = application;
        ctx.app = application.title; //Corcentric Expense
        ctx.menues = menues;
        ctx.configurationMenu = getMenu(ctx.menues,301);
        ctx.groupsMenu = getMenu(ctx.configurationMenu.submenu,30116);
        ctx.settingsMenu = getMenu(ctx.configurationMenu.submenu,30200);
        ctx.notificationMenu = getMenu(ctx.configurationMenu.submenu,30120);
        ctx.manageUsersMenu = getMenu(ctx.configurationMenu.submenu,30106);
        ctx.generalLedger = getMenu(ctx.configurationMenu.submenu, 30117);
        ctx.labels = await localizator.getLabelsAsJson('ui-00-03*,ui-00-02*,ui-policy-000,ui-email-000,ui-rule-000,ui-date-000,ui-usrm-*,ui-ccy-000,ui-dist-000,ui-prjcod-000,ui-expcat-000,ui-glmap-000,ui-proxy-0*,ui-brand-000,ui-group-000,ui-group-016,ui-gldef-000,ui-glimp-000,ui-reporting-00*,ui-dash-0*,ui-oood-000,ui-datatable-001,ui-defroltem-030,ui-apvuser-0*,ui-group-0*,msg-00-002,msg-00-012,msg-00-013,ui-usr-0*,ui-groupmap-*,ui-apvmethod-000,ui-manageroles-*,ui-rolemembership-0*,ui-cm-0*,msg-62000-*, ui-definegl-0*, ui-managegl-0*, ui-gldefault-000');
    })
    .after( async () => {
        await after();
    })
    .beforeEach( async () => {
        let currentUser = users[args.user];
        await page.login(currentUser.username,
            currentUser.password,
            currentUser.landingPage);
        await page.setTestSpeed(0.1);
    })
    .afterEach( async () => {
        await page.logout();
        await checkRequests(logger.requests);
    });

loadFixture(users[args.user],category,temFixture);

//TODO: Add control of GL Allocation Settings
test('TC 24783: Creates an Expense', async t => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    let expensesPage = new ExpensesPage();
    let uploadingModal = new UploadingModal();
    let purposeExpend = 'Purpose '+uniqueId;

    let menues = t.fixtureCtx.menues;
    let receipts = getMenu(menues,104);
    let glAllocationConfig = await apiHandler.getGLAllocationConfiguration();
    let glAllocationGrid = await apiHandler.getGLAllocationGridExpense();
    await t
        .click(dashboardTitles.withText(t.fixtureCtx.labels['ui-00-032']))
        .typeText(expense.amountInput,'12',paste)
        .typeText(expense.businessPurposeTextarea,purposeExpend,paste)
        .typeText(expense.commentTextarea,'Comment '+uniqueId,paste)
        .expect(expense.commentTextarea.value).eql('Comment '+uniqueId)
        .click(expense.addReceiptButton)
        .setFilesToUpload(expense.fileUpload, './../../../mock-files/testReceipt.jpg')
        .click(uploadingModal.doneButton)
        .wait(2000);
        if(glAllocationConfig.show_allocation_grid){
            await t
                .expect(expensesPage.allocationTab.exists).ok('The "Allocation" tab should exist')
                if(glAllocationGrid.allocations.length > 0){
                    await t 
                        .expect(expensesPage.gridAllocation.exists).ok('The "Allocation" grid should exist')
                        .expect(expensesPage.allocationAmountInputs.exists).ok('The allocation amount input should exist');
                } 
        }
        try {
            await t
                .click(expense.saveButton);
            await t
                .wait(2000)
                .typeText(expensesPage.businessPurposeInput, purposeExpend,{paste:true, replace:true})
                .pressKey('enter');
            await t
                .expect(await expensesPage.existsExpense(purposeExpend)).ok('The expense should be displayed on the table');
            let row = await expensesPage.allTable.getRow(2);
            await t
                .expect(row[2]).eql(today, 'The "Date" should be Today')
                .expect(row[4]).eql('', 'The "Report" should be empty')
                .expect(row[5]).eql(purposeExpend, 'The "Business Purpose" should be the one entered recently')
                .expect(row[6]).contains('12', 'The "Amount" should be $12.00')
                .expect(row[7]).eql('', 'The "Project Code" should be empty')
                .click(expensesPage.allResetButton);

            // Delete expense   
            await t
                .expect(await expensesPage.deleteExpense(purposeExpend)).ok('The expense must be deleted');
            let allExpenses = await apiHandler.getAllExpenses();
            await t
                .expect(await expensesPage.notExistsExpense(allExpenses, purposeExpend)).ok('The expense should not be displayed on the table')
                .wait(2000);
            //Checking the other tabs
            let unclaimedExpenses = await apiHandler.getAllExpensesByStatus(0);
            
            if (unclaimedExpenses.length > 0){
                await t
                    .click(expensesPage.unclaimedTab)
                    .expect(expensesPage.unclaimedTable.exists).ok('Unclaimed Table should be displayed')
                    .expect(await expensesPage.unclaimedTable.rows.count > 2).ok('The table should show info');
            }
            let notSubmittedExpenses = await apiHandler.getAllExpensesByStatus(1);

            if (notSubmittedExpenses.length > 0){
                await t
                    .click(expensesPage.notSubmittedTab)
                    .expect(expensesPage.notSubmittedTable.exists).ok('Not submitted table should be displayed')
                    .expect(await expensesPage.notSubmittedTable.rows.count > 2).ok('The table should show info');
            }
            let submittedExpenses = await apiHandler.getAllExpensesByStatus(2);
            
            if (submittedExpenses.length > 0){
                await t
                    .click(expensesPage.submittedTab)
                    .expect(expensesPage.submittedTable.exists).ok('The submitted table should be displayed')
                    .expect(await expensesPage.submittedTable.rows.count > 2).ok('The table should show info');
            }

            let deleteReipts = Selector('i.fa-trash');
            let deleteReiptsModal = Selector('modal-footer.modal-footer');
            await t
                // Delete Receipts    
                .click(byID(receipts.action_key))
                .click(byID(receipts.action_key))
                .click(deleteReipts)
                .click(deleteReiptsModal.find('button'))
                .wait(2000);
        } catch (error) {
            let expenses = await apiHandler.getAllExpenses();
            let expense = expenses.find(element => element.business_purpose == purposeExpend);
            if(expense !=null){
                await apiHandler.deleteExpense(expense.expense_id);
            }
            throw error;
        }
});

test('TC 24784: Creates a Report', async t => {
    let reportName = 'Test Report '+uniqueId;
    let reportNameTrunc = reportName.substring(0,19);
    let businessPurpose = 'UI Testing';
    let requiredField = t.fixtureCtx.labels['msg-00-002'];
    let biggerThanField = t.fixtureCtx.labels['msg-00-012'];
    let minorThanField = t.fixtureCtx.labels['msg-00-013'];

    await t
        //2. Click on "Corcentric Expense"
        //3. Click on "Create New Report"
        .click(dashboardTitles.withText(t.fixtureCtx.labels['ui-00-031']))
        //4. Click on the "Save" button
        .click(report.saveButton)
        //5. Check the Fields
        .expect(report.reportNameInput.error.innerText).contains(requiredField,'The "Report Name" input should display "Required field"')
        .expect(report.businessPurposeInput.error.innerText).contains(requiredField,'The "Business Purpose" input should display "Required field"')
        .expect(report.fromDate.error.innerText).contains(requiredField,'The "From" datepicker should display "Required field"')
        .expect(report.toDate.error.innerText).contains(requiredField,'The "To" datepicker should display "Required field"')
        //6. Select the First possible date on the "To" datepicker
        .click(report.toCalendar.toggle)
        .click(report.toCalendar.day.withText('1'))
        //7. Select the Second possible date on the "From" datepicker
        .click(report.fromCalendar.toggle)
        .click(report.fromCalendar.day.withText('2'))
        //8. Click on the "Save" button
        .click(report.saveButton)
        //9. Check the Fields
         .expect(report.fromDate.error.innerText).contains(biggerThanField,'The "From" datepicker should display "Can not be bigger than"')
         .expect(report.toDate.error.innerText).contains(minorThanField,'The "To" datepicker should display "Can not be minor than"')
        //10. Insert @reportName in the "Report Name" input
        .typeText(report.reportNameInput,reportName,paste)
        //11. Insert @businessPurpose in the "Business Purpose" input
        .typeText(report.businessPurposeInput,businessPurpose,paste)
        //12. Select @fromDate in the "From" date picker
        .click(report.fromCalendar.toggle)
        .click(report.fromCalendar.day.withText('1'));
    //13. Select @toDate in the "To" date picker
    let day = await report.toCalendar.selectLastDay();
    try {
        await t
            //14. Click the "Save" button
            .click(report.saveButton)
            //15. Check the Report page UI
            .expect(page.title.innerText).eql(reportName)
            .expect(report.reportName.innerText).contains(reportName)
            .expect(report.businessPurpose.innerText).contains(businessPurpose)
            .expect(report.detailsfromDate.innerText).contains('1')
            .expect(report.detailstoDate.innerText).contains(day);
            try {
                await t
                    //16. Insert a Comment in the "Add Comment" textarea
                    .typeText(report.textArea, 'Comment ' + reportName, paste)
                    .expect(report.textArea.value).eql('Comment ' + reportName)
                    //17. Click the "Reset" button
                    .click(report.resetButton)
                    //18. Insert a Comment in the "Add Comment" textarea        
                    .typeText(report.textArea, 'Comment ' + reportName, paste)
                    //19. Click the "Post" button 
                    .click(report.postButton);
                //20. Check the Comment image
                let imageURL = await report.noteImage.nth(1).getAttribute('src');
                let userId = getVariable(imageURL, 'user_id');
                let dropdownImageURL = await page.userDropdown.image.getAttribute('src');
                let dropdownUserId = getVariable(dropdownImageURL, 'user_id');
                await t
                    .expect(userId).eql(dropdownUserId)
                    .expect(report.noteItem.nth(1).innerText).contains('Comment ' + reportName)
                    //21. Click the "Add Expense" button
                    .click(report.addExpenseButton)
                    //22. Click "Cancel" in the "Add Expense" section
                    .click(expense.cancelButton)
                    //23. Click "Select from Library"
                    .click(report.selectFromLibraryButton)
                    //24. Check library elements
                    .expect(expensesLibraryModal.expenseLibraryTable.exists).ok('The "Elements" form should exist')
                    .expect(expensesLibraryModal.addExpenseToReportButton.exists).ok('The "Add" expense button should exist')
                    .expect(expensesLibraryModal.cancelExpenseToReportButton.exists).ok('The "Cancel" expense button should exist')
                    .click(expensesLibraryModal.expenseLibraryTable.rows.nth(1).find('td input'))
                    //25. Click "Add expense to Report"
                    .click(expensesLibraryModal.addExpenseToReportButton)
                    .wait(1000)
                    .expect(report.reportName.innerText).contains(reportName, "Report Name was not correctly displayed");
                await t
                    .click(report.saveAsDraftButton)
                    .expect(report.commentGloveIcon.exists, longTimeout).ok('The Comment icon should be displayed so the reports table')
                    .typeText(reportsPage.allNameInput, reportName, paste)
                    .pressKey('enter')
                    .expect(reportsPage.firstRowReportsTable.find('td').withText(reportNameTrunc).exists).ok('The Report should be exist');
                    //29. Delete report
                await t
                    .expect(await report.deleteReport(reportNameTrunc)).ok('The Report should be deleted')
                    .click(report.resetButtonSearch)
                    //30. Check thats not exists
                    .click(report.statusSearch)
                    .click(report.statusSearch.find('p').nth(1))
                    .pressKey('enter')
                await t
                    .expect(reportsPage.firstRowReportsTable.find('td').withText(reportNameTrunc).exists).notOk('The Report should not be exist'); 
            } catch (error) {
                let reports = await apiHandler.getAllTEMReports();
                let report = await reports.find(element => element.report_name == reportName);
                if(report != null) {
                    await apiHandler.deleteReport(report.report_id);
                }
                throw error;
            }
    } catch (err) {
        throw err;
    }
});

test('TC 25146: Creates a Project Code', async t => {
    let projectCodesPage = new ProjectCodesPage();
    let menues = t.fixtureCtx.menues;
    let configuration = getMenu(menues,301);
    let costAllocation = getMenu(configuration.submenu,30101);
    let projectCodes = getMenu(costAllocation.submenu,3010103);
    let name = 'Name ' + uniqueId;
    let code = 'Code ' + uniqueId;
    
    await t
        //2. Go to Corcentric Expense
        //3. Click on the Configuration menu on the left
        .click(byID(configuration.action_key))
        //4. Click on Cost Allocation 
        .click(byID(costAllocation.action_key))
        //5. Click on Project Codes
        .click(byID(projectCodes.action_key));
    await t
        .wait(2000)
        //6. Insert a Project name
        .typeText(projectCodesPage.projectNameInput, name, paste)
        //7. Insert a Project code
        .typeText(projectCodesPage.projectCodeInput, code, paste)
        //8. Select "today" as the Effective date
        .click(projectCodesPage.datePicker)
        .click(projectCodesPage.datePicker)
        //9. Click the "Add new" button - The New Project code is created and displayed on the Project codes table
        .click(projectCodesPage.addNewButton)
        .wait(2000);
    try {
        //10. Check on table
        await t
            .expect(await projectCodesPage.searchProjectCode(name)).ok('The Project Code should be exists');
        //11. Delete the recently created Project code
        await t
            .expect(await projectCodesPage.deleteProjectCode(name)).ok('The Project Code should be deleted');
        //12. Check delete
        await t
            .expect(await projectCodesPage.searchProjectCode(name)).notOk('The Project Code should not be exists');        
    } catch (error) {
        let allProjectCodes = await apiHandler.getAllProjectCodes();
        let pCode = allProjectCodes.find(element => element.project_code == code);
        if (pCode = ! null) {
            await apiHandler.deleteProjectCode(pCode.project_id);
        }
        throw error;
    }
});
//TODO: add a control of status code from the response of addprojectcode api method
test('TC 27879: Duplicate Project Code', async t => {
    let projectCodesPage = new ProjectCodesPage();
    let duplicateContentPopup = new InfoModal();
    let menues = t.fixtureCtx.menues;
    let configuration = getMenu(menues, 301);
    let costAllocation = getMenu(configuration.submenu, 30101);
    let projectCodes = getMenu(costAllocation.submenu, 3010103);
    let projectCode = 'code' + uniqueId;
    let projectCodeName = 'name' + uniqueId;
    let labels = t.fixtureCtx.labels;

    await t
        //2. Go to Corcentric Expense
        //3. Click on the Configuration menu on the left
        .click(byID(configuration.action_key))
        //4. Click on Cost Allocation 
        .click(byID(costAllocation.action_key))
        //5. Click on Project Codes
        .click(byID(projectCodes.action_key));
    await t
        .wait(2000)
        //6. Insert a Project name
        .typeText(projectCodesPage.projectNameInput, projectCodeName, paste)
        //7. Insert a Project code
        .typeText(projectCodesPage.projectCodeInput, projectCode, paste)
        //8. Select "today" as the Effective date
        .click(projectCodesPage.datePicker)
        .click(projectCodesPage.datePicker)
        //9. Click the "Add new" button - The New Project code is created and displayed on the Project codes table
    try {
        await t
            .click(projectCodesPage.addNewButton)
            .wait(2000);
        //10. Check on table
        await t
            .expect(await projectCodesPage.searchProjectCode(projectCodeName)).ok('The Project Code should be exists');
        await t
            //11. Insert a Project name (Duplicate)
            .typeText(projectCodesPage.projectNameInput, projectCodeName, paste)
            //12. Insert a Project code (Duplicate)
            .typeText(projectCodesPage.projectCodeInput, projectCode, paste)
            //13. Click the "new" button - The New Project code is created and displayed on the Project codes table
            .click(projectCodesPage.addNewButton)
            .expect(duplicateContentPopup.header.exists).ok('Info modal should be displayed')
            .expect(duplicateContentPopup.title.innerText).match(insensitive(labels['ui-cm-013']), 'The "Page Title" was wrong', timeout)
            //14. Click on close button
            .expect(duplicateContentPopup.closeButton.exists).ok('The close button should be displayed')
            .click(duplicateContentPopup.closeButton);
        //11. Delete the recently created Project code
        await t
            .expect(await projectCodesPage.deleteProjectCode(projectCodeName)).ok('The Project Code should be deleted');
        //12. Check delete
        await t
            .expect(await projectCodesPage.searchProjectCode(projectCodeName)).notOk('The Project Code should not be exists');
    } catch (error) {
        let allProjectCodes = await apiHandler.getAllProjectCodes();
        let pCode = allProjectCodes.find(element => element.project_code == projectCode);
        if (pCode = ! null) {
            await apiHandler.deleteProjectCode(pCode.project_id);
        }
        throw error;
    }   
});

test('TC 25323: Creates a Distance Rate', async t => {
    let distanceRateSetup = getMenu(t.fixtureCtx.settingsMenu.submenu,30104);
    let distanceRateSetupPage = new DistanceRateSetupPage();
    let confirmModal = new ConfirmModal();
    let firstDeleteButton = Selector('button.btn-action').nth(1);
    let rate = '0.999';

    await t
        //2. Go to Corcentric Expense
        //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on the Settings menu
        .click(byID(t.fixtureCtx.settingsMenu.action_key))
        //5. Click on Distance Rate Setup
        .click(byID(distanceRateSetup.action_key)).wait(11000);
    await t
        //6. Choose "Kilometer" in the dropdown
        .click(distanceRateSetupPage.unitDropdown)
        .click(distanceRateSetupPage.unitDropdownOptions.nth(1))
        //7. Type 1 in the currency input
        .typeText(distanceRateSetupPage.rateInput, rate, paste)
        //8. Select dollar as the currency
        .click(distanceRateSetupPage.currencyDropdown)
        .click(distanceRateSetupPage.currencyDropdownOptions.nth(1))
        //9. Type 1 in the distance input
        .typeText(distanceRateSetupPage.perInput,'1',paste)
        //10. Select "today" as the effective date
        .click(distanceRateSetupPage.datePicker)
        .click(distanceRateSetupPage.datePicker)
        //11. Click the "Add New" button
        .click(distanceRateSetupPage.addNewButton)
        .wait(1000);
    await t
        .expect(await distanceRateSetupPage.existsDistanceRate(rate)).ok('The distance rate should be displayed');
        //12. Order by "Effective Date"
        try {
            await t
                .click(distanceRateSetupPage.table.headers.nth(5), position)
                .click(distanceRateSetupPage.table.headers.nth(5), position)
                //13. Delete the "Distance"
                .click(firstDeleteButton)
                .click(confirmModal.acceptButton);
            await t
                .expect(await distanceRateSetupPage.existsDistanceRate(rate)).notOk('the distance rate should be deleted');
        } catch (error) {
            let allDistanceRates = await apiHandler.getAllDistanceRates();
            let distanceRate = allDistanceRates.find(element => element.rate == rate);
            if(distanceRate != null){
                await apiHandler.deleteDistanceRate(distanceRate.distance_id);
            }
           throw error; 
        }
});

test.skip('TC 25330: Creates an Email Template', async t => {

    let emailTemplatesMenu = getMenu(t.fixtureCtx.notificationMenu.submenu,30111);
    let emailTemplatesPage = new EmailTemplatesPage();
    let emailName = `NAME_${uniqueId}`;
    let emailSubject = `SUBJECT_${uniqueId}`;

    await t
        //2. Go to TEM
        //3. Click on the Configuration menu on the left side
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on the Notifications menu on the left side
        .click(byID(t.fixtureCtx.notificationMenu.action_key))
        //5. Click on Email Templates
        .click(byID(emailTemplatesMenu.action_key));
    await t
        .expect(emailTemplatesPage.addNewButton.visible).ok("Add New button must be exists",longTimeout)
        //6. Click on "Add New"
        .click(emailTemplatesPage.addNewButton)
        //7. Add a Unique Name
        .typeText(emailTemplatesPage.templateNameInput, emailName, paste)
        //8. Add a Unique Subject
        .typeText(emailTemplatesPage.subjectInput, emailSubject, paste)
        //9. Select Expense Report on the Business object dropdown
        .click(emailTemplatesPage.editorTextArea) //To make it active
        .click(emailTemplatesPage.businessObjectsDropdown)
        .click(emailTemplatesPage.businessObjectsDropdownOptions.nth(0))
        //10. Add some fields to the template
        .click(emailTemplatesPage.fieldsItems.nth(2))
        //11. Click on Save
        .click(emailTemplatesPage.saveButton)
        //.click(emailTemplatesPage.cancelButton)
        .wait(2000);
    try {
        //12. Search the Email template with the filter
        await t
            .expect(await emailTemplatesPage.existsTemplate(emailName)).ok('The Templete should be exists');
        //12. Delete the template
        await emailTemplatesPage.deleteTemplate(emailName);
        //13. Check delete template
        await t.expect(await emailTemplatesPage.existsTemplate(emailName)).notOk('The Templete should not be exists');        
    } catch (error) {
        let allTemplates = await apiHandler.getAllEmailsTemplate();
        let template = allTemplates.find(element => element.email_template_name == emailName);
        if(template != null){
            await apiHandler.deleteEmailTemplate(template.email_template_id);
        }
        throw error;
    }
    
});

test('TC 25331: Creates a new Policy', async t => {
    let policiesPage = new PoliciesPage();
    let menues = t.fixtureCtx.menues;
    let configuration = getMenu(menues,301);
    let complianceSetup = getMenu(configuration.submenu,30110);
    let policies = getMenu(complianceSetup.submenu,3011001);
    let infoModal = new InfoModal();
    let policyName = `NAME_${uniqueId}`;

    await t
        //2. Go to TEM
        //3. Click on Configuration
        .click(byID(configuration.action_key))
        //4. Click on Compliance Setup
        .click(byID(complianceSetup.action_key))
        //5. Click on Policies
        .click(byID(policies.action_key)).wait(11000);
    await t
        .expect(policiesPage.addNewPolicyButton.visible, longTimeout).ok('The new button should be visible')
        //6. Click on "Add New Policy"
        .click(policiesPage.addNewPolicyButton)
        //7. Type a Unique Policy name
        .typeText(policiesPage.policyNameInput, policyName, paste)
        //8. Click "Save"
        .click(policiesPage.saveButton)
        //9. Accept the info modal
        .wait(5000)
        .click(infoModal.closeButton);
        try {
            await t
                .expect(await policiesPage.searchPolicy(policyName)).ok('The Policy should be created')
                //10. Delete the Policy
                .expect(await policiesPage.deletePolicy(policyName)).ok('The Policy should be deleted')
                //11. Check delete policy
                .expect(await policiesPage.searchPolicy(policyName)).notOk('The Policy should not be exist')
        } catch (error) {
            let policies = await apiHandler.getAllPolicies();
            let policy = policies.find(element => element.policy_name == policyName);
            console.log(policy);
            if(policy != null){
                await apiHandler.deletePolicy(policy.policy_id);
            }
            throw error;
        }
});

test('TC 25333: Creates a new Rule', async t => {
    let rulesPage = new RulesPage();
    let complianceSetupMenu = getMenu(t.fixtureCtx.configurationMenu.submenu,30110);
    let rules = getMenu(complianceSetupMenu.submenu,3011002);
    let ruleName = `NAME_${uniqueId}`;
    let ruleMessage = `MESSAGE_${uniqueId}`;

    await t
    //2. Go to TEM
    //3. Click on Configuration
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Compliance
        .click(byID(complianceSetupMenu.action_key))
    //5. Click on Rules
        .click(byID(rules.action_key), longTimeout).wait(12000);
    await t
    //6. Click on "Add New Rule"
        .click(rulesPage.addNewRuleButton, longTimeout);
    await t
        .wait(2000)
    //7. Type a Unique Rule Name
        .typeText(rulesPage.ruleNameInput, ruleName, paste)
    //8. Type a Unique Rule Message
        .typeText(rulesPage.ruleMessageTextarea, ruleMessage, paste)
        .click(rulesPage.ruleCriteriaDropdown.find('i'))
        .click(rulesPage.ruleCriteriaDropdown.find('p').nth(1))
        .wait(2000)
    //9. Click "Save"
        .click(rulesPage.saveButton);
    try {
        await t
            .wait(2000)
            //10. Check rule on table
            .expect(await rulesPage.existsRule(ruleName)).ok('The Rule should be exists')
            //11. Delete the Rule
            .expect(await rulesPage.deleteRule(ruleName)).ok('The Rule should be deleted')
            //12. Check not exists rule in table
            .expect(await rulesPage.existsRule(ruleName)).notOk('The Rule should not be exists');     
    } catch (error) {
        let rules = await apiHandler.getAllRulesLibrary();
        let rule = rules.find(element => element.rule_name == ruleName);
        if(rule != null){
            await apiHandler.deleteRule(rule.rule_id);
        }
    }
});

test.skip('TC 25340: Creates a new Role', async t => {
    let manageRolesPage = new ManageRolesPage();
    let newRole = new NewRole();
    let confirmModal = new ConfirmModal();

    let labels = t.fixtureCtx.labels;
    let manageRoles = getMenu(t.fixtureCtx.groupsMenu.submenu,30114);
    let manageRolesMenu = byID(manageRoles.action_key);
    let rol = `ROLE_${uniqueId}`;
    
    await t
    //2. Go to Corcentric Expense
    //3. Click on Configuration
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Manage Roles
    //Click groups menu
        .click(byID(t.fixtureCtx.groupsMenu.action_key))
        .click(manageRolesMenu)
    //5. Click on "Add role"
        .click(manageRolesPage.addRoleButton)
    //6. Complete the Role input with a unique value
        .typeText(newRole.roleInput, rol, paste)
    //7. Click "Add" button
        .click(newRole.addButton)
        .expect(confirmModal.title.innerText).contains(labels['ui-manageroles-038'], 'Successfully added message title is not correct')
        .expect(confirmModal.body.innerText).contains(labels['ui-manageroles-039'], 'Successfully added message is not correct')
        .click(confirmModal.acceptButton)
        .click(newRole.closeButton);
    try {
        //8. Check new Role added
        await t.expect(await manageRolesPage.findRole(rol)).ok('The Role was not added');

        //9. Delete the Role
        await t.expect(await manageRolesPage.deleteRole(rol)).ok('The Role should be deleted');
        await t.expect(await manageRolesPage.findRole(rol)).notOk('The Role should not be exists');
    } catch (err) {
        let roles = await apiHandler.getTEMRoles();
        let role = roles.find(element => element.role_name == rol)
        if (role != null) {
            await apiHandler.deleteRole(role.role_id)
        }
        throw err;
    }
    await t
    //10. Click on "Add role"
        .click(manageRolesPage.addRoleButton)
    //11. Complete the Role input with a unique value and enable Default checkbox
        .typeText(newRole.roleInput, rol, replace)
        .click(newRole.defaultCheckbox)
    //12. Click "Add" button
        .click(newRole.addButton)
        .expect(confirmModal.title.innerText).contains(labels['ui-manageroles-038'], 'Successfully added message title is not correct')
        .expect(confirmModal.body.innerText).contains(labels['ui-manageroles-039'], 'Successfully added message is not correct')
        .click(confirmModal.acceptButton)
        .click(newRole.closeButton);
    try {
        //13. Check new Role added as default
        await t.expect(await manageRolesPage.findRole(rol)).ok('The Role should be added');
        await t.expect(await manageRolesPage.isDefault(rol)).ok('The Role should be default');
        //14. Delete the Role
        await t.expect(await manageRolesPage.deleteRole(rol)).ok('The Role should be deleted');
        await t.expect(await manageRolesPage.findRole(rol)).notOk('The Role should not be exists');
    } catch (error) {
        let roles = await apiHandler.getTEMRoles();
        let role = roles.find(element => element.role_name == rol)
        if(role != null){
            await apiHandler.deleteRole(role.role_id)
        }
        throw error;
    }
    
});

test('TC 25341: Creates a new Group', async t => {
    let groupsPage = new GroupsPage();
    let addEditGroupsModal = new AddEditGroupsModal();
    let labels = t.fixtureCtx.labels;
    let manageGroupsMenu = getMenu(t.fixtureCtx.groupsMenu.submenu,30107);

    let groupTypes = await apiHandler.getGroupTypes();
    let approvalGroupType = (await getByKey(groupTypes.items,'type_id',1)).type_name;
    let groups = await apiHandler.getGroupsByType(1);
    let parentGroupName = groups.items[0].group_name; 

    let groupName = `25341TestGroup_${uniqueId}`;
    
    await t
    //2. Go to TEM
    //3. Click on Configuration
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Groups
        .click(byID(t.fixtureCtx.groupsMenu.action_key))
        .click(byID(manageGroupsMenu.action_key))
    //5. Click on "Add/Edit Groups"
        .expect(groupsPage.button.withText(labels['ui-group-036']).exists).ok('New button is not present', longTimeout)
        await t.click(groupsPage.button.withText(labels['ui-group-036']));
        await t
            .click(addEditGroupsModal.groupTypeDropdown)  
            .click(addEditGroupsModal.dropdownOptions.withText(approvalGroupType))  
            //6. Type a Unique Group Name
            .typeText(addEditGroupsModal.groupNameInput,groupName,paste)
            .click(addEditGroupsModal.parentGroupDropdown)
            .click(addEditGroupsModal.dropdownOptions.withText(parentGroupName))
            .click(addEditGroupsModal.saveButton);
        try {
            await t
            //7. Check in table
                .click(groupsPage.groupTypeDropdown)
                .click(groupsPage.dropdownOptions.withText(approvalGroupType));
            await t.expect(await groupsPage.existsGroup({groupName: groupName, parentName: parentGroupName})).ok('Group should exist.', timeout);
            await t
                .expect(await groupsPage.deleteGroup({groupName: groupName, parentName: parentGroupName})).ok('Group could not be deleted.')
                .expect(await groupsPage.existsGroup({groupName: groupName, parentName: parentGroupName})).notOk('Group should not be exist.', timeout)
        } catch (error) {
            let groups = await apiHandler.getAllGroups(group.type_id);
            let group= await groups.items.find(element=>element.group_name === groupName);
            await apiHandler.deleteGroup(group.group_id, group.type_id);
            throw error;
        }    
});

test('TC 25342: Creates a new User', async t => {
    let manageUsersPage = new ManageUsersPage();
    let newUser = new NewUser();
    let menues = t.fixtureCtx.menues;
    let configuration = getMenu(menues,301);
    let manageUsers = getMenu(configuration.submenu,30106);
    let manageUsersSub = getMenu(manageUsers.submenu,3010603);
    let confirmModal = new ConfirmModal();
    let requiredField = t.fixtureCtx.labels['msg-00-002'];
    let name = `FIRST_${uniqueId}`;
    let lastName = `LAST_${uniqueId}`
    
    await t
        //2. Go to TEM
        //3. Click on Configuration
        .click(byID(configuration.action_key))
        //4. Click on Manage Users
        .click(byID(manageUsers.action_key))
        //5. Click on Manage Users
        .click(byID(manageUsersSub.action_key));
    await t
        .wait(9000)
        //6. Click on "Add User"
        .click(manageUsersPage.addUserButton)
        //7. Click on "Save"
        .click(newUser.saveButton)
        //8. Check Required fields
        .expect(newUser.username.error.innerText).contains(requiredField,'The Username input should display "Required field"')
        .expect(newUser.firstName.error.innerText).contains(requiredField,'The First name input should display "Required field"')
        .expect(newUser.email.error.innerText).contains(requiredField,'The Email input should display "Required field"')
        .expect(newUser.lastName.error.innerText).contains(requiredField,'The Last name input should display "Required field"')
        //9. Complete the Username
        .typeText(newUser.username,`USER_${uniqueId}`,paste)
        //10. Complete the First name
        .typeText(newUser.firstName, name,paste)
        //11. Complete the Email
        .typeText(newUser.email,'test@test.com',paste)
        //12. Complete the Middle name
        .typeText(newUser.middleName,`MID_${uniqueId}`,paste)
        //13. Pick a Status
        .click(newUser.statusDropdown)
        .click(newUser.statusDropdownOptions.nth(2))
        //14. Complete the Last name
        .typeText(newUser.lastName, lastName,paste);
    try {
        await t
            //15. Click "Save"
            .click(newUser.saveButton)
            .wait(2000)
            .expect(confirmModal.acceptButton.exists, longTimeout).ok('The "Accept" button modal should exist')
            .click(confirmModal.acceptButton)
        //16. Check that user exists
        let usuarios = await apiHandler.getUsers(name, lastName);
        await t
            .expect(await manageUsersPage.existsUser(usuarios.total)).ok('The user should be exist.')
            //17. Delete the User
            .click(manageUsersPage.resetButton)
            .expect(await manageUsersPage.deleteUser(name, lastName)).ok("The User must be deleted")
            //18. Check delete user
            .click(manageUsersPage.resetButton);
        usuarios = await apiHandler.getUsers(name, lastName);
        await t
            .expect(await manageUsersPage.existsUser(usuarios.total)).notOk('The user should not be exist.')
    } catch (error) {
        let user = await apiHandler.getUsers(name, lastName);
        if(user != null) {
            await apiHandler.deleteUser(user.items[0].user_id);
        }
        throw error;
    }
        
});

test.skip('TC 26053: Assign Group-Role to user', async t => {
    
    let menues = t.fixtureCtx.menues;
    let configuration = getMenu(menues, 301);
    let manageUsers = getMenu(configuration.submenu, 30106);
    let manageUsersSub = getMenu(manageUsers.submenu, 3010603);
    let manageUsersPage = new ManageUsersPage()
    let manageGroupRolePage = new ManageGroupRolePage();
    let confirmModal = new ConfirmModal();
    let manageGroupRole = getMenu(t.fixtureCtx.manageUsersMenu.submenu,3010606);

    let groupTypeLabels = await apiHandler.getGroupTypes();
    let rolesLabels = await apiHandler.getRoles();

    let groupTypeObj = await getByKey(groupTypeLabels.items,'type_id',1); 
    let groupType = groupTypeObj.type_name; //Approval

    let role = await getByKey(rolesLabels.items,'role_id',4);
    let roleName = role.role_name //System Administrator

    let userName = 'Test Good'
    
    //1. Prerequisite: add @Group
    let groupName = `26053TestGroup_${uniqueId}`;
    let group = await apiHandler.addGroup(groupName,1);
 
    //3. Go to Corcentric Expense
    //4. Click on Configuration
    try {
        await t
            .click(byID(t.fixtureCtx.configurationMenu.action_key))
        
        //5. Click on Users->Manage Group-Role
            .click(byID(t.fixtureCtx.manageUsersMenu.action_key))
            .click(byID(manageGroupRole.action_key));
            
        //6. Search and click actual user "Test Good" 
        await t
            .expect(await manageGroupRolePage.searchUser(userName)).ok('The user was not found')
            
        //7. Select "Approval" in Group Type, @Group in Group and "System Administrator" in Role and click Add button
            //Group Type
            .click(manageGroupRolePage.groupTypeDropdown)
            .click(manageGroupRolePage.dropdownOptions.find('p').withText(groupType))
            //Group
            .click(manageGroupRolePage.groupDropdown.find('input'))
        await t
            .expect(await manageGroupRolePage.clickGroupOption(groupName)).ok('Group option could not be clicked')
            //Role
            .click(manageGroupRolePage.roleDropdown)
            .click(manageGroupRolePage.dropdownOptions.find('p').withText(roleName))
            //Click Add button
            .click(manageGroupRolePage.addButton)
            .wait(2000);
            
        //8. Check Membership is added to user
        await t
        //Membership table.
            .expect(await manageGroupRolePage.isMembership({groupName: groupName, roleName: roleName})).ok('Membership was not added in table');
        //Profile.
        let userDropdown = new UserDropdown();
        await t
            .click(userDropdown.toggle)
            .click(userDropdown.roles)
            .expect(userDropdown.dropdownItem.withText(`${groupName} - ${roleName}`).exists).ok('Membership was not added to the Profile')
            .click(userDropdown.toggle);
     
        //9. Set added membership as default
        let defaultMembership = await manageGroupRolePage.getDefaultMembership();
        await t.expect(await manageGroupRolePage.setDefaultMembership({groupName: groupName, roleName: roleName})).ok('Could not select default membership');
       
        //10. Click delete icon on membership 
        await t
            .expect(await manageGroupRolePage.deleteMembership({groupName: groupName, roleName: roleName})).ok('Delete icon was clicked')
            .wait(2000);
        //Check deletion not made.
        //In table.
        await t
            .expect(await manageGroupRolePage.isMembership({groupName: groupName, roleName: roleName})).ok(`Membership was deleted from table`);
        //In Profile.
        await t
            .click(userDropdown.toggle)
            .click(userDropdown.roles)
            .expect(userDropdown.dropdownItem.withText(`${groupName} - ${roleName}`).exists).notOk('Membership was not removed from the Profile');
        
       
        //11. Set previous membership as default 
        await t.expect(await manageGroupRolePage.setDefaultMembership(defaultMembership)).ok('Could not select default membership');

        //12. Delete Membership from table
        await t.expect(await manageGroupRolePage.deleteMembership({groupName: groupName, roleName: roleName})).ok('Delete icon was clicked')
                .wait(2000);
        //Check deletion.
        await t.expect(await manageGroupRolePage.isMembership({groupName: groupName, roleName: roleName})).notOk(`Membership was not deleted from table`);  

        //11. Postrequisite: Delete @Group
        await apiHandler.deleteGroup(group.group_id,1); 
        await t
            .click(byID(manageUsersSub.action_key)).wait(10000);
        await t
            .expect(manageUsersPage.table.exists).ok(' manage user table should be displayed')
            .typeText(manageUsersPage.firstNameInput, 'Test')
            .typeText(manageUsersPage.emailInput, 'hborda@corcentric.com')
            .pressKey('enter');
        await t
            .click(manageUsersPage.table.rows.find('i.fa.fa-pencil').nth(1))
            .click(manageUsersPage.userRoleTab)
            .expect(manageUsersPage.roleLeft.exists).ok('the role table should be displayed')
        await manageUsersPage.addRoles('Executive');
        await manageUsersPage.addRoles('Employee');
        await manageUsersPage.addRoles('Manager');
        await t
            .click(manageUsersPage.saveButton)
            .expect(confirmModal.header.exists).ok('The confirmation modal should be displayed')
            .click(confirmModal.footerButtons);
     }
    catch (err){
        //11. Postrequisite: Delete @Group
        try {
            await apiHandler.deleteMembership(group.group_id,role.role_id,1);
        }
        catch(error) {
            console.log('Membership could not be removed or was already deleted.')
            throw error;
        }
        await apiHandler.deleteGroup(group.group_id,1);
        throw err;
    } 
});

test.skip(`TC 26769: Categories Permissions Validation`, async t =>{
    let error;
    let roleName = `26769TestRole_${uniqueId}`;
    let manageRolesPage = new ManageRolesPage();
    let labels = t.fixtureCtx.labels;

    let groupTypes = await apiHandler.getGroupTypes();
    let approvalGroupType = (await getByKey(groupTypes.items,'type_id',1)).type_name; 

    let manageRoles = getMenu(t.fixtureCtx.groupsMenu.submenu,30114);
    let manageRolesMenu = byID(manageRoles.action_key);

    let associatedGroup = (await apiHandler.getGroupsByType(1)).items[0];
    let groupName = associatedGroup.group_name;

    //Precondition create @Role and assign it to @Username
    let role = await apiHandler.addRole(roleName);
    let membership = await apiHandler.addMembership(associatedGroup.group_id,role.role_id,1);
    
    try {

        await t
        
        //2. Go to Corcentric Expense
        //3. Click on Configuration -> Groups -> Manage Roles
            .click(byID(t.fixtureCtx.configurationMenu.action_key))
            .click(byID(t.fixtureCtx.groupsMenu.action_key))
            .click(manageRolesMenu)

        //5. Go to "Categories" tab
            .click(manageRolesPage.categoriesTab)
        
        //6. Choose @Role from dropdown
            .click(manageRolesPage.rolesDropdown)
            .click(manageRolesPage.dropdownOptions.withText(roleName));
        
        //7. Uncheck following categories: Reports, Expenses, Receipts, Approvals, Dashboards
        //    and Configuration. Click Save permissions button.

        let categories = await apiHandler.getCategoriesByRole(role.role_id);

        for(let i=0; i<categories.length; i++){
            //101 is Home menu_id.
            if(categories[i].menu_id !== 101){
                if(categories[i].has_access){
                    await t.expect(await manageRolesPage.selectCategory(categories[i].title)).ok(`${categories[i].title} could not be disabled`);
                }
            }
            else {
                if(!categories[i].has_access){
                    await t.expect(await manageRolesPage.selectCategory(categories[i].title)).ok(`${categories[i].title} could not be disabled`);
                }
            }           
        }

        await t.click(manageRolesPage.savePermissionsButton);

        await t.eval(() => location.reload(true));

        //8. Click on profile icon and select the added membership.
        let userDropdown = new UserDropdown();
        let dashboardButtons = Selector('div.button-group-dashboard');
        await t
            .click(userDropdown.toggle)
            .click(userDropdown.roles)
            .click(userDropdown.dropdownItem.withText(`${groupName} - ${roleName}`))

        //9. Go to Corcentric Expense
            .click(dashboardTitles.withText(t.fixtureCtx.app))
        //Options should not be displayed in Home: "Manage Approvals", "Add a Report", "Add an Expense", "Add a Receipt", "Dashboards".
            .expect(dashboardButtons.withText(labels['ui-00-031']).exists).notOk('The "Add a Report" button should not exist')
            .expect(dashboardButtons.withText(labels['ui-00-032']).exists).notOk('The "Add an Expense" button should not exist')
            .expect(dashboardButtons.withText(labels['ui-00-033']).exists).notOk('The "Add a Receipt" button should not exist')
            .expect(dashboardButtons.withText(labels['ui-00-034']).exists).notOk('The "Manage Approvals" button should not exist')
            .expect(dashboardButtons.withText(labels['ui-00-035']).exists).notOk('The "Dashboards" button should not exist');

        //10. Check left side bar menu
        let menus = [ 
            byID(getMenu(t.fixtureCtx.menues,102).action_key), //Reports
            byID(getMenu(t.fixtureCtx.menues,103).action_key), //Expenses
            byID(getMenu(t.fixtureCtx.menues,104).action_key), //Receipts
            byID(getMenu(t.fixtureCtx.menues,105).action_key), //Approvals
            byID(getMenu(t.fixtureCtx.menues,106).action_key), //Dashboards
            byID(getMenu(t.fixtureCtx.menues,301).action_key)  //Configuration
        ];

        await t.expect(byID(getMenu(t.fixtureCtx.menues,101).action_key).exists).ok('Home menu should exists');
        for(let i = 0; i < menus.length; i++){
            await t.expect(menus[i].exists).notOk(`Left side menus are not correct`);
        }
    }
    catch(err){
        error = err;
    }

    //12. Postrequisite: delete @Role and membership
    await apiHandler.deleteMembership(associatedGroup.group_id,role.role_id,1);
    await apiHandler.deleteRole(role.role_id);
    await apiHandler.temLogout();

    if(error){
        throw error;
    }  
});

test('TC 26907: Receipt Library Creation', async t => {
    let receiptsPage = new ReceiptsPage();
    let menues = t.fixtureCtx.menues;
    let receipts = getMenu(menues,104);
    let allReceiptsBefore = await apiHandler.getAllReceipts();
    
    await t
        //2. Go to Receipts
        .click(byID(receipts.action_key))
        //3. Select one file for upload
        .expect(receiptsPage.uploadInput.exists).ok('The "Upload" input should exist');
        
        await t
            .setFilesToUpload(receiptsPage.uploadInput, './../../../mock-files/testReceipt.jpg')
            .wait(5000);
                //4. Delete Receipts  
        try {
            await t 
                .click(receiptsPage.firstDeleteButton)
                .click(receiptsPage.modalDeleteConfirm.find('button'))
                .wait(2000);
        } catch (error) {
            let allReceipts =  await apiHandler.getAllReceipts();
            if(allReceipts.length > allReceiptsBefore.length){
                await apiHandler.deleteReceipt(allReceipts[0].receipt_id);
            }
            throw error;
        }
});

p_Test(26927,`TC 26927: Add/Remove Policy to Group`, async t => {
    let error;
    let groupTypeId = t.fixtureCtx.params['GroupType'];
    
    let groupsPage = new GroupsPage();
    let manageGroupsMenu = getMenu(t.fixtureCtx.groupsMenu.submenu,30107);
    let groupTypes = await apiHandler.getGroupTypes();
    let groupTypeOption = (await getByKey(groupTypes.items,'type_id',groupTypeId)).type_name;

    //1. Prerequisite: create @Group of @GroupType and @Policy 
    let groupName = `26927TestGroup_${uniqueId}`;
    let group = await apiHandler.addGroup(groupName,groupTypeId);
    let policyName = `26927TestPolicy_${uniqueId}${groupTypeId}`;
    let policy = await apiHandler.addPolicy(policyName);

    //3. Go to Corcentric Expense
    //4. Click on Configuration -> Groups -> Manage Groups
    try {
        await t
            .click(byID(t.fixtureCtx.configurationMenu.action_key))
            .click(byID(t.fixtureCtx.groupsMenu.action_key))
            .click(byID(manageGroupsMenu.action_key))

        //5. Go to "Assing Policy to Group" tab
            .click(groupsPage.assignPolicyToGroupTab)

        //6. Select @GroupType and @Group in dropdowns
            .click(groupsPage.assignPolicyGroupTypeDropdown.find('input'))
            .click(groupsPage.dropdownOptions.withText(groupTypeOption))
            .click(groupsPage.assignPolicyGroupsDropdown.find('input'));
        await t
            .expect(await groupsPage.clickGroupOption(groupName,groupsPage.assignPolicyGroupsDropdown)).ok('Group option could not be selected')
            
        //7. Type and select @Policy in search input
            .typeText(groupsPage.assignPolicySearchInput,policyName,paste);
        await t
            .expect(await groupsPage.clickInSearchList(policyName)).ok('Policy was not found in table')

        //8. Click Add right-arrow button
            .click(groupsPage.rightArrow);
        //Check policy added in table.
        await t
            .expect(await groupsPage.searchAddedElement(policyName)).ok('Policy was not correctly added');
        //Check policy added internally.
        let groupsPolicies = await apiHandler.getGroupPolicies(group.group_id);
        let policyInGroup = await getByKey(groupsPolicies,'policy_id',policy.policy_id);
        if(Object.keys(policyInGroup).length === 0){
            throw new ShortError('Policy was not added to group');
        }

        //9. Select @Policy in right table and click Delete left-arrow button
        await t
            .expect(await groupsPage.clickAddedElement(policyName)).ok('Could not click Policy in right table')
            .click(groupsPage.leftArrow);
        //Check deletion in right table.
        await t
            .expect(await groupsPage.searchAddedElement(policyName)).notOk('Policy was not correctly removed');
        groupsPolicies = await apiHandler.getGroupPolicies(group.group_id);
        policyInGroup = await getByKey(groupsPolicies,'policy_id',policy.policy_id);
        if(Object.keys(policyInGroup).length !== 0){
            throw new ShortError('Policy was not removed from Group');
        }
    }
    catch(err){
        error = err;
    }

    //11. Postrequisite: delete @Group and @Policy
    await apiHandler.deleteGroup(group.group_id,groupTypeId);
    await apiHandler.deletePolicy(policy.policy_id);

    if(error)
        throw error;

});

p_Test(26966,`TC 26966: Add/Remove User to Group`, async t => {
    let error;
    let groupTypeId = t.fixtureCtx.params['GroupType'];
    
    let groupsPage = new GroupsPage();
    let manageGroupsMenu = getMenu(t.fixtureCtx.groupsMenu.submenu,30107);
    let groupTypes = await apiHandler.getGroupTypes();
    let groupTypeOption = (await getByKey(groupTypes.items,'type_id',groupTypeId)).type_name;

    //1. Prerequisite: create @Group of @GroupType
    let groupName = `26966TestGroup_${uniqueId}`;
    let group = await apiHandler.addGroup(groupName,groupTypeId);
    let userName;
    let userId;

    //3. Go to Corcentric Expense
    //4. Click on Configuration -> Groups -> Manage Groups
    try {
        await t
            .click(byID(t.fixtureCtx.configurationMenu.action_key))
            .click(byID(t.fixtureCtx.groupsMenu.action_key))
            .click(byID(manageGroupsMenu.action_key));
        await t
        //5. Go to "Assing User to Group" tab
            .click(groupsPage.assignUserToGroupTab)

        //6. Select @GroupType and @Group in dropdowns
            .click(groupsPage.assignUserGroupTypeDropdown.find('input'))
            .click(groupsPage.dropdownOptions.withText(groupTypeOption))
            .click(groupsPage.assignUserGroupsDropdown.find('input'));
        await t
            .expect(await groupsPage.clickGroupOption(groupName,groupsPage.assignUserGroupsDropdown)).ok('Group option could not be selected')
            
        //7. Select first User in search input
        userName = (await groupsPage.switcherLeft.rows(0).innerText).trim();
        await t
            .click(groupsPage.switcherLeft.rows(0))

        //8. Click Add right-arrow button
            .click(groupsPage.rightArrow);
        //Check User added in table.
        await t
            .expect(await groupsPage.searchAddedElement(userName)).ok('User was not correctly added');
        //Check User added internally.
        let groupUsers = await apiHandler.getGroupUsers(group.group_id,groupTypeId);
        let userInGroup = await getByKey(groupUsers.items,'full_name',userName);
        if(Object.keys(userInGroup).length === 0){
            throw new ShortError('User was not added to group');
        }
        userId = userInGroup.user_id;

        //9. Select User in right table and click Delete left-arrow button
        await t
            .expect(await groupsPage.clickAddedElement(userName)).ok('Could not click User in right table')
            .click(groupsPage.leftArrow);
        //Check deletion in right table.
        await t
            .expect(await groupsPage.searchAddedElement(userName)).notOk('User was not correctly removed');
        groupUsers = await apiHandler.getGroupUsers(group.group_id,groupTypeId);
        userInGroup = await getByKey(groupUsers.items,'full_name',userName);
        if(Object.keys(userInGroup).length !== 0){
            throw new ShortError('User was not removed from Group');
        }
    }
    catch(err){
        error = err;
    }

    //11. Postrequisite: delete @Group
    if(userId){
        await apiHandler.deleteUserInGroup(group.group_id,groupTypeId);
    }
    await apiHandler.deleteGroup(group.group_id,groupTypeId);

    if(error)
        throw error;
});

test('TC 26957: \'Expense Categories Creation\'', async t => {
    let expenseCategoryPage = new ExpenseCategoryPage();
    let expenseCategory = getMenu(t.fixtureCtx.settingsMenu.submenu,3010101);
    
    await t
        //2. Go to Corcentric Expense
        //3. Click on the Configuration menu on the left
            .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on the Settings submenu
            .click(byID(t.fixtureCtx.settingsMenu.action_key))
        //5. Click on Expense Category
            .click(byID(expenseCategory.action_key));
        await t
            .expect(expenseCategoryPage.categoryNameInput.exists).ok('The "Category Name" input should exist',longTimeout)
        //6. Add Expense Category
            .typeText(expenseCategoryPage.categoryNameInput,`EXPCAT_${uniqueId}`,paste)
            .click(expenseCategoryPage.categoryDropdown)
            .click(expenseCategoryPage.optionCarIcon)
            .click(expenseCategoryPage.datePicker)
            .click(expenseCategoryPage.dateDay.nth(36))
            .click(expenseCategoryPage.addNewButton)
            .wait(2000);
        //7. Check Expense Category in table
        let allExpenseCategory = await apiHandler.getAllExpenseCategories();
        let expenseCategoryNew = await expenseCategoryPage.getExpenseCategory(`EXPCAT_${uniqueId}`,allExpenseCategory);
    try {
        await t.expect(await expenseCategoryPage.existsExpenseCategory(expenseCategoryNew.category_name)).ok('The Expense Category should be exists in the table');
        //8. Desactive Expense Category
        await t
            .expect(await expenseCategoryPage.selectExpenseCategory(expenseCategoryNew.category_name)).ok('The Expense Category should be exists')
            .click(expenseCategoryPage.actionsDropdown.find('i'))
            .click(expenseCategoryPage.actionsDropdownOptions.nth(1));
        //9. Delete new Expense Category
        await apiHandler.deleteExpenseCategory(expenseCategoryNew.category_id);
    }
    catch(err){
        await apiHandler.deleteExpenseCategory(expenseCategoryNew.category_id);
        throw err;
    }
}); 

test('TC 27187: Copy Roles Permissions', async t => {
    let manageRolesPage = new ManageRolesPage();
    let error;

    let role1Name = "27187_TestRole1";
    let role2Name = "27187_TestRole2";
    let role1 = await apiHandler.addRole(role1Name);
    let role2 = await apiHandler.addRole(role2Name);
    let systemAdministrator = (await apiHandler.getTEMRoles()).find(element => element.role_id === 4);
    let sysAdminPermissions = await apiHandler.getCategoriesByRole(4);
    let manageRoles = getMenu(t.fixtureCtx.groupsMenu.submenu,30114);
    let manageRolesMenu = byID(manageRoles.action_key);
    
    try{
        await t
        //3. Go to Corcentric Expense
        //4. Click on Configuration -> Groups -> Manage Roles
            .click(byID(t.fixtureCtx.configurationMenu.action_key))
            .click(byID(t.fixtureCtx.groupsMenu.action_key))
            .click(manageRolesMenu);

        //5. Go to "Categories" tab
        await t
            .click(await clickable(manageRolesPage.categoriesTab))

        //6. On "Copy Role Permissions from" Select Access on Category dropdown and select 
            //System Administrator on Roles dropdown
            .click(manageRolesPage.boxCategoryDropdown)
            .click(manageRolesPage.dropdownOptions.withText('Access')) //TODO check hardcoded option.
            .click(manageRolesPage.boxRolesDropdown)
            .click(manageRolesPage.dropdownOptions.withText(systemAdministrator.role_name))
        //7. Check @Role1 and @Role2 on "Available Roles" box
            .click(manageRolesPage.permissionsBoxElements.withAttribute('id',`${role1.role_id}`))
            .click(manageRolesPage.permissionsBoxElements.withAttribute('id',`${role2.role_id}`))
        
        //8. Click Apply button
            .click(manageRolesPage.applyButton)

        //9. Select @Role1 on main roles dropdown
            .click(manageRolesPage.rolesDropdown)
            .click(manageRolesPage.dropdownOptions.withExactText(role1Name))
        //Permissions should be the same as System Administrator.
        let role1Permissions = await apiHandler.getCategoriesByRole(role1.role_id);
        let comparePermissions = await manageRolesPage.comparePermissions(sysAdminPermissions,role1Permissions);
        await t.expect(comparePermissions).ok('Role1 permissions were not correctly copied');

        //10. Select @Role2 on main roles dropdown
        await t
            .click(manageRolesPage.rolesDropdown)
            .click(manageRolesPage.dropdownOptions.withExactText(role2Name))
        //Permissions should be the same as System Administrator.
        let role2Permissions = await apiHandler.getCategoriesByRole(role2.role_id);
        comparePermissions = await manageRolesPage.comparePermissions(sysAdminPermissions,role2Permissions);
        await t.expect(comparePermissions).ok('Role2 permissions were not correctly copied');
    }
    catch(err){
        error = err;
        if(role1) await apiHandler.deleteRole(role1.role_id);
        if(role2) await apiHandler.deleteRole(role2.role_id);
    }

    //Postconditions
    if(role1) await apiHandler.deleteRole(role1.role_id);
    if(role2) await apiHandler.deleteRole(role2.role_id);
    if(error) throw error;
    
});

test('TC 27372: Duplicate Policy', async t => {
    let policiesPage = new PoliciesPage();
    let menues = t.fixtureCtx.menues;
    let configuration = getMenu(menues,301);
    let complianceSetup = getMenu(configuration.submenu,30110);
    let policies = getMenu(complianceSetup.submenu,3011001);
    let infoModal = new InfoModal();
    let policyName = `NAME_${uniqueId}`;

    await t
        //2. Go to TEM
        //3. Click on Configuration
        .click(byID(configuration.action_key))
        //4. Click on Compliance Setup
        .click(byID(complianceSetup.action_key))
        //5. Click on Policies
        .click(byID(policies.action_key)).wait(10000);
    await t
        .expect(policiesPage.addNewPolicyButton.exists, longTimeout).ok('The Add New Policy button must be exists')
        //6. Add the first policy
        .click(policiesPage.addNewPolicyButton)
        .typeText(policiesPage.policyNameInput, policyName,paste);
        try {
            await t
                .click(policiesPage.saveButton);
            await t
                .click(infoModal.closeButton)
                .wait(5000)
                .expect(await policiesPage.searchPolicy(policyName)).ok('The Policy should be created')
                //7. Add the duplicate policy
                .click(policiesPage.addNewPolicyButton)
                .typeText(policiesPage.policyNameInput, policyName, paste)
                .click(policiesPage.saveButton)
                .expect(infoModal.message.innerText).eql(t.fixtureCtx.labels['msg-62000-050'], 'Duplicate message error were not correctly')
                .click(infoModal.closeButton)
                .click(policiesPage.cancelButton)
                .click(policiesPage.buttonConfirmModal)
                //8. Delete the Policy
                .expect(await policiesPage.deletePolicy(policyName)).ok('The Policy should be deleted')
                //9. Check delete policy
                .expect(await policiesPage.searchPolicy(policyName)).notOk('The Policy should not be exist')
        } catch (error) {
            let allPolicies = await apiHandler.getAllPolicies();
            let policy = allPolicies.find(element => element.policy_name == policyName);
            if(policy != null){
                await apiHandler.deletePolicy(policy.policy_id);
            }
            throw error;
        }
    
});

test('TC 27385: Project Code Duplication', async t => {
    let projectCodesPage = new ProjectCodesPage();
    let menues = t.fixtureCtx.menues;
    let configuration = getMenu(menues,301);
    let costAllocation = getMenu(configuration.submenu,30101);
    let projectCodes = getMenu(costAllocation.submenu,3010103);
    let projectCode = 'Code ' + uniqueId;
    let projectName = 'Name ' + uniqueId;

    await t
        //2. Go to Corcentric Expense
        //3. Click on the Configuration menu on the left
        .click(byID(configuration.action_key))
        .click(byID(costAllocation.action_key))
        .click(byID(projectCodes.action_key));
    await t
        .wait(2000)
        //4. Add a new Project Code
        .typeText(projectCodesPage.projectNameInput, projectName, paste)
        .typeText(projectCodesPage.projectCodeInput, projectCode, paste)
        .click(projectCodesPage.datePicker)
        .click(projectCodesPage.datePicker);
        try {
            await t    
                .click(projectCodesPage.addNewButton)
                .wait(2000);
            //5. Check on table
            await t
                .expect(await projectCodesPage.searchProjectCode(projectName)).ok('The Project Code should be exists');
            await t
                //6. Check control duplicate project code
                .typeText(projectCodesPage.projectNameInput, projectName, paste)
                .typeText(projectCodesPage.projectCodeInput, projectCode, paste)
                .click(projectCodesPage.addNewButton)
                .expect(projectCodesPage.modal.exists).ok('The "Modal" should exist')
                .click(projectCodesPage.modal.find('button'))
                .wait(2000);
            //7. Delete the recently created Project code
            await t
                .expect(await projectCodesPage.deleteProjectCode(projectName)).ok('The Project Code should be deleted');
            //8. Check delete
            await t
                .expect(await projectCodesPage.searchProjectCode(projectName)).notOk('The Project Code should not be exists');
        } catch (error) {
            let allProjectCodes = await apiHandler.getAllProjectCodes();
            let pCode = allProjectCodes.find(element => element.project_code == projectCode);
            if(pCode =! null){
                await apiHandler.deleteProjectCode(pCode.project_id);
            }
            throw error;
        }   
});

test.skip('TC 27386: Duplicate Role', async t => {
    let manageRolesPage = new ManageRolesPage();
    let newRole = new NewRole();
    let confirmModal = new ConfirmModal();

    let labels = t.fixtureCtx.labels;
    let manageRoles = getMenu(t.fixtureCtx.groupsMenu.submenu,30114);
    let manageRolesMenu = byID(manageRoles.action_key);
    
    await t
    //2. Go to Corcentric Expense
    //3. Click on Configuration
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
        .click(byID(t.fixtureCtx.groupsMenu.action_key))
        .click(manageRolesMenu);
    await t
    //4. Add new role
        .wait(5000)
        .click(manageRolesPage.addRoleButton)
        .typeText(newRole.roleInput,`ROLE_${uniqueId}`,paste)
        .click(newRole.addButton);
    await t
        .wait(2000)
        .expect(confirmModal.title.innerText).contains(labels['ui-manageroles-038'], 'Successfully added message title is not correct')
        .expect(confirmModal.body.innerText).contains(labels['ui-manageroles-039'], 'Successfully added message is not correct')
        .click(confirmModal.acceptButton)
        .click(newRole.closeButton);
    //5. Check new Role added
    await t.expect(await manageRolesPage.findRole(`ROLE_${uniqueId}`)).ok('The Role was not added');
    await t
    //6. Duplicate role
        .click(manageRolesPage.addRoleButton)
        .typeText(newRole.roleInput,`ROLE_${uniqueId}`,paste)
        .click(newRole.addButton)
        .click(newRole.modalWarning.find('button').nth(1))
        .click(newRole.closeButton);

    //7. Delete the Role
    await t.expect(await manageRolesPage.deleteRole(`ROLE_${uniqueId}`)).ok('The Role should be deleted');
    await t.expect(await manageRolesPage.findRole(`ROLE_${uniqueId}`)).notOk('The Role should not be exists');
   
});

test('TC 27388: Duplicate Expense Category', async t => {
    let expenseCategoryPage = new ExpenseCategoryPage();
    let expenseCategory = getMenu(t.fixtureCtx.settingsMenu.submenu,3010101);
    
    await t
        //2. Go to Corcentric Expense
        //3. Click on the Configuration menu on the left
            .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on the Settings submenu
            .click(byID(t.fixtureCtx.settingsMenu.action_key))
        //5. Click on Expense Category
            .click(byID(expenseCategory.action_key));
    await t
            .expect(expenseCategoryPage.categoryNameInput.exists).ok('The "Category Name" input should exist',longTimeout)
        //6. Add a new Expense Category
            .typeText(expenseCategoryPage.categoryNameInput,`EXPCAT_${uniqueId}`,paste)
            .click(expenseCategoryPage.categoryDropdown)
            .click(expenseCategoryPage.optionCarIcon)
            .click(expenseCategoryPage.datePicker)
            .click(expenseCategoryPage.dateDay.nth(36))
            .click(expenseCategoryPage.addNewButton)
            .wait(2000);
        //7. Check Expense Category in table
        let allExpenseCategory = await apiHandler.getAllExpenseCategories();
        let expenseCategoryNew = await expenseCategoryPage.getExpenseCategory(`EXPCAT_${uniqueId}`,allExpenseCategory);
    await t
    //6. Duplicate Expense Category
        .typeText(expenseCategoryPage.categoryNameInput,`EXPCAT_${uniqueId}`,paste)
        .click(expenseCategoryPage.categoryDropdown)
        .click(expenseCategoryPage.optionCarIcon)
        .click(expenseCategoryPage.datePicker)
        .click(expenseCategoryPage.dateDay.nth(36))
        .click(expenseCategoryPage.addNewButton)
        .click(expenseCategoryPage.modalWarning.find('button').nth(1))
        .wait(2000);
    try {
        await t.expect(await expenseCategoryPage.existsExpenseCategory(expenseCategoryNew.category_name)).ok('The Expense Category should be exists in the table');
        //8. Desactive Expense Category
        await t
            .expect(await expenseCategoryPage.selectExpenseCategory(expenseCategoryNew.category_name)).ok('The Expense Category should be exists')
            .click(expenseCategoryPage.actionsDropdown.find('i'))
            .click(expenseCategoryPage.actionsDropdownOptions.nth(1));
        //9. Delete new Expense Category
        await apiHandler.deleteExpenseCategory(expenseCategoryNew.category_id);
    }
    catch(err){
        await apiHandler.deleteExpenseCategory(expenseCategoryNew.category_id);
        throw err;
    }
});

test('TC: 27881 Removing expense from Report verify', async t=>{
    let reportName = 'Test Report ' + uniqueId;
    let businessPurpose = 'UI Testing';
    let purposeExpend = 'Purpose ' + uniqueId;
    
    await t
        //2. Click on "Corcentric Expense"
        //3. Click on "Create New Report"
        .click(dashboardTitles.withText(t.fixtureCtx.labels['ui-00-031']))
        //10. Insert @reportName in the "Report Name" input
        .typeText(report.reportNameInput, reportName, paste)
        //11. Insert @businessPurpose in the "Business Purpose" input
        .typeText(report.businessPurposeInput, businessPurpose, paste)
        //12. Select @fromDate in the "From" date picker
        .click(report.fromCalendar.toggle)
        .click(report.fromCalendar.day.withText('1'));
    //13. Select @toDate in the "To" date picker
        await report.toCalendar.selectLastDay();
        await t
            //14. Click the "Save" button
            .click(report.saveButton);
            try {
                await t
                    //15. Check the Report page UI
                    .expect(page.title.innerText).eql(reportName)
                    .expect(report.reportName.innerText).contains(reportName)
                    .expect(report.businessPurpose.innerText).contains(businessPurpose);
                await t
                    .click(report.addExpenseButton)
                    .expect(expense.amountInput.exists).ok('The amount input should be displayed')
                    .expect(expense.businessPurposeTextarea.exists).ok('The business purpose text area should be displayed')
                    .expect(expense.commentTextarea.exists).ok('The add coment text area should be displayed')
                    .typeText(expense.amountInput, '666', paste)
                    .typeText(expense.businessPurposeTextarea, purposeExpend, paste)
                    .typeText(expense.commentTextarea, 'Testing Comment ' + uniqueId, paste)
                    .expect(expense.commentTextarea.value).eql('Testing Comment ' + uniqueId)
                    .click(expense.saveButton)
                    .expect(report.expensesTable.exists).ok('Expense table shuold be displayed');
                let allReports = await apiHandler.getAllTEMReports();
                let rep = allReports.find(element => element.business_purpose == businessPurpose);
                if(rep != null) {
                    if(rep.expense_ids.length == 0){
                        throw new Error('Expense has not been attached to the report');
                    }
                }
                await t
                    .click(report.closeButton)
                    .expect(reportsPage.allTab.exists).ok('All tab should be displayed')
                    //.expect(await reportsPage.findReport(reportName)).ok('The new report should be in the table')
                    //.expect(await reportsPage.editReport(reportName)).ok('Report must be edited');
            } catch (error) {
                let allReports = await apiHandler.getAllTEMReports();
                let rep = allReports.find(element => element.business_purpose == businessPurpose);
                if(rep != null){
                    await apiHandler.deleteReport(rep.report_id);
                }
                throw error;
            }
        


})

test('TC: 27882 Creation of new GL segment', async t=>{
    let manageGLPage = new ManageGL();
    let manageGLMenu = getMenu(t.fixtureCtx.generalLedger.submenu, 301172);
    let segmentName = 'segment' + uniqueId;

    let allSegments = await apiHandler.getSegments();
    await t
        //2. Go to Corcentric Expense
        //3. Click on Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on General Ledger submenu
        .click(byID(t.fixtureCtx.generalLedger.action_key))
        //5. Click on Define gl
        .click(byID(manageGLMenu.action_key))
         //6. Check page title
        .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-managegl-000'], 'The "Page Title" was wrong', timeout)
        .click(manageGLPage.addGLValueButton.nth(4));
    for (let i = 0; i < allSegments.total; i++){
        await t
            .expect(manageGLPage.addInputs.nth(i).exists).ok('Input should be displayed');
    }
    for(let i = 0; i < allSegments.total; i++){
        await t
            .typeText(manageGLPage.addInputs.nth(i), segmentName, paste);
    }
    try {
        await t
            .click(manageGLPage.addButtonsPrimary.nth(0))
            .expect(manageGLPage.newModal.exists).ok('Confirm modal should be displayed')
            .click(manageGLPage.newModalcloseButton)

        await t
            .typeText(manageGLPage.filterInputs.nth(0), segmentName, paste)
            .pressKey('enter')
            .expect(Selector('tr[draggable="false"] i.fa.fa-pencil').count).eql(1, 'The count mus be 1');
        await t
            .click(manageGLPage.manageGLTable.rows.find('i.fa.fa-times'))
            .expect(manageGLPage.modalConfirm.exists).ok('Confirmation modal should exist')
            .click(manageGLPage.deleteModalcloseButton); 
    } catch (error) {
        let segments = await apiHandler.getSegments();
        let segment = segments.items[0].segment_id;
        let manageValues = await apiHandler.getAllValuesManagGL();
        let rowID = await manageGLPage.getRowSegmentId(segmentName, segment, manageValues);
        await apiHandler.deleteSegment(rowID);
        throw error;
    }
})

test('TC: 27926 Creation of new GL Mapping', async t => {
    let manageGLMapping = new ManageGLMapping();
    let manageGLMappingMenu = getMenu(t.fixtureCtx.generalLedger.submenu, 301173);
    let mappingName = 'TestMapping' + uniqueId;
    await t
        //2. Go to Corcentric Expense
        //3. Click on Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on General Ledger submenu
        .click(byID(t.fixtureCtx.generalLedger.action_key))
        .click(byID(manageGLMappingMenu.action_key), timeout);
    await t
        .expect(manageGLMapping.titlePage.innerText).match(insensitive(t.fixtureCtx.labels['ui-usrm-318']), 'The page title was worng', timeout)
        .click(manageGLMapping.addButton)
        .expect(manageGLMapping.mappingNameInput.exists).ok('The name input should be displayed')
        .typeText(manageGLMapping.mappingNameInput, mappingName, paste)
        .click(manageGLMapping.hasHeaderCheckbox.find('i.cor-icon-checkbox.fa.fa-check'))
        .setFilesToUpload(manageGLMapping.fileUpLoadInput, './../../../mock-files/MockUp_ManageGLMapping.csv');
    await t
        .expect(manageGLMapping.fileTableMapped.exists).ok('The table that show the content of file should be displayed')
        .click(manageGLMapping.secondaryRowDropdowns.nth(1).find('i'))
        .click(manageGLMapping.secondaryRowDropdowns.nth(1).find('p').nth(0))

        .click(manageGLMapping.secondaryRowDropdowns.nth(2).find('i'))
        .click(manageGLMapping.secondaryRowDropdowns.nth(2).find('p').nth(1))

        .click(manageGLMapping.secondaryRowDropdowns.nth(3).find('i'))
        .click(manageGLMapping.secondaryRowDropdowns.nth(3).find('p').nth(2))

        .click(manageGLMapping.secondaryRowDropdowns.nth(4).find('i'))
        .click(manageGLMapping.secondaryRowDropdowns.nth(4).find('p').nth(3))

        .click(manageGLMapping.secondaryRowDropdowns.nth(5).find('i'))
        .click(manageGLMapping.secondaryRowDropdowns.nth(5).find('p').nth(4));
    try {
        await t
            .expect(manageGLMapping.testButton.hasAttribute('disabled')).ok('The test button should be disabled')
            
            .click(manageGLMapping.usrSaveButton)
            .expect(manageGLMapping.testButton.hasAttribute('disabled')).notOk('The test button should be enabled')
            .click(manageGLMapping.testButton)
            .expect(manageGLMapping.textarea.value).eql('Test completed. No Error found.');
    
        await t
            .click(manageGLMapping.usrImportButton);
        await t
            .expect(manageGLMapping.manageGLMappingTable.exists).ok('Manage Mapping table should be displayed')
            .expect(await manageGLMapping.deleteMapping(mappingName)).ok('The new mapping should be deleted');
        let allMaps = await apiHandler.getmanageGLMapping();
        await t
            .expect(await manageGLMapping.existMap(allMaps,mappingName)).notOk('The map should be deleted');
    } catch (error) {
        let maps = await apiHandler.getmanageGLMapping();
        let mapId = await maps.items.find(element => element.mapping_name == mappingName)
        if(mapId != null){
            await apiHandler.deleteGLMapping(mapId.map_id);
        }
        throw error;
    }
})
test('TC 27975 New User Gl Default Creation', async t => {

    let userGlDefaultMenu = getMenu(t.fixtureCtx.generalLedger.submenu, 301174);
    let userGLDefaultPage = new UserGLDefault();
    let confirmationPopup = new ConfirmModal()
    let newUserData = {
        name: 'testing',
        lastName: 'user',
        email: 'user@temperies.com',
        middleName: 'jay',
        userName:'HomeroJaySimpson',
        company: 'Temperies',
        phone: '123321123',
        
    };
    let newUser = await apiHandler.addUser("cust1", "cust2", newUserData.middleName, newUserData.phone, newUserData.userName, newUserData.name, newUserData.email, newUserData.lastName);
    
    //2. Go to Corcentric Expense
    //3. Click on Configuration menu on the left
    await t
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on General Ledger submenu
        .click(byID(t.fixtureCtx.generalLedger.action_key))
        .click(byID(userGlDefaultMenu.action_key), timeout)
        .expect(userGLDefaultPage.title.innerText).match(insensitive(t.fixtureCtx.labels['ui-gldefault-000']), 'The page title was worng', longTimeout);

    await t
        .click(userGLDefaultPage.addButton)
        .expect(userGLDefaultPage.userInput.exists).ok('The user input should be displayed');
    await t    
        .typeText(userGLDefaultPage.userInput, newUserData.name, {paste:true})
        .expect(userGLDefaultPage.userInputOptions.exists).ok('The user input options should be displayed')
        .expect(userGLDefaultPage.dropdownsSegments.nth(0).find('input').hasAttribute('disabled')).ok('The dropdowns should be disabled')
        .click(userGLDefaultPage.userInputOptions.nth(0))
        .expect(userGLDefaultPage.dropdownsSegments.nth(0).find('input').hasAttribute('disabled')).notOk('The dropdown should be enabled')
        .expect(userGLDefaultPage.dropdownsSegments.nth(1).find('input').hasAttribute('disabled')).ok('The dropdowns should be disabled')
        .expect(userGLDefaultPage.dropdownsSegments.nth(2).find('input').hasAttribute('disabled')).ok('The dropdowns should be disabled')
        .expect(userGLDefaultPage.dropdownsSegments.nth(3).find('input').hasAttribute('disabled')).ok('The dropdowns should be disabled')
        .expect(userGLDefaultPage.dropdownsSegments.nth(4).find('input').hasAttribute('disabled')).ok('The dropdowns should be disabled');

    //selecting valued on the dropdowns
    await t 
        .click(userGLDefaultPage.dropdownsSegments.nth(0).find('i'))
        .click(userGLDefaultPage.dropdownsSegments.nth(0).find('p').nth(0))

        .click(userGLDefaultPage.dropdownsSegments.nth(1).find('i'))
        .click(userGLDefaultPage.dropdownsSegments.nth(1).find('p').nth(0))

        .click(userGLDefaultPage.dropdownsSegments.nth(2).find('i'))
        .click(userGLDefaultPage.dropdownsSegments.nth(2).find('p').nth(0))

        .click(userGLDefaultPage.dropdownsSegments.nth(3).find('i'))
        .click(userGLDefaultPage.dropdownsSegments.nth(3).find('p').nth(0))

        .click(userGLDefaultPage.dropdownsSegments.nth(4).find('i'))
        .click(userGLDefaultPage.dropdownsSegments.nth(4).find('p').nth(0));
    try {
        await t
            .click(userGLDefaultPage.saveButton);
        await t
            .expect(confirmationPopup.header.exists).ok('Confirmation popup should be displayed')
            .click(confirmationPopup.closeButton);
        await t
            .expect(userGLDefaultPage.userGLDefaultTable.exists).ok('The table should be displayed')
            .typeText(userGLDefaultPage.UserNameFilterInput, newUserData.userName, {paste:true, replace:true})
            .pressKey('enter');
        await t
            .expect(userGLDefaultPage.userGLDefaultTable.find('tr.rows-background').exists).ok('A record must be displayed')
            .click(userGLDefaultPage.deleteButton)
            .expect(confirmationPopup.header.exists).ok('The confirmation popup should be displayed')
            .click(confirmationPopup.acceptButton)
            .expect(confirmationPopup.header.exists).ok('The confirmation popup should be displayed')
            .click(confirmationPopup.closeButton);
    } catch (error) {
        let allUserDefaultMaps = await apiHandler.getAllGLUserDafultMaps();
        let userDefaultMap = allUserDefaultMaps.items.find(element => element.user_name === newUserData.userName);
        if(allUserDefaultMaps != null) {
            if(userDefaultMap != null) {
                await apiHandler.deleteUserGlDefaultMap(userDefaultMap.user_id);
            }
        }
        throw error;
    }
    
})

test('TC 28010 Importing a new gl user default mapping', async t => {
    let userGlDefaultMappingMenu = getMenu(t.fixtureCtx.generalLedger.submenu, 301175);
    let userGLDefaultMappingPage = new UserGLDefaultMapping();
    let mappingName = 'TestMapping' + uniqueId;
    await t
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on General Ledger submenu
        .click(byID(t.fixtureCtx.generalLedger.action_key));
    await t
        .click(byID(userGlDefaultMappingMenu.action_key));
    await t
        .expect(userGLDefaultMappingPage.userGLDefaultTable.exists).ok('The table should be displayed').wait(15000)
        .click(userGLDefaultMappingPage.addButton);
    await t
        .expect(userGLDefaultMappingPage.title.innerText).match(insensitive(t.fixtureCtx.labels['ui-usrm-256']), 'The page title was worng', timeout)
        .typeText(userGLDefaultMappingPage.mapNameInput, mappingName, {replace:true, paste:true})
        .click(userGLDefaultMappingPage.hasHeadersCheckBox)
        .setFilesToUpload(userGLDefaultMappingPage.fileInput, './../../../mock-files/MockUp_ManageUsersGLMapping.csv');
    await t
        .expect(userGLDefaultMappingPage.tableDropdownsContainer.exists).ok('The table that contains the dropdowns should be displayed')
        .click(userGLDefaultMappingPage.secondaryDropDownsRow.nth(1).find('i'))
        .click(userGLDefaultMappingPage.secondaryDropDownsRow.nth(1).find('p').nth(0))

        .click(userGLDefaultMappingPage.secondaryDropDownsRow.nth(2).find('i'))
        .click(userGLDefaultMappingPage.secondaryDropDownsRow.nth(2).find('p').nth(1))

        .click(userGLDefaultMappingPage.secondaryDropDownsRow.nth(3).find('i'))
        .click(userGLDefaultMappingPage.secondaryDropDownsRow.nth(3).find('p').nth(2))

        .click(userGLDefaultMappingPage.secondaryDropDownsRow.nth(4).find('i'))
        .click(userGLDefaultMappingPage.secondaryDropDownsRow.nth(4).find('p').nth(3))

        .click(userGLDefaultMappingPage.secondaryDropDownsRow.nth(5).find('i'))
        .click(userGLDefaultMappingPage.secondaryDropDownsRow.nth(5).find('p').nth(4))
        
        .click(userGLDefaultMappingPage.secondaryDropDownsRow.nth(6).find('i'))
        .click(userGLDefaultMappingPage.secondaryDropDownsRow.nth(6).find('p').nth(5));
    try {
        await t
            .click(userGLDefaultMappingPage.saveButton)
            .click(userGLDefaultMappingPage.testButton)
            .expect(userGLDefaultMappingPage.textAreaTest.value).eql('Test completed. No Error found.')
            .click(userGLDefaultMappingPage.importButton);
        await t
            .expect(await userGLDefaultMappingPage.existMapOnTable(mappingName)).ok('The map should be diplayed on the table');
        await t
            .expect(await userGLDefaultMappingPage.deleteMap(mappingName)).ok('The map should be deleted');
    } catch (error) {
        let allMaps = await apiHandler.getAllImportMaps();
        let map = allMaps.items.find(element => element.mapping_name == mappingName);
        if(map!=null){
            await apiHandler.deleteUserDefaultImportMap(map.map_id);
        }
        throw error;
    }    
})