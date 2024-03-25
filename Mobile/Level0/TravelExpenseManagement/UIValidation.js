import { Selector } from 'testcafe';
import { byID, getCopyright, insensitive, timeout, getMenu, checkLabels, getTabs } from './../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from '../../../hooks';
import config from '../../../config';
import users from '../../../users';
import MobilePage from './../../../page-models/mobilePage';
import HeaderPage from './../../../page-models/headerPage';
import ExpensesMobilePage from './../../../page-models/tem/expensesMobilePage';
import SideBarPage from './../../../page-models/sideBarPage';
import ReceiptsMobilePage from '../../../page-models/tem/receiptsMobilePage';
import ReportsMobilePage from '../../../page-models/tem/reportsMobilePage';
import ApprovalsMobilePage from '../../../page-models/tem/approvalsMobilePage';
import DepartmentSpendByCategoryPage from '../../../page-models/tem/departmentSpendByCategoryPage';
import CategorySpendByDepartmentPage from '../../../page-models/tem/categorySpendByDepartmentPage';
import TopReportsManagersPage from '../../../page-models/tem/topReportsManagersPage';
import OOODelegationPage from '../../../page-models/tem/oooDelegationPage';
import APIHandler from '../../../utils/apiHandler';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import ReportsPage from '../../../page-models/tem/reportsPage';
import ReceiptsPage from '../../../page-models/tem/receiptsPage';
import MyAccountMobilePage from '../../../page-models/myAccountMobilePage';
import UserDropdown from '../../../page-models/userDropdown';

const localizator = new Localizator();
process.removeAllListeners('unhandledRejection');

const dashboardTitles = Selector('div[class=title]');
const apiHandler = new APIHandler();
const page = new MobilePage();
const sideBarPage = new SideBarPage();
const headerPage = new HeaderPage();
const receiptsMobilePage = new ReceiptsMobilePage();
const userDropdown = new UserDropdown();
const args = parseArguments();
const category = {
	id: 62000,
	name: "Corcentric Expense"
};

let temFixture = fixture`Mobile - Level 0 - Corcentric Expense - UI Validations - Running on "${args.env.toUpperCase()}"`
    .page(config[args.env].baseUrl)
    .before(async ctx  => {
        await before();
        let apps = await apiHandler.getApps(); 
        let application = apps.find(element => element['application_id'] === 62000);
        ctx.app = application.title; //Corcentric Expense
        ctx.menues = await apiHandler.getMenues(application.menu_param);
        ctx.labels = await localizator.getLabelsAsJson('ui-00-*,ui-cm-*,msg-00-*,ui-setup-*,ui-rec-0*');
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
	});

loadFixture(users[args.user],category,temFixture);

test(`TC 25113: Mobile 'Welcome' Page`, async t => {
    let menues = t.fixtureCtx.menues;
    let dashboardButtons = Selector('div.button-group-dashboard');
    let labels = t.fixtureCtx.labels;
    let copyright = getCopyright(await apiHandler.getBranding());
    copyright = copyright.replace('  ', ' ');

    await t
        //2. Go to Corcentric Expense
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Check Welcome page
        .expect(page.title.innerText).match(insensitive(labels['ui-00-030']),'The "Page Title" was wrong', timeout)
        //4. Check Header buttons - There is a "Plus" collapser button on top. When clicked three buttons are displayed: "+ REPORT", "+ EXPENSE" and "+ RECEIPT"
        .expect(headerPage.collapserPlusButton.exists).ok('The "Plus" button should exist')
        .click(headerPage.collapserPlusButton)
        .wait(500)
        .expect(headerPage.collapserPlusReport.exists).ok('The "+REPORT" button should exist')
        .expect(headerPage.collapserPlusExpense.exists).ok('The "+EXPENSE" button should exist')
        .expect(headerPage.collapserPlusReceipt.exists).ok('The "+RECEIPT" button should exist')
        .expect(headerPage.collapserPlusReport.innerText).contains(labels['ui-00-020'],'The "+REPORT" button should exist')
        .expect(headerPage.collapserPlusExpense.innerText).contains(labels['ui-00-021'],'The "+EXPENSE" button should exist')
        .expect(headerPage.collapserPlusReceipt.innerText).contains(labels['ui-00-022'],'The "+RECEIPT" button should exist')
        .click(headerPage.collapserPlusButton)
        //5. Check the left side menu - Seven options are displayed: "Home", "Dashboards", "Reports", "Expenses", "Receipts", "Approvals" and "Configuration". The copyright message is displayed at the bottom
        .expect(byID(getMenu(menues,101).action_key).exists).ok('The "Home" menu should exist')
        .expect(byID(getMenu(menues,106).action_key).exists).ok('The "Dashboards" menu should exist')
        .expect(byID(getMenu(menues,102).action_key).exists).ok('The "Reports" menu should exist')
        .expect(byID(getMenu(menues,103).action_key).exists).ok('The "Expenses" menu should exist')
        .expect(byID(getMenu(menues,104).action_key).exists).ok('The "Receipts" menu should exist')
        .expect(byID(getMenu(menues,105).action_key).exists).ok('The "Approvals" menu should exist')
        .expect(sideBarPage.copyright.innerText).contains(copyright)
        //6. Check Welcome Page buttons
        .expect(dashboardButtons.withText(labels['ui-00-031']).exists).ok('The "Create New Report" button should exist')
        .expect(dashboardButtons.withText(labels['ui-00-031']).find('i').hasClass('fa-file-text-o')).ok('The "Create New Report" button should have a "" icon')
        .expect(dashboardButtons.withText(labels['ui-00-032']).exists).ok('The "Add an Expense" button should exist')
        .expect(dashboardButtons.withText(labels['ui-00-032']).find('i').hasClass('fa-credit-card')).ok('The "Add an Expense" button should have a "" icon')
        .expect(dashboardButtons.withText(labels['ui-00-033']).exists).ok('The "Add a Receipt" button should exist')
        .expect(dashboardButtons.withText(labels['ui-00-033']).find('i').hasClass('fa-usd')).ok('The "Add a Receipt" button should have a "" icon')
        //.expect(dashboardButtons.withText(labels['ui-00-034']).exists).ok('The "Manage Approvals" button should exist')
        //.expect(dashboardButtons.withText(labels['ui-00-034']).find('i').hasClass('fa-check-square-o')).ok('Manage Approvals" button should have a "check square" icon')
        .expect(dashboardButtons.withText(labels['ui-00-035']).exists).ok('The "Dashboards" button should exist')
        .expect(dashboardButtons.withText(labels['ui-00-035']).find('i').hasClass('fa-file-text-o')).ok('The "Dashboards" button should have a "file text" icon');
});

test(`TC 25115: Mobile 'Reports' Page`, async t => {
    let menues = t.fixtureCtx.menues;
    let reports = byID((getMenu(menues,102)).action_key);
    let reportLabels = await localizator.getLabelsAsJson('ui-rep-*');
    let dropdownLabels = [	reportLabels['ui-rep-001'], //All
                            reportLabels['ui-rep-002'], //Pending
                            reportLabels['ui-rep-003'], //Approved
                            reportLabels['ui-rep-004'], //Rejected
                            reportLabels['ui-rep-005'], //Paid
                            reportLabels['ui-rep-006']  //Draft
                        ];

    let reportsMobilePage = new ReportsMobilePage();
    let allReports = await apiHandler.getTEMReports();

    await t
        //2. Navigate to Corcentric Expense - TEM page is displayed
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Click the Nav Bar Toggler - The Left Side menu is displayed
        .click(headerPage.navBarToggler)
        //4. Click on the "Reports" option from the left side menu - Reports page is displayed
        .click(reports)
        //5. Check the Page Title - The page has the breadcrumb title "Reports"
        .expect(page.title.innerText).eql(reportLabels['ui-rep-000'],'The "Page Title" was wrong', timeout)
        .wait(3000)
        //6. Check Tabs Dropdown - When enough elements are displayed, the following tabs are shown: "All", "Pending", "Approved", "Rejected", "Paid" and "Draft"
        .expect(await checkLabels(reportsMobilePage.tabsDropdownOptions,dropdownLabels)).ok()
        //7. Check Tables. Scroll until new elements appear - Grids for all tabs should exist
        .expect(reportsMobilePage.approvedTable.exists).ok('The "Approved" table should exist')
        .expect(reportsMobilePage.draftTable.exists).ok('The "Draft" table should exist')
        .expect(reportsMobilePage.paidTable.exists).ok('The "Paid" table should exist')
        .expect(reportsMobilePage.pendingTable.exists).ok('The "Pending" table should exist')
        .expect(reportsMobilePage.rejectedTable.exists).ok('The "Rejected" table should exist');
    if(allReports.total > 0)
        await t.expect(reportsMobilePage.allTable.exists).ok('The "All" table should exist');
    let heightOffset = await reportsMobilePage.allTable.scrollHeight;
    let rowsCount = await reportsMobilePage.allTableRows.count;
    
    if(allReports.total > 0){
        await t
        .hover(reportsMobilePage.allTable, { offsetX: 100, offsetY: heightOffset })
        .wait(3000);
    }
});

test(`TC 25116: Mobile 'Receipts' Page`, async t => {
    let menues = t.fixtureCtx.menues;
    let receipts = byID((getMenu(menues,104)).action_key);
    let receiptsLabels = await localizator.getLabelsAsJson('ui-rec-*');
    let receiptsHeaders = [
        receiptsLabels['ui-rec-011'], //Name
        receiptsLabels['ui-rec-010'], //Date Added
        receiptsLabels['ui-rec-013']  //File Size
    ];
        
    await t
        //2. Go to Corcentric Expense
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Click on the Nav Bar Toggler
        .click(headerPage.navBarToggler)
        //4. Click on the Receipts option from the left side menu
        .click(receipts)
        //5. Check Receipts Page Title
        .expect(page.title.innerText).match(insensitive(receiptsLabels['ui-rec-000']),'The "Page Title" was wrong', timeout)
        //6. Check "Add Image" button
        .expect(receiptsMobilePage.cameraUploadButton.exists).ok('The "Add Image" button should exist')
        .expect(receiptsMobilePage.cameraUploadButton.child('i').hasClass('fa-camera')).ok('The "Add Image" button should have a "Camera" icon')
        .expect(receiptsMobilePage.cameraUploadInput.exists).ok('The "Add Image" input should exist')
        //7. Check "Create Report" button
        .expect(receiptsMobilePage.createReportButton.exists).ok('The "Create Report" button should exist')
        .expect(receiptsMobilePage.createReportButton.find('i').hasClass('fa-plus')).ok('The "Create Report" button should have a "Plus" icon')
        .expect(receiptsMobilePage.createReportButton.hasAttribute('disabled')).ok('The "Create Report" button should be disabled by default');
});

test(`TC 25125: Mobile 'Expenses' Page`, async t => {
    page.changeResizeIphone();
    let menues = t.fixtureCtx.menues;
    let expenses = byID((getMenu(menues,103)).action_key);
    let expensesMobilePage = new ExpensesMobilePage();
    let expensesLabels = await localizator.getLabelsAsJson('ui-exp-*');
    
    let dropdownLabels = [
        expensesLabels['ui-exp-100'], //All	
        expensesLabels['ui-exp-101'], //Unclaimed 
        expensesLabels['ui-exp-108'], //Not-Submitted
        expensesLabels['ui-exp-103']  //Submitted
    ];
    
    let expensesHeaders = [
        expensesLabels['ui-exp-000'], //Date
        expensesLabels['ui-exp-001'], //Category
        expensesLabels['ui-exp-002']  //Amount
    ];

    await t
        //2. Go to Corcentric Expense
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Click on the Nav Bar Toggler
        .click(headerPage.navBarToggler)
        //4. Click the 'Expenses' option on the left side menu
        .click(expenses)
        //5. Check the Page Title
        .expect(page.title.innerText).match(insensitive(expensesLabels['ui-exp-104']),'The "Page Title" was wrong', timeout)
        //6. Check tabs dropdown
        .click(expensesMobilePage.tabsDropdown)
        //7. Check tabs
        .expect(expensesMobilePage.allTable.exists).ok('The "All" tab table grid should exist')
        .expect(expensesMobilePage.unclaimedTable.exists).ok('The "Unclaimed" tab table grid should exist')
        .expect(expensesMobilePage.notSubmittedTable.exists).ok('The "Not Submitted" tab table grid should exist')
        .expect(expensesMobilePage.submittedTable.exists).ok('The "Submitted" tab table grid should exist')
        .expect(await checkLabels(expensesMobilePage.tabsDropdownOptions,dropdownLabels)).ok()
        //8. Check Tables
        .expect(expensesMobilePage.tabsDropdown.exists).ok('The "Tabs" dropdown should exist')
        .expect(expensesMobilePage.allTab.exists).ok('The "All" tab should exist')
        .expect(expensesMobilePage.unclaimedTab.exists).ok('The "Unclaimed" tab should exist')
        .expect(expensesMobilePage.notSubmittedTab.exists).ok('The "Not Submitted" tab should exist')
        .expect(expensesMobilePage.submittedTab.exists).ok('The "Submitted" tab should exist')
        //9. Check "All" tab table headers - The table contains the following headers: "Date", "Category", and "Amount"
        .expect(await checkLabels(expensesMobilePage.allTable.headers,expensesHeaders)).ok()
});


test(`TC 27206: Mobile 'New Expense' Page`, async t => {
    page.changeResizeIphone();
    let expensesMobilePage = new ExpensesMobilePage();
    let expensesLabels = await localizator.getLabelsAsJson('ui-exp-*');
    let glAllocationConfig = await apiHandler.getGLAllocationConfiguration();
    let projectCodeConfig = await apiHandler.getProjectCodeConfig();
    await t
        //2. Go to Corcentric Expense
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Click on plus button
        .click(headerPage.collapserPlusButton)
        .click(headerPage.collapserPlusExpense)
        //4. Check Page Title
        .expect(page.title.innerText).match(insensitive(expensesLabels['ui-exp-104']),'The "Page Title" was wrong', timeout)
        //5. Check Elements Page
        .expect(expensesMobilePage.receiptButton.exists).ok('The "Receipt" button should exist')
        .expect(expensesMobilePage.cancelButton.exists).ok('The "Cancel" button should exist')
        .expect(expensesMobilePage.saveButton.exists).ok('The "Save" button should exist')
        .expect(expensesMobilePage.datepickerInput.exists).ok('The "Receipt" button should exist')
        .expect(expensesMobilePage.currencyDropdown.exists).ok('The "Currency" dropdown should exist')
        .expect(expensesMobilePage.amountInput.exists).ok('The "Amount" input should exist')
        .expect(expensesMobilePage.categoryDropdown.exists).ok('The "Category" dropdown should exist')
        .expect(expensesMobilePage.businessPurposeTextarea.exists).ok('The "Business Purpose" textarea should exist')
        .expect(expensesMobilePage.commentTextarea.exists).ok('The "Comment" textarea should exist')
        .expect(expensesMobilePage.questionIcon.exists).ok('The "Question" icon should exist')
        .expect(expensesMobilePage.datepickerInput.value).notEql('', 'input is empty')
        //6. Check Labels page
        .expect(expensesMobilePage.labelsPage.withText(expensesLabels['ui-exp-000']).exists).ok('The "Date" label should exist')
        .expect(expensesMobilePage.labelsPage.withText(expensesLabels['ui-exp-018']).exists).ok('The "Currency" label should exist')
        .expect(expensesMobilePage.labelsPage.withText(expensesLabels['ui-exp-002']).exists).ok('The "Amount" label should exist')
        .expect(expensesMobilePage.labelsPage.withText(expensesLabels['ui-exp-001']).exists).ok('The "Category" label should exist')
        .expect(expensesMobilePage.labelsPage.withText(expensesLabels['ui-exp-004']).exists).ok('The "Business Purpose" label should exist')
        .expect(expensesMobilePage.labelsPage.withText(expensesLabels['ui-exp-005']).exists).ok('The "Add comment" label should exist')
        //7. Check Action over Elements
        .wait(10000)
        .click(expensesMobilePage.categoryDropdown.find('button'))
        .click(expensesMobilePage.currencyDropdown.find('input'))
        .typeText(expensesMobilePage.amountInput, '100')
        .typeText(expensesMobilePage.businessPurposeTextarea, 'Business QA')
        .typeText(expensesMobilePage.commentTextarea, 'Automatic Testing')
        .click(expensesMobilePage.receiptButton)
        .expect(expensesMobilePage.addReceiptsModal.exists).ok('The "Add Receipts" modal should exist')
        .click(expensesMobilePage.addReceiptsModalDoneButton);
        if( projectCodeConfig[0].project_code_visibility.includes('Expense') ){
            // Check Project Code 
            await t
                .expect(expensesMobilePage.labelsPage.withText(expensesLabels['ui-exp-003']).exists).ok('The "Project Code" label should exist')
                .expect(expensesMobilePage.projecCodeDropdown.exists).ok('The "Project Code" dropdown should exist')
                .click(expensesMobilePage.projecCodeDropdown.find('input'))
                .click(expensesMobilePage.projecCodeDropdown.find('input'));
        }
        // Check grid Allocation
        if(glAllocationConfig.show_allocation_grid){
            await t
                .expect(expensesMobilePage.allocationTab.exists).ok('The "Allocation" tab should exist')
                await t
                    .expect(expensesMobilePage.gridAllocation.exists).ok('The "Allocation" grid should exist')
                    .expect(expensesMobilePage.gridAllocationAmoun.exists).ok('The "Allocation" amoun should exist')
                    .expect(expensesMobilePage.gridAllocationPercentage.exists).ok('The "Allocation" percentage should exist')
                    .expect(expensesMobilePage.gridAllocationButtons.exists).ok('The "Allocation" buttons should exist');
                    if(glAllocationConfig.allocation_entry_type == 'Multiple'){
                        await t.expect(expensesMobilePage.gridAllocationButtons.find('i.fa.fa-plus.fa-fw.action-icon').exists).ok('The "Allocation Add" buttons should exist');
                    }
                
                let limite = glAllocationConfig.gl_allocation_grid_structure.length; 
                if(limite > 5){
                    limite = 5;
                }
                for(let i=0; i < limite; i++){
                    await t.expect(expensesMobilePage.gridAllocation.find('div.agSegment').nth(i).exists).ok('The "Segment" grid should exist');
                }
                
                
        }
        await t
        .click(expensesMobilePage.cancelButton);
        
});

test(`TC 27207: Mobile 'New Report' Page`, async t => {
    let reportsPage = new ReportsPage();
    let reportLabels = await localizator.getLabelsAsJson('ui-rep-*');
    let projectCodeConfig = await apiHandler.getProjectCodeConfig();
    
    await t
        //2. Go to Corcentric Expense
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Click on plus button
        .click(headerPage.collapserPlusButton)
        .click(headerPage.collapserPlusReport)
        //4. Check Page Title
        .expect(page.title.innerText).match(insensitive(reportLabels['ui-rep-123']),'The "Page Title" was wrong', timeout)
        //5. Check Elements Page
        .expect(reportsPage.saveButton.exists).ok('The "Save" button should exist')
        .expect(reportsPage.fromDatepicker.exists).ok('The "From" datepicker should exist')
        .expect(reportsPage.toDatepicker.exists).ok('The "To" datepicker should exist')
        .expect(reportsPage.reportNameInput.exists).ok('The "Report Name" input should exist')
        .expect(reportsPage.businessPurposeInput.exists).ok('The "Business Purpose" input should exist')
        //6. Check Labels page
        .expect(reportsPage.labelsPage.withText(reportLabels['ui-rep-104']).exists).ok('The "Report Name" label should exist')
        .expect(reportsPage.labelsPage.withText(reportLabels['ui-rep-105']).exists).ok('The "Business Purpose" label should exist')
        .expect(reportsPage.labelsPage.withText(t.fixtureCtx.labels['ui-cm-009']).exists).ok('The "From" label should exist')
        .expect(reportsPage.labelsPage.withText(t.fixtureCtx.labels['ui-cm-010']).exists).ok('The "To" label should exist')
        //7. Click save button
        .click(reportsPage.saveButton)      
        //8. Check Error Labels
        .expect(reportsPage.reportNameInput.error.withText(t.fixtureCtx.labels['msg-00-002']).exists).ok('The "Required field" label should exist')
        .expect(reportsPage.businessPurposeInput.error.withText(t.fixtureCtx.labels['msg-00-002']).exists).ok('The "Required field" label should exist')
        .expect(reportsPage.toDatepicker.error.withText(t.fixtureCtx.labels['msg-00-002']).exists).ok('The "Required field" label should exist')
        //9. Click over elements
        .typeText(reportsPage.reportNameInput,"MOBILE_TEST")
        .typeText(reportsPage.businessPurposeInput,"Purpose")
        .click(reportsPage.fromDatepicker.find('input')) 
        .click(reportsPage.fromDatepicker.find('input'))      
        .click(reportsPage.toDatepicker.find('input'))
        .click(reportsPage.toDatepicker.find('input'));
        if( projectCodeConfig[0].project_code_visibility.includes('Report') ){
            await t
                .expect(reportsPage.projectCodeDropdown.exists).ok('The "Business Purpose" input should exist');
        }
});


test(`TC 27208: Mobile 'New Receipts' Page`, async t => {
    let receiptsPage = new ReceiptsPage();
    let receiptsLabels = await localizator.getLabelsAsJson('ui-rec-*');
    
    await t
        //2. Go to Corcentric Expense
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Click on plus button
        .click(headerPage.collapserPlusButton)
        .click(headerPage.collapserPlusReceipt)
        //4. Check Page Title
        .expect(page.title.innerText).match(insensitive(receiptsLabels['ui-rec-000']),'The "Page Title" was wrong', timeout)
        //5. Check Elements Page
        .expect(receiptsPage.createReport.exists).ok('The "Create Report" button should be exists')
        .expect(receiptsPage.addImage.exists).ok('The "Add Image" button should be exists')
        .expect(receiptsPage.createReport.hasAttribute('disabled')).ok('The "Create Report" button should be disabled')
});

test(`TC 25126: Mobile 'Dashboards' Page`, async t => {
    let menues = t.fixtureCtx.menues;
    let dashboards = byID((getMenu(menues,106)).action_key);
    let dashboardButtons = Selector('div.dashboard-btn');
    let labels = await localizator.getLabelsAsJson('ui-reporting-*');
    await t
    
        //2. Go to Corcentric Expense
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Click on the Nav Bar Toggler
        .click(headerPage.navBarToggler)
        //4. Click on the Dashboards submenu on the left
        .click(dashboards)
        //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-reporting-000']),'The "Page Title" was wrong', timeout)
        //6. Check the Dashboard buttons
        .expect(dashboardButtons.withText(labels['ui-reporting-002']).exists).ok('The "Departmental Spend By Category" button should exist')
        .expect(dashboardButtons.withText(labels['ui-reporting-002']).find('i').hasClass('fa-line-chart')).ok('The "Departmental Spend By Category" button should have a "line chart" icon')
        .expect(dashboardButtons.withText(labels['ui-reporting-001']).exists).ok('The "Category Spend By Department" button should exist')
        .expect(dashboardButtons.withText(labels['ui-reporting-001']).find('i').hasClass('fa-filter')).ok('The "Category Spend By Department" button should have a "filter" icon')
        .expect(dashboardButtons.withText(labels['ui-reporting-003']).exists).ok('The "Violation By Department" button should exist')
        .expect(dashboardButtons.withText(labels['ui-reporting-003']).find('i').hasClass('fa-area-chart')).ok('The "Violation By Department" button should have an "area chart" icon')
        .expect(dashboardButtons.withText(labels['ui-reporting-004']).exists).ok('The "Approver Cycle Times" button should exist')
        .expect(dashboardButtons.withText(labels['ui-reporting-004']).find('i').hasClass('fa-star')).ok('The "Approver Cycle Times" button should have a "star" icon')
        .expect(dashboardButtons.withText(labels['ui-reporting-005']).exists).ok('The "Employee Cycle Times" button should exist')
        .expect(dashboardButtons.withText(labels['ui-reporting-005']).find('i').hasClass('fa-cog')).ok('The "Employee Cycle Times" button should have a "cog" icon')
        .expect(dashboardButtons.withText(labels['ui-reporting-006']).exists).ok('The "Top 10 Manager Reports By Status" button should exist')
        .expect(dashboardButtons.withText(labels['ui-reporting-006']).find('i').hasClass('fa-trophy')).ok('The "Top 10 Manager Reports By Status" button should have a "trophy" icon');
});

test(`TC 25128: Mobile 'Approvals' Page`, async t => {
    let menues = t.fixtureCtx.menues;
    let approvalsMenu = byID((getMenu(menues,105)).action_key);
    let labels = await localizator.getLabelsAsJson('ui-apv-000,ui-apv-013');
    let approvalsMobilePage = new ApprovalsMobilePage();
    let tabs = getTabs(await apiHandler.getApprovalCount());

    await t
        //2. Go to Corcentric Expense
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Click on the Nav Bar Toggler
        .click(headerPage.navBarToggler)
        //4. Click on the Approvals submenu on the left
        .click(approvalsMenu)
        //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-apv-000']),'The "Page Title" was wrong', timeout)
        //7. Check Page Elements
        .click(approvalsMobilePage.tabsDropdown)
        .expect(await checkLabels(approvalsMobilePage.tabsDropdownOptions,tabs)).ok()
        //8. Check Tables
        .click(approvalsMobilePage.tabsDropdown)
        .expect(approvalsMobilePage.allTable.exists).ok('The "All" table should exist')
        .expect(approvalsMobilePage.pendingTable.exists).ok('The "Pending" table should exist')
        .expect(approvalsMobilePage.rejectedTable.exists).ok('The "Rejected" table should exist')
        .expect(approvalsMobilePage.approvedTable.exists).ok('The "Approved" table should exist')
        .expect(approvalsMobilePage.paidTable.exists).ok('The "Paid" table should exist');
});

test(`TC 25129: Mobile 'Department Spend By Category' Page`, async t => {
    let menues = t.fixtureCtx.menues;
    let dashboardsMenu = byID(getMenu(menues,106).action_key);
    let dashboardButtons = Selector('div.dashboard-btn');
    let labels = await localizator.getLabelsAsJson('ui-reporting-*,ui-dash-001');
    let departmentSpendByCategoryPage = new DepartmentSpendByCategoryPage();

    await t
        //2. Go to Corcentric Expense
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Click on the Nav Bar Toggler
        .click(headerPage.navBarToggler)
        //4. Click on the "Dashboards" submenu on the left
        .click(dashboardsMenu)
        //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-reporting-000']),'The "Page Title" was wrong', timeout)
        //5. Click on the "Department Spend By Category" button
        .click(dashboardButtons.withText(labels['ui-reporting-002']))
        //6. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-dash-001']),'The "Page Title" was wrong', timeout)
        //7. Check Page Elements
        .expect(departmentSpendByCategoryPage.periodDropdown.exists).ok('The "Period" dropdown should exist')
        .expect(departmentSpendByCategoryPage.startDatePicker.exists).ok('The "Start Date Picker" should exist')
        .expect(departmentSpendByCategoryPage.endDatePicker.exists).ok('The "End Date Picker" should exist')
        .expect(departmentSpendByCategoryPage.updateButton.exists).ok('The "Update" button should exist')
        .expect(departmentSpendByCategoryPage.categoriesDropdown.exists).ok('The "Categories" dropdown should exist')
        .wait(500)
        .click(headerPage.logoIcon);
});

test(`TC 25130: Mobile 'Category Spend By Department' Page`, async t => {
    let menues = t.fixtureCtx.menues;
    let dashboardsMenu = byID(getMenu(menues,106).action_key);
    let dashboardButtons = Selector('div.dashboard-btn');
    let labels = await localizator.getLabelsAsJson('ui-reporting-*,ui-dash-000');
    let categorySpendByDepartmentPage = new CategorySpendByDepartmentPage();

    await t
        //2. Go to Corcentric Expense
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Click on the Nav Bar Toggler
        .click(headerPage.navBarToggler)
        //4. Click on the "Dashboards" submenu on the left
        .click(dashboardsMenu)
        //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-reporting-000']),'The "Page Title" was wrong', timeout)
        //5. Click on the "Category Spend By Department" button
        .click(dashboardButtons.withText(labels['ui-reporting-001']))
        //6. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-dash-000']),'The "Page Title" was wrong', timeout)
        //7. Check Page Elements
        .expect(categorySpendByDepartmentPage.periodDropdown.exists).ok('The "Period" dropdown should exist')
        .expect(categorySpendByDepartmentPage.startDatePicker.exists).ok('The "Start Date Picker" should exist')
        .expect(categorySpendByDepartmentPage.endDatePicker.exists).ok('The "End Date Picker" should exist')
        .expect(categorySpendByDepartmentPage.updateButton.exists).ok('The "Update" button should exist')
        .expect(categorySpendByDepartmentPage.divisionsDropdown.exists).ok('The "Divisions" dropdown should exist')
        .wait(500)
        .click(headerPage.logoIcon);
});

test(`TC 25145: Mobile 'Top 10 Manager Reports By Status' Page`, async t => {
    let menues = t.fixtureCtx.menues;
    let dashboardsMenu = byID(getMenu(menues,106).action_key);
    let dashboardButtons = Selector('div.dashboard-btn');
    let labels =  await localizator.getLabelsAsJson('ui-reporting-006');
    let topReportsManagersPage = new TopReportsManagersPage();
    
    await t
        //2. Go to Corcentric Expense
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Click Nav Bar Toggler - The leftside menu is displayed with "Payments", "Clients" and "Payment Accounts" menues
        .click(headerPage.navBarToggler)
        //4. Click on the Dashboards submenu on the left
        .click(dashboardsMenu)
        //5. Click on the "Top 10 Manager Reports By Status" dashboard button
        .click(dashboardButtons.withText(labels['ui-reporting-006']))
        //6. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-reporting-006']),'The "Page Title" was wrong', timeout)
        //7. Click on the Canvas Element
        .click(topReportsManagersPage.canvas, { offsetX: 145, offsetY: 45 })
        .wait(500)
        //8. Check the Page Elements
        //.expect(topReportsManagersPage.table.exists).ok('After clicking the canvas, the grid table should exist');
});

test(`TC 25163: Mobile 'OOO Delegation' Page`, async t => {
    let oooDelegationPage = new OOODelegationPage();
    let labels = await localizator.getLabelsAsJson('ui-oood-000');
    
    await t
        //2. Go to Corcentric Expense
        .click(dashboardTitles.withText(t.fixtureCtx.app))
        //3. Click on the User dropdown
        .click(page.userDropdown.image)
        //4. Click on the "OOO Delegation" dropdown item
        .click(page.userDropdown.oooDelegation)
        //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-oood-000']),'The "Page Title" was wrong', timeout)
        //6. Check Page Elements
        .expect(oooDelegationPage.toggle.exists).ok('The toggle should exist')
        .expect(oooDelegationPage.delegationDropdown.exists).ok('The "Delegation" dropdown should exist')
        .expect(oooDelegationPage.fromDatepicker.exists).ok('The "From" datepicker should exist')
        .expect(oooDelegationPage.toDatepicker.exists).ok('The "To" datepicker should exist')
        .expect(oooDelegationPage.updateButton.exists).ok('The "Update" button should exist')
        //7. Check the Update button
        if (await oooDelegationPage.updateButton.hasAttribute('disabled'))
        {
            await t
                .expect(oooDelegationPage.hiddenCheckbox.checked).notOk('The toggle should be disabled')
                .click(oooDelegationPage.toggle)
                .wait(500)
                .expect(oooDelegationPage.updateButton.hasAttribute('disabled')).notOk('The "Update" button should be enabled')
                .expect(oooDelegationPage.hiddenCheckbox.checked).ok('The toggle should be enabled')
                .click(oooDelegationPage.toggle)
                .wait(500);
        }
        else
        {
            await t
                .expect(oooDelegationPage.hiddenCheckbox.checked).ok('The toggle should be enabled')
                .click(oooDelegationPage.toggle)
                .wait(500)
                .expect(oooDelegationPage.updateButton.hasAttribute('disabled')).ok('The "Update" button should be disabled')
                .expect(oooDelegationPage.hiddenCheckbox.checked).notOk('The toggle should be disabled');
        }
});

test(`TC 27185: Mobile - My Account`, async t => {
	const labels = t.fixtureCtx.labels;
	let myAccountPage = new MyAccountMobilePage();
	let options = [
		labels['ui-setup-002'], // Language
		labels['ui-setup-020'], // Notifications
		labels['ui-setup-018']  // Activity
	];

	//2. Open the User dropdown
    await t
        .click(userDropdown.image)
	
	//3. Click on the "My Account" item
        .click(userDropdown.myAccount)
		//.click(Selector('modal-footer button.btn-primary'))

	//4. Check the Title
		.expect(page.title.innerText).eql(labels['ui-setup-000'],'The "Page Title" was wrong', timeout)

	//5. Check the page elements
		.click(myAccountPage.dropdownPhoneButton)
	await t
		.expect(await checkLabels(myAccountPage.dropdownPhoneOptions,options)).ok('Dropdown options were not correctly displayed')
		.expect(myAccountPage.saveButton.exists).ok('Save button was not found')
		.expect(myAccountPage.cancelButton.exists).ok('Cancel button was not found')
		.expect(myAccountPage.resetPasswordButton.exists).ok('Reset Password button was not found')
		.expect(myAccountPage.dropdownPhoneButton.exists).ok('Dropdown button was not found')
		.expect(myAccountPage.label.withText(labels['ui-setup-008']).exists).ok('Username label was not found')
		.expect(myAccountPage.usernameInput.exists).ok('Username input was not found')
		.expect(myAccountPage.label.withText(labels['ui-setup-009']).exists).ok('First Name label was not found')
		.expect(myAccountPage.firstnameInput.exists).ok('First Name input was not found')
		.expect(myAccountPage.label.withText(labels['ui-setup-010']).exists).ok('Middle Name label was not found')
		.expect(myAccountPage.middlenameInput.exists).ok('Middle Name input was not found')
		.expect(myAccountPage.label.withText(labels['ui-setup-011']).exists).ok('Last Name label was not found')
		.expect(myAccountPage.lastnameInput.exists).ok('Last Name input was not found')
		.expect(myAccountPage.label.withText(labels['ui-setup-013']).exists).ok('Title label was not found')
		.expect(myAccountPage.titleInput.exists).ok('Title input was not found')
		.expect(myAccountPage.label.withText(labels['ui-setup-012']).exists).ok('Phone Number label was not found')
		.expect(myAccountPage.phoneNumberInput.exists).ok('Phone Number input was not found')
		.expect(myAccountPage.label.withText(labels['ui-setup-014']).exists).ok('Email label was not found')
		.expect(myAccountPage.emailInput.exists).ok('Email input was not found')
		.expect(myAccountPage.uploadFileInput.exists).ok('Upload File was not found')
	
	//6. Click Cancel button
		.click(myAccountPage.cancelButton)
		.expect(page.title.withText(labels['ui-setup-000']).exists).notOk('Close button action was not made');
});

test(`TC 27219: Mobile - My Account Language`, async t => {
	const labels = t.fixtureCtx.labels;
	let myAccountPage = new MyAccountMobilePage();

	//2. Open the User dropdown
	await t
		.click(userDropdown.image)
	
	//3. Click on the "My Account" item
		.click(userDropdown.myAccount)

	//4. Select "Language" option on dropdown
		.click(myAccountPage.dropdownPhoneButton)
		.click(myAccountPage.dropdownPhoneOptions.withText(labels['ui-setup-002'])) // Language

//5. Check the page elements
		.expect(myAccountPage.label.withText(insensitive(labels['ui-setup-003'])).exists).ok('The dropdown label is not correct')
		.expect(myAccountPage.languageDropdown.exists).ok('The "Language" dropdown should exist')
		.click(myAccountPage.languageDropdown);
	let preferredLanguages = await apiHandler.getPreferredLanguages();
	await t
		.expect(await checkLabels(myAccountPage.dropdownOptions,preferredLanguages,'language_name')).ok('Preferred Languages options are not correct');
			
});

test(`TC 27220: Mobile - My Account Notifications`, async t => {
	const labels = t.fixtureCtx.labels;
	let myAccountPage = new MyAccountMobilePage();

	//2. Open the User dropdown
	await t
		.click(userDropdown.image)
	
    //3. Click on the "My Account" item
        .wait(5000)
		.click(userDropdown.myAccount)

	//4. Select "Notifications" option on dropdown
		.click(myAccountPage.dropdownPhoneButton)
		.click(myAccountPage.dropdownPhoneOptions.withText(labels['ui-setup-020'])) // Notifications

	//5. Check the page elements
	let notifications = await apiHandler.getNotificationTypes();
	let deliveryTypes = await apiHandler.getDeliveryTypes();
	let notificationHeaders = [
		labels['ui-setup-021'], // Notification
		labels['ui-setup-022']  // Delivery Type
	];
	
	await t
		.expect(await checkLabels(myAccountPage.notificationsTable.headers,notificationHeaders)).ok('Notification Table headers are not correct')
		.expect(await checkLabels(myAccountPage.notificationsTable.cells,notifications,'notification_type_name')).ok('Notifications were not displayed correctly');
	let firstDeliveryOptions = myAccountPage.notificationsTable.rows.nth(1).find('td').nth(1).find('.dropdown-option');
	await t.click(myAccountPage.notificationsTable.rows.nth(1).find('td').nth(1).find('input'));
	await t.expect(await checkLabels(firstDeliveryOptions,deliveryTypes,'delivery_type_name')).ok('Delivery Type options were not displayed correctly')
				
});

test(`TC 27221: Mobile - My Account Activity`, async t => {
	const labels = t.fixtureCtx.labels;
	let myAccountPage = new MyAccountMobilePage();
	let headers = [
		labels['ui-setup-018'], // Activity
		labels['ui-setup-019']	// Date
	];

	//2. Open the User dropdown
	await t
		.click(userDropdown.image)
	
	//3. Click on the "My Account" item
		.click(userDropdown.myAccount)

	//4. Select "Activity" option on dropdown
		.click(myAccountPage.dropdownPhoneButton)
		.click(myAccountPage.dropdownPhoneOptions.withText(labels['ui-setup-018'])) // Activity

	//5. Check the page elements
		.expect(myAccountPage.profileActivityTable.exists).ok('The "Profile Activity" table grid should exist', timeout);
	await t.expect(await checkLabels(myAccountPage.profileActivityTable.headers,headers)).ok('Table headers were not correctly displayed');			
});

test('TC 27574: Check hamb menu navigation Corcentric expense', async t=>{
    const temHomeMenues = await apiHandler.getTemHomeMenues();
    const labels = t.fixtureCtx.labels;
    let sideHomeMenu = (getMenu(t.fixtureCtx.menues,101)).title;
    let sideExpensesMenu = (getMenu(t.fixtureCtx.menues,102)).title;
    let sideReportsMenu = (getMenu(t.fixtureCtx.menues,103)).title;
    let sideReceiptsMenu = (getMenu(t.fixtureCtx.menues,104)).title;
    let sideApprovalMenu = (getMenu(t.fixtureCtx.menues,105)).title;
    let sideDashboardMenu = (getMenu(t.fixtureCtx.menues,106)).title;
    let sideConfigurationMenu = (getMenu(t.fixtureCtx.menues, 301)).title;
    let labelTitle = labels['ui-cm-005'];
    let reciptsTitlePageLabel = labels['ui-rec-000'];

    await t
    // step 2
    .click(dashboardTitles.withText(t.fixtureCtx.app))
    .expect(page.title.innerText).eql(labelTitle, 'Title page wa wrong');
    await t.expect(await checkLabels(dashboardTitles,temHomeMenues,'title')).ok('TEM menus should exists');
    
    // step 3
   await t
    .click(headerPage.navBarToggler)
    .expect(sideBarPage.items.withText(sideHomeMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideExpensesMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideReportsMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideReceiptsMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideApprovalMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideDashboardMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideConfigurationMenu).exists).ok('Side bar item should exist')
    //step 4
    .click(sideBarPage.items.withText(sideExpensesMenu))
    .expect(page.title.innerText).eql(sideExpensesMenu, 'Title page wa wrong')
    //step 5
    .click(headerPage.navBarToggler)
    .expect(sideBarPage.items.withText(sideHomeMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideExpensesMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideReportsMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideReceiptsMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideApprovalMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideDashboardMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideConfigurationMenu).exists).ok('Side bar item should exist')
    //step 6
    .click(sideBarPage.items.withText(sideReportsMenu))
    .expect(page.title.innerText).eql(sideReportsMenu, 'Title page wa wrong')
    //step 7
    .click(headerPage.navBarToggler)
    .expect(sideBarPage.items.withText(sideHomeMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideExpensesMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideReportsMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideReceiptsMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideApprovalMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideDashboardMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideConfigurationMenu).exists).ok('Side bar item should exist')
    //step 8
    .click(sideBarPage.items.withText(sideReceiptsMenu));
await t
    .wait(2000)
    .expect(page.title.innerText).eql(reciptsTitlePageLabel, 'Title page wa wrong')
    //step 9 
    .click(headerPage.navBarToggler)
    .expect(sideBarPage.items.withText(sideHomeMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideExpensesMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideReportsMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideReceiptsMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideApprovalMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideDashboardMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideConfigurationMenu).exists).ok('Side bar item should exist')
    //step 10
    .click(sideBarPage.items.withText(sideApprovalMenu))
    .expect(page.title.innerText).eql(sideApprovalMenu, 'Title was wrong')
    //step 11
    .click(headerPage.navBarToggler)
    .expect(sideBarPage.items.withText(sideHomeMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideExpensesMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideReportsMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideReceiptsMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideApprovalMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideDashboardMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideConfigurationMenu).exists).ok('Side bar item should exist')
    //step 12
    .click(sideBarPage.items.withText(sideDashboardMenu))
    .expect(page.title.innerText).eql(sideDashboardMenu, 'Title page wa wrong')
    //step 13
    .click(headerPage.navBarToggler)
    .expect(sideBarPage.items.withText(sideHomeMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideExpensesMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideReportsMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideReceiptsMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideApprovalMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideDashboardMenu).exists).ok('Side bar item should exist')
    .expect(sideBarPage.items.withText(sideConfigurationMenu).exists).ok('Side bar item should exist')
    //step 14
    .click(sideBarPage.items.withText(sideHomeMenu))
    .expect(page.title.innerText).eql(labelTitle, 'Title page wa wrong');
    await t
    .expect(await checkLabels(dashboardTitles,temHomeMenues,'title')).ok('TEM menus should exists');
});