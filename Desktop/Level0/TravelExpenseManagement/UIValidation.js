import { Selector } from 'testcafe';
import { byID, getCopyright, insensitive, checkLabels, timeout, getMenu, checkRequests, logger, visible, getWindowInnerWidth, getWindowInnerHeight, longTimeout, paste } from '../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after, registerTestStartTime } from '../../../hooks';
import users from '../../../users';
import config from '../../../config';
import Page from '../../../page-models/page';
import HeaderPage from '../../../page-models/headerPage';
import ReportsPage from '../../../page-models/tem/reportsPage';
import ExpensesPage from '../../../page-models/tem/expensesPage';
import SideBarPage from '../../../page-models/sideBarPage';
import ReceiptsPage from '../../../page-models/tem/receiptsPage';
import ProjectCodesPage from '../../../page-models/tem/cost-allocation/projectCodesPage';
import DistanceRateSetupPage from '../../../page-models/tem/distanceRateSetupPage';
import CurrencySetupPage from '../../../page-models/tem/currencySetupPage';
import ManageUsersPage from '../../../page-models/tem/users/manageUsersPage';
import UserMappingPage from '../../../page-models/tem/users/userMappingPage';
import DateFormatPage from '../../../page-models/tem/dateFormatPage';
import GlAllocationSettingPage from '../../../page-models/tem/glAllocationSettingPage';
import PoliciesPage from '../../../page-models/tem/compliance-setup/policiesPage';
import RulesPage from '../../../page-models/tem/compliance-setup/rulesPage';
import EmailTemplatesPage from '../../../page-models/tem/emailTemplatesPage';
import ExpenseCategoryPage from '../../../page-models/tem/cost-allocation/expenseCategoryPage';
import GLMappingPage from '../../../page-models/tem/cost-allocation/glMappingPage';
import BrandingModulePage from '../../../page-models/tem/brandingModulePage';
import GroupsPage from '../../../page-models/tem/groupsPage';
import APIntegrationPage from '../../../page-models/tem/apIntegrationPage';
import ManageRolesPage from '../../../page-models/tem/manageRolesPage';
import ApprovalsPage from '../../../page-models/tem/approvalsPage';
import TopReportsManagersPage from '../../../page-models/tem/topReportsManagersPage';
import CategorySpendByDepartmentPage from '../../../page-models/tem/categorySpendByDepartmentPage';
import DepartmentSpendByCategoryPage from '../../../page-models/tem/departmentSpendByCategoryPage';
import ManagerCycleTimesPage from '../../../page-models/tem/managerCycleTimesPage';
import ViolationsByTypePage from '../../../page-models/tem/violationsByTypePage';
import EmployeeCycleTimesPage from '../../../page-models/tem/employeeCycleTimesPage';
import OOODelegationPage from '../../../page-models/tem/oooDelegationPage';
import CustomBrandingModal from '../../../page-models/tem/customBrandingModal';
import ProjectModal from '../../../page-models/tem/cost-allocation/projectModal';
import InfoModal from '../../../page-models/infoModal';
import ApprovalProfilePage from '../../../page-models/tem/users/approvalProfilePage';
import UserManagementPage from '../../../page-models/tem/users/userManagementPage';
import APIHandler from '../../../utils/apiHandler';
import AddEditGroupsModal from '../../../page-models/tem/addEditGroupsModal';
import ApprovalRoutingPage from '../../../page-models/tem/approvalRoutingPage';
import NewRulePage from '../../../page-models/tem/compliance-setup/newRulePage';
import ConfirmModal from '../../../page-models/confirmModal';
import GroupsMappingPage from '../../../page-models/tem/groupsMappingPage';
import MappingPage from '../../../page-models/tem/mappingPage';
import ManageGroupRolePage from '../../../page-models/tem/users/manageGroupRolePage'
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import DefineGLPage from '../../../page-models/tem/generalLedger/defineGL'
import ManageGLPage from '../../../page-models/tem/generalLedger/manageGL'
import ManageGLMappingPage from '../../../page-models/tem/generalLedger/manageGLMapping'
import UserGLDefaultPage from '../../../page-models/tem/generalLedger/userGLDefault'
import UserGLDefaultMappingPage from '../../../page-models/tem/generalLedger/userGLDefaultMapping'


const localizator = new Localizator();
const page = new Page();
const args = parseArguments();
const headerPage = new HeaderPage();
const infoModal = new InfoModal();
const apiHandler  = new APIHandler();
const category = {
	id: 62000,
	name: "Corcentric Expense"
};

let temFixture = fixture`Level 0 - Corcentric Expense - UI Validations - Running on "${args.env.toUpperCase()}"`
    .page(config[args.env].baseUrl)
    .requestHooks(logger)
    .before(async ctx  => {
        await before();
        let apps = await apiHandler.getApps(); 
        let application = apps.find(element => element['application_id'] === 62000);
        let menues = await apiHandler.getMenues(application.menu_param);
        ctx.apps = apps;
        ctx.app = application.title; //Corcentric Expense
        ctx.menues = menues;
        ctx.configurationMenu = getMenu(menues,301);
        ctx.costAllocationMenu = getMenu(ctx.configurationMenu.submenu,30101);
        ctx.manageUsersMenu = getMenu(ctx.configurationMenu.submenu,30106);
        ctx.complianceSetupMenu = getMenu(ctx.configurationMenu.submenu,30110);
        ctx.groupsMenu = getMenu(ctx.configurationMenu.submenu,30116);
        ctx.notificationMenu = getMenu(ctx.configurationMenu.submenu,30120);
        ctx.settingsMenu = getMenu(ctx.configurationMenu.submenu,30200);
        ctx.generalLedger = getMenu(ctx.configurationMenu.submenu,30117);
        ctx.profile = await apiHandler.getMyProfile();
        ctx.labels = await localizator.getLabelsAsJson('ui-gldefault-*,ui-managegl-*,ui-00-03*,ui-00-02*,ui-policy-000,ui-email-000,ui-rule-000,ui-email-000,ui-date-000,ui-usrm-300,ui-usrm-000,ui-ccy-000,ui-dist-000,ui-prjcod-*,ui-expcat-*,ui-glmap-0*,ui-proxy-0*,ui-brand-000,ui-group-000,ui-group-016,ui-gldef-000,ui-glimp-000,ui-reporting-00*,ui-dash-0*,ui-oood-000,ui-datatable-001,ui-defroltem-030,ui-apvuser-0*,ui-group-0*,msg-00-002,ui-usr-0*,ui-groupmap-*,ui-apvmethod-000,ui-manageroles-*,ui-rolemembership-0*,ui-cm-0*,ui-usr-*,ui-ap-*,ui-usrm-*,ui-setup-*,ui-glmap-*,ui-exp-*');
    })
    .after(async ctx  => {
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
        await checkRequests(logger.requests);	
    });

loadFixture(users[args.user],category,temFixture);

test('TC 24820: \'Welcome\' Page', async t => {
    let menues = t.fixtureCtx.menues;
    let labels = t.fixtureCtx.labels;
    let dashboardButtons = Selector('div.button-group-dashboard');
    let sideBarPage = new SideBarPage();
    let copyright = getCopyright(await apiHandler.getBranding());
    copyright = copyright.replace('  ', ' ');
   
    await t
    //2. Go to Corcentric Expense
    //3. Check Page Title
        .expect(page.title.innerText).match(insensitive(labels['ui-00-030']),'The "Page Title" was wrong', timeout)
    //4. Check the Page Buttons
        .expect(dashboardButtons.withText(labels['ui-00-031']).exists).ok('The "Create New Report" button should exist')
        .expect(dashboardButtons.withText(labels['ui-00-031']).find('i').hasClass('fa-file-text-o')).ok('The "Create New Report" button should have a "File text" icon')
        .expect(dashboardButtons.withText(labels['ui-00-032']).exists).ok('The "Add an Expense" button should exist')
        .expect(dashboardButtons.withText(labels['ui-00-032']).find('i').hasClass('fa-credit-card')).ok('The "Add an Expense" button should have a "Credit card" icon')
        .expect(dashboardButtons.withText(labels['ui-00-033']).exists).ok('The "Add a Receipt" button should exist')
        .expect(dashboardButtons.withText(labels['ui-00-033']).find('i').hasClass('fa-usd')).ok('The "Add a Receipt" button should have a "USD" icon')
        .expect(dashboardButtons.withText(labels['ui-00-034']).exists).ok('The "Manage Approvals" button should exist')
        .expect(dashboardButtons.withText(labels['ui-00-034']).find('i').hasClass('fa-check-square-o')).ok('Manage Approvals" button should have a "check square" icon')
        .expect(dashboardButtons.withText(labels['ui-00-035']).exists).ok('The "Dashboards" button should exist')
        .expect(dashboardButtons.withText(labels['ui-00-035']).find('i').hasClass('fa-file-text-o')).ok('The "Dashboards" button should have a "File text" icon')
    //5. Check Headers - Three buttons are displayed
        .expect(headerPage.plusReport.exists).ok('The "+REPORT" button should exist')
        .expect(headerPage.plusExpense.exists).ok('The "+EXPENSE" button should exist')
        .expect(headerPage.plusReceipt.exists).ok('The "+RECEIPT" button should exist')
        .expect(headerPage.plusReport.innerText).contains(labels['ui-00-020'],'The "+REPORT" button should exist')
        .expect(headerPage.plusExpense.innerText).contains(labels['ui-00-021'],'The "+EXPENSE" button should exist')
        .expect(headerPage.plusReceipt.innerText).contains(labels['ui-00-022'],'The "+RECEIPT" button should exist')
    //6. Check Left menu
        .expect(byID(getMenu(menues,101).action_key).exists).ok('The "Home" menu should exist')
        .expect(byID(getMenu(menues,103).action_key).exists).ok('The "Expenses" menu should exist')
        .expect(byID(getMenu(menues,102).action_key).exists).ok('The "Reports" menu should exist')
        .expect(byID(getMenu(menues,104).action_key).exists).ok('The "Receipts" menu should exist')
        .expect(byID(getMenu(menues,105).action_key).exists).ok('The "Approvals" menu should exist')
        .expect(byID(getMenu(menues,106).action_key).exists).ok('The "Dashboards" menu should exist')
        .expect(byID(getMenu(menues,301).action_key).exists).ok('The "Configuration" menu should exist')
        .expect(sideBarPage.copyright.innerText).contains(copyright)
    //7. Check "Configuration" option
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //8. Check "Compliance Setup" option
        .expect(byID(t.fixtureCtx.complianceSetupMenu.action_key).exists).ok('The "Compliance Setup" menu should exist')
        .click(byID(t.fixtureCtx.complianceSetupMenu.action_key))
        .expect(byID(getMenu(t.fixtureCtx.complianceSetupMenu.submenu,3011001).action_key).exists).ok('The "Policies" menu should exist')
        .expect(byID(getMenu(t.fixtureCtx.complianceSetupMenu.submenu,3011002).action_key).exists).ok('The "Rules" menu should exist')
        .click(byID(t.fixtureCtx.complianceSetupMenu.action_key))
    //9. Check "Cost Allocation" option
        .expect(byID(t.fixtureCtx.costAllocationMenu.action_key).exists).ok('The "Cost Allocation" menu should exist')
        .click(byID(t.fixtureCtx.costAllocationMenu.action_key))
        //.expect(byID(getMenu(t.fixtureCtx.costAllocationMenu.submenu,3010102).action_key).exists).ok('The "GL Mapping" menu should exist')
        .expect(byID(getMenu(t.fixtureCtx.costAllocationMenu.submenu,3010103).action_key).exists).ok('The "Projects Codes" menu should exist')
        .click(byID(t.fixtureCtx.costAllocationMenu.action_key))
    //10. Check "Groups" option
        .expect(byID(t.fixtureCtx.groupsMenu.action_key).exists).ok('The "Groups" menu should exist')
        .click(byID(t.fixtureCtx.groupsMenu.action_key))
        .expect(byID(getMenu(t.fixtureCtx.groupsMenu.submenu,301161).action_key).exists).ok('The "Groups Mapping" menu should exist') 
        .expect(byID(getMenu(t.fixtureCtx.groupsMenu.submenu,30107).action_key).exists).ok('The "Manage Groups" menu should exist') 
        .expect(byID(getMenu(t.fixtureCtx.groupsMenu.submenu,30114).action_key).exists).ok('The "Manage Roles" menu should exist') 
        .click(byID(t.fixtureCtx.groupsMenu.action_key))
    //11. Check "Notification" option
     //   .expect(byID(t.fixtureCtx.notificationMenu.action_key).exists).ok('The "Notification" menu should exist')
     //   .click(byID(t.fixtureCtx.notificationMenu.action_key))
     //   .expect(byID(getMenu(t.fixtureCtx.notificationMenu.submenu,30111).action_key).exists).ok('The "Email templates" menu should exist')
     //   .click(byID(t.fixtureCtx.notificationMenu.action_key))
    //13. Check "Settings" option
        .expect(byID(t.fixtureCtx.settingsMenu.action_key).exists).ok('The "Settings" menu should exist')
        .click(byID(t.fixtureCtx.settingsMenu.action_key))
        .expect(byID(getMenu(t.fixtureCtx.settingsMenu.submenu,30113).action_key).exists).ok('The "AP Integration" menu should exist')
        .expect(byID(getMenu(t.fixtureCtx.settingsMenu.submenu,30115).action_key).exists).ok('The "Approval Routing" menu should exist')
        .expect(byID(getMenu(t.fixtureCtx.settingsMenu.submenu,30103).action_key).exists).ok('The "Branding Module" menu should exist')
        .expect(byID(getMenu(t.fixtureCtx.settingsMenu.submenu,30105).action_key).exists).ok('The "Currency Setup" menu should exist')
        .expect(byID(getMenu(t.fixtureCtx.settingsMenu.submenu,30109).action_key).exists).ok('The "Date Format" menu should exist')
        .expect(byID(getMenu(t.fixtureCtx.settingsMenu.submenu,30104).action_key).exists).ok('The "Distance Rate Setup" menu should exist')
        .expect(byID(getMenu(t.fixtureCtx.settingsMenu.submenu,3010101).action_key).exists).ok('The "Expense Category" menu should exist')
        .click(byID(t.fixtureCtx.settingsMenu.action_key))
    //9. Check "Manage Users" option
        .click(byID(t.fixtureCtx.manageUsersMenu.action_key))
        .expect(byID(getMenu(t.fixtureCtx.manageUsersMenu.submenu,3010603).action_key).exists).ok('The "Manage Users" menu should exist')
        .expect(byID(getMenu(t.fixtureCtx.manageUsersMenu.submenu,3010602).action_key).exists).ok('The "User Mapping" menu should exist')
        .expect(byID(getMenu(t.fixtureCtx.manageUsersMenu.submenu,3010606).action_key).exists).ok('The "Manage Group-Role" menu should exist');
});

test('TC 24826: \'Reports\' Page', async t => {
    let reportsPage = new ReportsPage();
    let reportsLabels = await localizator.getLabelsAsJson('ui-rep-*');
    let reportsHeaders = [ 	reportsLabels['ui-rep-007'], //NAME
        reportsLabels['ui-rep-008'], //PERIOD
        reportsLabels['ui-rep-009'], //DATE SUBMITTED
        reportsLabels['ui-rep-010'], //AMOUNT
        reportsLabels['ui-rep-011'], //COMPLIANCE
        reportsLabels['ui-rep-012']	 //STATUS
    ]; 
    let complianceMenu = await apiHandler.getComplianceMenu().catch();
    let statusMenu = await apiHandler.getStatusMenu();
    let menues = t.fixtureCtx.menues;
    let reports = byID(getMenu(menues,102).action_key);

    await t
        .click(reports)
        .expect(page.title.innerText).match(insensitive(reportsLabels['ui-rep-000']),'The "Page Title" was wrong', timeout)
        .expect(reportsPage.allTab.innerText).contains(reportsLabels['ui-rep-001']) 		//All tab
        .expect(reportsPage.pendingTab.innerText).contains(reportsLabels['ui-rep-002'])		//Pending tab
        .expect(reportsPage.approvedTab.innerText).contains(reportsLabels['ui-rep-003'])	//Approved tab
        .expect(reportsPage.rejectedTab.innerText).contains(reportsLabels['ui-rep-004'])	//Rejected tab
        .expect(reportsPage.paidTab.innerText).contains(reportsLabels['ui-rep-005'])		//Paid tab
        .expect(reportsPage.draftTab.innerText).contains(reportsLabels['ui-rep-006']) 		//Draft tab
        .expect(reportsPage.allNameInput.exists).ok('The "Name" input for the "All" table should exist')
        .expect(reportsPage.allPeriodDatepicker.exists).ok('The "Period" date picker for the "All" table should exist')
        .expect(reportsPage.allDateSubmittedDatepicker.exists).ok('The "Date Submitted" date picker for the "All" table should exist')
        .expect(reportsPage.allAmountStartInput.exists).ok('The "Amount Start" input for the "All" table should exist')
        .expect(reportsPage.allAmountEndInput.exists).ok('The "Amount End" input for the "All" table should exist')
        .expect(reportsPage.allCompDropdown.exists).ok('The "Compliance" dropdown for the "All" table should exist')
        .expect(reportsPage.allStatDropdown.exists).ok('The "Status" dropdown for the "All" table should exist');
    await t
        .expect(await checkLabels(reportsPage.allTable.headers,reportsHeaders)).ok()
        .click(reportsPage.allCompDropdown);
    await t
        .expect(await checkLabels(reportsPage.allCompDropdownOptions,complianceMenu,'compliance_name')).ok()
        .click(reportsPage.allStatDropdown);
    await t
        .expect(await checkLabels(reportsPage.allStatDropdownOptions,statusMenu,'status_name')).ok()
        .click(reportsPage.pendingTab)
        .expect(reportsPage.pendingNameInput.exists).ok('The "Name" input for the "Pending" table should exist')
        .expect(reportsPage.pendingPeriodDatepicker.exists).ok('The "Period" date picker for the "Pending" table should exist')
        .expect(reportsPage.pendingDateSubmittedDatepicker.exists).ok('The "Date Submitted" date picker for the "Pending" table should exist')
        .expect(reportsPage.pendingAmountStartInput.exists).ok('The "Amount Start" input for the "Pending" table should exist')
        .expect(reportsPage.pendingAmountEndInput.exists).ok('The "Amount End" input for the "Pending" table should exist')
        .expect(reportsPage.pendingCompDropdown.exists).ok('The "Compliance" dropdown for the "Pending" table should exist')
        .expect(reportsPage.pendingStatDropdown.exists).ok('The "Status" dropdown for the "Pending" table should exist');
    await t
        .expect(await checkLabels(reportsPage.pendingTable.headers,reportsHeaders)).ok('The headers are not correctly')
        .click(reportsPage.pendingCompDropdown);
    await t
        .wait(2000)
        .expect(await checkLabels(reportsPage.pendingCompDropdownOptions,complianceMenu,'compliance_name')).ok('The options are not correctly')
        .click(reportsPage.pendingStatDropdown);
    await t
        .expect(await checkLabels(reportsPage.pendingStatDropdownOptions,statusMenu,'status_name')).ok('The options are not correctly')
        .click(reportsPage.approvedTab)
        .expect(reportsPage.approvedNameInput.exists).ok('The "Name" input for the "Approved" table should exist')
        .expect(reportsPage.approvedPeriodDatepicker.exists).ok('The "Period" date picker for the "Approved" table should exist')
        .expect(reportsPage.approvedDateSubmittedDatepicker.exists).ok('The "Date Submitted" date picker for the "Approved" table should exist')
        .expect(reportsPage.approvedAmountStartInput.exists).ok('The "Amount Start" input for the "Approved" table should exist')
        .expect(reportsPage.approvedAmountEndInput.exists).ok('The "Amount End" input for the "Approved" table should exist')
        .expect(reportsPage.approvedCompDropdown.exists).ok('The "Compliance" dropdown for the "Approved" table should exist')
        .expect(reportsPage.approvedStatDropdown.exists).ok('The "Status" dropdown for the "Approved" table should exist');
    await t
        .expect(await checkLabels(reportsPage.approvedTable.headers,reportsHeaders)).ok('The headers are not correctly')
        .click(reportsPage.approvedCompDropdown);
    await t
        .expect(await checkLabels(reportsPage.approvedCompDropdownOptions,complianceMenu,'compliance_name')).ok('The options are not correctly')
        .click(reportsPage.approvedStatDropdown);
    await t
        .expect(await checkLabels(reportsPage.approvedStatDropdownOptions,statusMenu,'status_name')).ok('The options are not correctly')
        .click(reportsPage.rejectedTab)
        .expect(reportsPage.rejectedNameInput.exists).ok('The "Name" input for the "Rejected" table should exist')
        .expect(reportsPage.rejectedPeriodDatepicker.exists).ok('The "Period" date picker for the "Rejected" table should exist')
        .expect(reportsPage.rejectedDateSubmittedDatepicker.exists).ok('The "Date Submitted" date picker for the "Rejected" table should exist')
        .expect(reportsPage.rejectedAmountStartInput.exists).ok('The "Amount Start" input for the "Rejected" table should exist')
        .expect(reportsPage.rejectedAmountEndInput.exists).ok('The "Amount End" input for the "Rejected" table should exist')
        .expect(reportsPage.rejectedCompDropdown.exists).ok('The "Compliance" dropdown for the "Rejected" table should exist')
        .expect(reportsPage.rejectedStatDropdown.exists).ok('The "Status" dropdown for the "Rejected" table should exist')
    await t
        .expect(await checkLabels(reportsPage.rejectedTable.headers,reportsHeaders)).ok('The headers are not correctly')
        .click(reportsPage.rejectedCompDropdown);
    await t
        .expect(await checkLabels(reportsPage.rejectedCompDropdownOptions,complianceMenu,'compliance_name')).ok('The options are not correctly')
        .click(reportsPage.rejectedStatDropdown);
    await t
        .expect(await checkLabels(reportsPage.rejectedStatDropdownOptions,statusMenu,'status_name')).ok('The options are not correctly')
        .click(reportsPage.paidTab)
        .expect(reportsPage.paidNameInput.exists).ok('The "Name" input for the "Paid" table should exist')
        .expect(reportsPage.paidPeriodDatepicker.exists).ok('The "Period" date picker for the "Paid" table should exist')
        .expect(reportsPage.paidDateSubmittedDatepicker.exists).ok('The "Date Submitted" date picker for the "Paid" table should exist')
        .expect(reportsPage.paidAmountStartInput.exists).ok('The "Amount Start" input for the "Paid" table should exist')
        .expect(reportsPage.paidAmountEndInput.exists).ok('The "Amount End" input for the "Paid" table should exist')
        .expect(reportsPage.paidCompDropdown.exists).ok('The "Compliance" dropdown for the "Paid" table should exist')
        .expect(reportsPage.paidStatDropdown.exists).ok('The "Status" dropdown for the "Paid" table should exist');
    await t
        .expect(await checkLabels(reportsPage.paidTable.headers,reportsHeaders)).ok('The headers are not correctly')
        .click(reportsPage.paidCompDropdown);
    await t
        .expect(await checkLabels(reportsPage.paidCompDropdownOptions,complianceMenu,'compliance_name')).ok('The options are not correctly')
        .click(reportsPage.paidStatDropdown);
    await t
        .expect(await checkLabels(reportsPage.paidStatDropdownOptions,statusMenu,'status_name')).ok('The options are not correctly')
        .click(reportsPage.draftTab)
        .expect(reportsPage.draftNameInput.exists).ok('The "Name" input for the "Draft" table should exist')
        .expect(reportsPage.draftPeriodDatepicker.exists).ok('The "Period" date picker for the "Draft" table should exist')
        .expect(reportsPage.draftDateSubmittedDatepicker.exists).ok('The "Date Submitted" date picker for the "Draft" table should exist')
        .expect(reportsPage.draftAmountStartInput.exists).ok('The "Amount Start" input for the "Draft" table should exist')
        .expect(reportsPage.draftAmountEndInput.exists).ok('The "Amount End" input for the "Draft" table should exist')
        .expect(reportsPage.draftCompDropdown.exists).ok('The "Compliance" dropdown for the "Draft" table should exist')
        .expect(reportsPage.draftStatDropdown.exists).ok('The "Status" dropdown for the "Draft" table should exist')
        .click(reportsPage.draftCompDropdown)
        .wait(2000);
    await t
        .expect(await checkLabels(reportsPage.draftCompDropdownOptions,complianceMenu,'compliance_name')).ok('The headers are not correctly')
        .click(reportsPage.draftStatDropdown)
        .wait(2000);
    await t
        .expect(await checkLabels(reportsPage.draftStatDropdownOptions,statusMenu,'status_name')).ok('The options are not correctly');
    reportsHeaders[2]=reportsLabels['ui-rep-014']; //The last table has Report Created instead of submitted
    await t.expect(await checkLabels(reportsPage.draftTable.headers,reportsHeaders)).ok('The headers are not correctly');
});

test('TC 26773: \'Create Report\' Page', async t => {
    let reportsPage = new ReportsPage();
    let reportsLabels = await localizator.getLabelsAsJson('ui-rep-*');
    let dashboardButtons = Selector('div.button-group-dashboard');
    let labels = t.fixtureCtx.labels;
    let codes = await apiHandler.getAllCodes();
    let projectCodeConfig = await apiHandler.getProjectCodeConfig();

    await t    
    //3. Go to Add an Create Report
        .click(dashboardButtons.withText(labels['ui-00-031']))
    //4. Check Page Title
        .expect(page.title.innerText).match(insensitive(reportsLabels['ui-rep-123']),'The "Page Title" was wrong', timeout);
    await t
    //5. Check Elements Page
        .expect(reportsPage.saveButton.exists).ok('The "Save" button should exist')
        .expect(reportsPage.fromDatepicker.exists).ok('The "From" datepicker should exist')
        .expect(reportsPage.toDatepicker.exists).ok('The "To" datepicker should exist')
        .expect(reportsPage.reportNameInput.exists).ok('The "Report Name" input should exist');
    await t
        .expect(reportsPage.businessPurposeInput.exists).ok('The "Business Purpose" input should exist')
        .expect(reportsPage.tooltip.exists).ok('The Tooltip should exist');

    if( projectCodeConfig[0].project_code_visibility.includes('Report') ){
        await t
            .expect(reportsPage.projectCodeDropdown.exists).ok('The "Business Purpose" input should exist')
            .expect(reportsPage.labelsPage.withText(t.fixtureCtx.labels['ui-exp-003']).exists).ok('The "Project Code" label should exist');
    }
    await t
    //6. Check Labels page
        .expect(reportsPage.labelsPage.withText(reportsLabels['ui-rep-104']).exists).ok('The "Report Name" label should exist')
        .expect(reportsPage.labelsPage.withText(reportsLabels['ui-rep-105']).exists).ok('The "Business Purpose" label should exist')
        .expect(reportsPage.labelsPage.withText(t.fixtureCtx.labels['ui-cm-009']).exists).ok('The "From" label should exist')
        .expect(reportsPage.labelsPage.withText(t.fixtureCtx.labels['ui-cm-010']).exists).ok('The "To" label should exist');
    await t
    //7. Click save button
        .click(reportsPage.saveButton)      
    //8. Check Error Labels
        .expect(reportsPage.reportNameInput.error.withText(t.fixtureCtx.labels['msg-00-002']).exists).ok('The "Required field" label should exist')
        .expect(reportsPage.businessPurposeInput.error.withText(t.fixtureCtx.labels['msg-00-002']).exists).ok('The "Required field" label should exist')
        .expect(reportsPage.toDatepicker.error.withText(t.fixtureCtx.labels['msg-00-002']).exists).ok('The "Required field" label should exist')
    //9. Click over elements
        .typeText(reportsPage.reportNameInput,"NAME_TEST_26773")
        .typeText(reportsPage.businessPurposeInput,`Purpose_26773`)
        .click(reportsPage.fromDatepicker)      
        .click(reportsPage.toDatepicker);
    
    if( projectCodeConfig[0].project_code_visibility.includes('Report') ){
        await t
            .click(reportsPage.projectCodeDropdown.find('i'))
            .wait(2000);
        
        await t.click(reportsPage.projectCodeDropdown.find('i'));
    }
});

test('TC 24827: \'Receipts\' Page', async t => {
    let receiptsPage = new ReceiptsPage();
    let receiptsLabels = await localizator.getLabelsAsJson('ui-rec-*');
    let receiptsHeaders = [
        receiptsLabels['ui-rec-011'], //Name
        receiptsLabels['ui-rec-010'], //Date Added
        receiptsLabels['ui-rec-013'], //File Size
        receiptsLabels['ui-rec-009'] //Actions
    ];
    let menues = t.fixtureCtx.menues;
    let receipts = byID(getMenu(menues,104).action_key);

    await t
    //2. Go to Corcentric Expense
    //3. Click on the Receipts option from the left side menu
        .click(receipts)
    //4. Check Receipts Page Title
        .expect(page.title.innerText).match(insensitive(receiptsLabels['ui-rec-000']),'The "Page Title" was wrong', timeout);
        await t
    //5. Check date picker and it's components exists
        .expect(receiptsPage.datePickerInput.exists).ok('The date picker should exists')
        await t
        .click(receiptsPage.caledarToggleButton)
        .expect(receiptsPage.datePicker.daysTo.exists).ok('To days should exists')
        .expect(receiptsPage.datePicker.daysFrom.exists).ok('From days should exists')
        .click(receiptsPage.datePicker.comboBoxFromToggler)
        .expect(receiptsPage.datePicker.comboMonthFrom.exists).ok('Month combo box should exists')
        .click(receiptsPage.datePicker.comboBoxToToggler)
        .expect(receiptsPage.datePicker.comboMonthTo.exists).ok('Month combo box should exists')
        .expect(receiptsPage.datePicker.comboYearFrom.exists).ok('Year combo box should exists')
        .expect(receiptsPage.datePicker.comboYearTo.exists).ok('Year combo box should exists')
        .click(receiptsPage.datePicker.buttonClear);
    //6. Check Upload button
    await t
        .expect(receiptsPage.uploadInput.exists).ok('The "Upload" input should exist')
    //7. Check Grid button
        .expect(receiptsPage.gridButton.exists).ok('The "Grid" button should exist')
    //8. Check List button
        .expect(receiptsPage.listButton.exists).ok('The "List" button should exist')
    //9. Click List button
        .click(receiptsPage.listButton)
    //10. Check List view table headers
        .expect(await checkLabels(receiptsPage.receiptsTableHeaders,receiptsHeaders)).ok('Table header lables should be displayed')
    //11. Click Grid button
        .click(receiptsPage.gridButton)
        .expect(receiptsPage.receiptsTable.exists).notOk('Receipts table should not be visible in this view.')
    //12. Click the "Unattached" button
        .click(receiptsPage.unattachedButton);
    if (await receiptsPage.receipts.count==0){
        await t.expect(receiptsPage.labels.withText(receiptsLabels['ui-rec-006']).exists).ok('The message "There are no receipts to show" should be displayed');
    }
    //13. Click the "Attached" button
    await t.click(receiptsPage.attachedButton);
    if (await receiptsPage.receipts.count==0){
        await t.expect(receiptsPage.labels.withText(receiptsLabels['ui-rec-006']).exists).ok('The message "There are no receipts to show" should be displayed');
    }
    //14. Click the "All" button
    await t.click(receiptsPage.allButton);
    if (await receiptsPage.receipts.count==0){
        await t.expect(receiptsPage.labels.withText(receiptsLabels['ui-rec-006']).exists).ok('The message "There are no receipts to show" should be displayed');
    }
});

test('TC 24835: \'Expenses\' Page', async t => {
    let expensesPage = new ExpensesPage();
    let expensesLabels = await localizator.getLabelsAsJson('ui-exp-*');
    let complianceMenu = await apiHandler.getComplianceMenu();
	
    let headers = [
        expensesLabels['ui-exp-200'], //DATE
        expensesLabels['ui-exp-201'], //CATEGORY
        expensesLabels['ui-exp-202'], //REPORT
        expensesLabels['ui-exp-203'], //BUSINESS PURPOSE
        expensesLabels['ui-exp-204'], //AMOUNT
        expensesLabels['ui-exp-206']  //COMPLIANCE
    ];

    let menues = t.fixtureCtx.menues;
    let expenses = byID(getMenu(menues,103).action_key);

    await t
    //2. Go to Corcentric Expense
    //3. Click the 'Expenses' option on the left side menu
        .click(expenses)
    //4. Check the Page Title - The title is 'Expenses'
        .expect(page.title.innerText).match(insensitive(expensesLabels['ui-exp-104']),'The "Page Title" was wrong', timeout)
    //5. Check tabs
        .expect(expensesPage.allTab.innerText).contains(expensesLabels['ui-exp-100'], 'The "All" tab should exist') //All	
        .expect(expensesPage.unclaimedTab.exists).ok('The "Uncliamed" tab should exist')
	 	.expect(expensesPage.unclaimedTab.innerText).contains(expensesLabels['ui-exp-101']) //Unclaimed 
        .expect(expensesPage.notSubmittedTab.exists).ok('The "Not Submitted" tab should exist')
        .expect(expensesPage.notSubmittedTab.innerText).contains(expensesLabels['ui-exp-108']) //Not-Submitted
        .expect(expensesPage.submittedTab.exists).ok('The "Submitted" tab should exist')
        .expect(expensesPage.submittedTab.innerText).contains(expensesLabels['ui-exp-103']); //Submitted
    //6. Check Headers
    await t
        .expect(await checkLabels(expensesPage.allTable.headers,headers)).ok('Table headers should exists')
    //7. Check the filters
        .expect(expensesPage.allTable.exists).ok('The "All" table should exist')
        .expect(expensesPage.rangePicker.exists).ok('The "Range Picker" for the "All" tab should exist')
        .expect(expensesPage.categoryInput.exists).ok('The "Category" input for the "All" tab should exist')
        .expect(expensesPage.reportInput.exists).ok('The "Report" input for the "All" tab should exist')
        .expect(expensesPage.businessPurposeInput.exists).ok('The "Business Purpose" input for the "All" tab should exist')
        .expect(expensesPage.amountStartInput.exists).ok('The "Amount Start" input for the "All" tab should exist')
        .expect(expensesPage.amountEndInput.exists).ok('The "Amount End" input for the "All" tab should exist')
        .expect(expensesPage.complianceDropdown.exists).ok('The "Compliance" dropdown for the "All" tab should exist')
        .expect(expensesPage.allResetButton.exists).ok('The "Reset" button for the "All" tab should exist')
        .click(expensesPage.complianceDropdown);
    await t
        .expect(await checkLabels(expensesPage.complianceDropdownOptions,complianceMenu,'compliance_name')).ok()
    //8. Repeat steps 5, 6 and 7 on all tabs
    //Unclaimed Tab
        .click(expensesPage.complianceDropdown)
        .click(expensesPage.unclaimedTab)
        .expect(expensesPage.unclaimedTable.exists).ok('The "Unclaimed" table should exist')
        .expect(expensesPage.rangePicker.exists).ok('The "Range Picker" for the "Unclaimed" tab should exist')
        .expect(expensesPage.categoryInput.exists).ok('The "Category" input for the "Unclaimed" tab should exist')
        .expect(expensesPage.reportInput.exists).ok('The "Report" input for the "Unclaimed" tab should exist')
        .expect(expensesPage.businessPurposeInput.exists).ok('The "Business Purpose" input for the "Unclaimed" tab should exist')
        .expect(expensesPage.amountStartInput.exists).ok('The "Amount Start" input for the "Unclaimed" tab should exist')
        .expect(expensesPage.amountEndInput.exists).ok('The "Amount End" input for the "Unclaimed" tab should exist')
        .expect(expensesPage.complianceDropdown.exists).ok('The "Compliance" dropdown for the "Unclaimed" tab should exist')
        .expect(expensesPage.unclaimedResetButton.exists).ok('The "Reset" button for the "Unclaimed" tab should exist')
        .click(expensesPage.complianceDropdown);
    await t
        .expect(await checkLabels(expensesPage.unclaimedTable.headers,headers)).ok();
    await t
        .expect(await checkLabels(expensesPage.complianceDropdownOptions,complianceMenu,'compliance_name')).ok()
    //Not submitted Tab
        .click(expensesPage.complianceDropdown)
        .click(expensesPage.notSubmittedTab);
    await t
        .expect(await checkLabels(expensesPage.notSubmittedTable.headers,headers)).ok()
        .expect(expensesPage.notSubmittedTable.exists).ok('The "Not Submitted" table should exist')
        .expect(expensesPage.rangePicker.exists).ok('The "Range Picker" for the "Not Submitted" tab should exist')
        .expect(expensesPage.categoryInput.exists).ok('The "Category" input for the "Not Submitted" tab should exist')
        .expect(expensesPage.reportInput.exists).ok('The "Report" input for the "Not Submitted" tab should exist')
        .expect(expensesPage.businessPurposeInput.exists).ok('The "Business Purpose" input for the "Not Submitted" tab should exist')
        .expect(expensesPage.amountStartInput.exists).ok('The "Amount Start" input for the "Not Submitted" tab should exist')
        .expect(expensesPage.amountEndInput.exists).ok('The "Amount End" input for the "Not Submitted" tab should exist')
        .expect(expensesPage.complianceDropdown.exists).ok('The "Compliance" dropdown for the "Not Submitted" tab should exist')
        .expect(expensesPage.notSubmittedResetButton.exists).ok('The "Reset" button for the "Not Submitted" tab should exist')
        .click(expensesPage.complianceDropdown);
    await t
        .expect(await checkLabels(expensesPage.complianceDropdownOptions,complianceMenu,'compliance_name')).ok()
        .click(expensesPage.complianceDropdown)
    //Submitted Tab
        .click(expensesPage.submittedTab)
        .expect(expensesPage.submittedTable.exists).ok('The "Submitted" table should exist')
        .expect(expensesPage.submittedResetButton.exists).ok('The "Reset" button for the "Submitted" tab should exist')

        .expect(expensesPage.rangePicker.exists).ok('The "Range Picker" for the "Submitted" tab should exist')
        .expect(expensesPage.categoryInput.exists).ok('The "Category" input for the "Submitted" tab should exist')
        .expect(expensesPage.reportInput.exists).ok('The "Report" input for the "Submitted" tab should exist')
        .expect(expensesPage.businessPurposeInput.exists).ok('The "Business Purpose" input for the "Submitted" tab should exist')
        .expect(expensesPage.amountStartInput.exists).ok('The "Amount Start" input for the "Submitted" tab should exist')
        .expect(expensesPage.amountEndInput.exists).ok('The "Amount End" input for the "Submitted" tab should exist')
        .expect(expensesPage.complianceDropdown.exists).ok('The "Compliance" dropdown for the "Submitted" tab should exist')

        .click(expensesPage.complianceDropdown)
        .wait(2000);
    await t
        .expect(await checkLabels(expensesPage.submittedTable.headers,headers)).ok('The headers of the table must be appear', longTimeout);
    await t
        .expect(await checkLabels(expensesPage.complianceDropdownOptions,complianceMenu,'compliance_name')).ok('The Dropdown Options must be appear', longTimeout);
});

test('TC 26770: \'Add an Expense\' Page', async t => {
    let expensesPage = new ExpensesPage();
    let expensesLabels = await localizator.getLabelsAsJson('ui-exp-*');
    let dashboardButtons = Selector('div.button-group-dashboard');
    let labels = t.fixtureCtx.labels;
    let glAllocationConfig = await apiHandler.getGLAllocationConfiguration();
    let projectCodeConfig = await apiHandler.getProjectCodeConfig();
    
    //2. Go to Corcentric Expense
    await t    
    //3. Go to Add an Expense
        .click(dashboardButtons.withText(labels['ui-00-032']))
    //4. Check Page Title
        .expect(page.title.innerText).match(insensitive(expensesLabels['ui-exp-104']),'The "Page Title" was wrong', timeout);
    await t
    //5. Check Elements Page
        .expect(expensesPage.receiptButton.exists).ok('The "Receipt" button should exist')
        .expect(expensesPage.cancelButton.exists).ok('The "Cancel" button should exist')
        .expect(expensesPage.saveButton.exists).ok('The "Save" button should exist')
        .expect(expensesPage.datepickerInput.exists).ok('The "Receipt" button should exist')
        .expect(expensesPage.currencyDropdown.exists).ok('The "Currency" dropdown should exist')
        .expect(expensesPage.amountInput.exists).ok('The "Amount" input should exist')
        .expect(expensesPage.categoryDropdown.exists).ok('The "Category" dropdown should exist')
        .expect(expensesPage.businessPurposeTextarea.exists).ok('The "Business Purpose" textarea should exist')
        .expect(expensesPage.commentTextarea.exists).ok('The "Comment" textarea should exist')
        .expect(expensesPage.questionIcon.exists).ok('The "Question" icon should exist');
    if( projectCodeConfig[0].project_code_visibility.includes('Expense') ){
        // Check Project Code 
        await t
            .expect(expensesPage.labelsPage.withText(expensesLabels['ui-exp-003']).exists).ok('The "Project Code" label should exist')
            .expect(expensesPage.projecCodeDropdown.exists).ok('The "Project Code" dropdown should exist')
            .expect(expensesPage.labelsPage.withText(expensesLabels['ui-exp-019']).exists).ok('The "Billable" label should exist')
            .expect(expensesPage.billable.exists).ok('The "Billable" checkbox should exist')
            .click(expensesPage.billableCheck)
            .click(expensesPage.projecCodeDropdown.find('input'))
            .click(expensesPage.projecCodeDropdown.find('input'));
    }
    // Check grid Allocation
    if(glAllocationConfig.show_allocation_grid){
        await t
            .expect(expensesPage.allocationTab.exists).ok('The "Allocation" tab should exist')
            await t
                .expect(expensesPage.gridAllocation.exists).ok('The "Allocation" grid should exist')
                .expect(expensesPage.gridAllocationAmoun.exists).ok('The "Allocation" amoun should exist')
                .expect(expensesPage.gridAllocationPercentage.exists).ok('The "Allocation" percentage should exist')
                .expect(expensesPage.gridAllocationButtons.exists).ok('The "Allocation" buttons should exist');
                if(glAllocationConfig.allocation_entry_type == 'Multiple'){
                    await t.expect(expensesPage.gridAllocationButtons.find('i.fa.fa-plus.fa-fw.action-icon').exists).ok('The "Allocation Add" buttons should exist');
                }
                    
                let limite = glAllocationConfig.gl_allocation_grid_structure.length; 
                if(limite > 5){
                    limite = 5;
                }
                for(let i=0; i < limite; i++){
                    await t.expect(expensesPage.gridAllocation.find('div.agSegment').nth(i).exists).ok('The "Segment" grid should exist');
                }
    }
    await t
    //6. Check Labels page
        .expect(expensesPage.labelsPage.withText(expensesLabels['ui-exp-000']).exists).ok('The "Date" label should exist')
        .expect(expensesPage.labelsPage.withText(expensesLabels['ui-exp-018']).exists).ok('The "Currency" label should exist')
        .expect(expensesPage.labelsPage.withText(expensesLabels['ui-exp-002']).exists).ok('The "Amount" label should exist')
        .expect(expensesPage.labelsPage.withText(expensesLabels['ui-exp-001']).exists).ok('The "Category" label should exist')
        .expect(expensesPage.labelsPage.withText(expensesLabels['ui-exp-004']).exists).ok('The "Business Purpose" label should exist')
        .expect(expensesPage.labelsPage.withText(expensesLabels['ui-exp-005']).exists).ok('The "Add comment" label should exist');
    await t
    //7. Check Action over Elements
        .click(expensesPage.categoryDropdown.find('button'))
        .click(expensesPage.categoryDropdown.find('button'))
        .click(expensesPage.datepickerInput)
        .click(expensesPage.datepickerInput)
        .click(expensesPage.currencyDropdown.find('input'))
        .click(expensesPage.currencyDropdown.find('input'))
        .typeText(expensesPage.amountInput, '100')
        .typeText(expensesPage.businessPurposeTextarea, 'Business QA')
        .typeText(expensesPage.commentTextarea, 'Automatic Testing')
        .click(expensesPage.receiptButton)
        .wait(2000);
    await t
        .expect(expensesPage.addReceiptsModal.exists).ok('The "Add Receipts" modal should exist')
        .click(expensesPage.addReceiptsModalDoneButton)
        .click(expensesPage.cancelButton);
    
});


test('TC 24876: \'Approvals\' Page', async t => {
    let menues = t.fixtureCtx.menues;
    let approvals = byID(getMenu(menues,105).action_key);
    let approvalsPage = new ApprovalsPage();
    let labels = await localizator.getLabelsAsJson('ui-apv-0*');
    let complianceMenu = await apiHandler.getComplianceMenu();
    let statusMenu = await apiHandler.getStatusMenu();
    let approvalHeaders = [ labels['ui-apv-006'],
        labels['ui-apv-007'],
        labels['ui-apv-008'],
        labels['ui-apv-009'],
        labels['ui-apv-010'],
        labels['ui-apv-011'] ];

    await t
    //2. Go to Corcentric Expense
    //3. Click on the Approvals menu on the left
        .click(approvals)
    //4. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-apv-000']),'The "Page Title" was wrong', timeout)
    //5. Check Page Elements
        .expect(approvalsPage.allTab.exists).ok('The "All" tab should exist')
        .expect(approvalsPage.allTable.exists).ok('The grid table should exist. Perhaps it was empty')
        .expect(approvalsPage.allResetButton.exists).ok('The "Reset" button for the "All" tab table should exist')
        .expect(approvalsPage.nameInput.exists).ok('The "Name" input should exist')
        .expect(approvalsPage.periodDatepicker.exists).ok('The "Period" datepicker should exist')
        .expect(approvalsPage.submittedDatepicker.exists).ok('The "Submitted" datepicker should exist')
        .expect(approvalsPage.minInput.exists).ok('The "Min" input should exist')
        .expect(approvalsPage.maxInput.exists).ok('The "Max" input should exist')
        .expect(approvalsPage.complianceDropdown.exists).ok('The "Compliance" dropdown should exist')
        .expect(approvalsPage.statusDropdown.exists).ok('The "Status" dropdown should exist')
        .expect(await checkLabels(approvalsPage.allTable.headers,approvalHeaders)).ok()
        .click(approvalsPage.complianceDropdown)
        .expect(await checkLabels(approvalsPage.complianceDropdownOptions,complianceMenu,'compliance_name')).ok()
        .click(approvalsPage.statusDropdown)
        .expect(await checkLabels(approvalsPage.statusDropdownOptions,statusMenu,'status_name')).ok()
    //6. Repeat step 5 for all tabs
        .expect(approvalsPage.pendingTab.exists).ok('The "Pending" tab should exist')
        .click(approvalsPage.pendingTab)
        .expect(approvalsPage.pendingTable.exists).ok('The grid table should exist. Perhaps it was empty')
        .expect(approvalsPage.nameInput.exists).ok('The "Name" input should exist')
        .expect(approvalsPage.periodDatepicker.exists).ok('The "Period" datepicker should exist')
        .expect(approvalsPage.submittedDatepicker.exists).ok('The "Submitted" datepicker should exist')
        .expect(approvalsPage.minInput.exists).ok('The "Min" input should exist')
        .expect(approvalsPage.maxInput.exists).ok('The "Max" input should exist')
        .expect(approvalsPage.complianceDropdown.exists).ok('The "Compliance" dropdown should exist')
        .expect(approvalsPage.statusDropdown.exists).ok('The "Status" dropdown should exist')
        .expect(approvalsPage.pendingResetButton.exists).ok('The "Reset" button for the "Pending" tab table should exist')
        .expect(await checkLabels(approvalsPage.pendingTable.headers,approvalHeaders)).ok()
        .click(approvalsPage.complianceDropdown)
        .expect(await checkLabels(approvalsPage.complianceDropdownOptions,complianceMenu,'compliance_name')).ok()
        .click(approvalsPage.statusDropdown)
        .expect(await checkLabels(approvalsPage.statusDropdownOptions,statusMenu,'status_name')).ok()
        .expect(approvalsPage.rejectedTab.exists).ok('The "Rejected" tab should exist')
        .click(approvalsPage.rejectedTab)
        .expect(approvalsPage.rejectedTable.exists).ok('The grid table should exist. Perhaps it was empty')
        .expect(approvalsPage.nameInput.exists).ok('The "Name" input should exist')
        .expect(approvalsPage.periodDatepicker.exists).ok('The "Period" datepicker should exist')
        .expect(approvalsPage.submittedDatepicker.exists).ok('The "Submitted" datepicker should exist')
        .expect(approvalsPage.minInput.exists).ok('The "Min" input should exist')
        .expect(approvalsPage.maxInput.exists).ok('The "Max" input should exist')
        .expect(approvalsPage.complianceDropdown.exists).ok('The "Compliance" dropdown should exist')
        .expect(approvalsPage.statusDropdown.exists).ok('The "Status" dropdown should exist')
        .expect(approvalsPage.rejectedResetButton.exists).ok('The "Reset" button for the "Rejected" tab table should exist')
        .expect(await checkLabels(approvalsPage.rejectedTable.headers,approvalHeaders)).ok()
        .click(approvalsPage.complianceDropdown)
        .expect(await checkLabels(approvalsPage.complianceDropdownOptions,complianceMenu,'compliance_name')).ok()
        .click(approvalsPage.statusDropdown)
        .expect(await checkLabels(approvalsPage.statusDropdownOptions,statusMenu,'status_name')).ok()
        .expect(approvalsPage.approvedTab.exists).ok('The "Approved" tab should exist')
        .click(approvalsPage.approvedTab)
        .expect(approvalsPage.approvedTable.exists).ok('The grid table should exist. Perhaps it was empty')
        .expect(approvalsPage.nameInput.exists).ok('The "Name" input should exist')
        .expect(approvalsPage.periodDatepicker.exists).ok('The "Period" datepicker should exist')
        .expect(approvalsPage.submittedDatepicker.exists).ok('The "Submitted" datepicker should exist')
        .expect(approvalsPage.minInput.exists).ok('The "Min" input should exist')
        .expect(approvalsPage.maxInput.exists).ok('The "Max" input should exist')
        .expect(approvalsPage.complianceDropdown.exists).ok('The "Compliance" dropdown should exist')
        .expect(approvalsPage.statusDropdown.exists).ok('The "Status" dropdown should exist')
        .expect(approvalsPage.approvedResetButton.exists).ok('The "Reset" button for the "Approved" tab table should exist')
        .expect(await checkLabels(approvalsPage.approvedTable.headers,approvalHeaders)).ok()
        .click(approvalsPage.complianceDropdown)
        .expect(await checkLabels(approvalsPage.complianceDropdownOptions,complianceMenu,'compliance_name')).ok()
        .click(approvalsPage.statusDropdown)
        .expect(await checkLabels(approvalsPage.statusDropdownOptions,statusMenu,'status_name')).ok()
        .expect(approvalsPage.paidTab.exists).ok('The "Paid" tab should exist')
        .click(approvalsPage.paidTab)
        .expect(approvalsPage.paidTable.exists).ok('The grid table should exist. Perhaps it was empty')
        .expect(approvalsPage.nameInput.exists).ok('The "Name" input should exist')
        .expect(approvalsPage.periodDatepicker.exists).ok('The "Period" datepicker should exist')
        .expect(approvalsPage.submittedDatepicker.exists).ok('The "Submitted" datepicker should exist')
        .expect(approvalsPage.minInput.exists).ok('The "Min" input should exist')
        .expect(approvalsPage.maxInput.exists).ok('The "Max" input should exist')
        .expect(approvalsPage.complianceDropdown.exists).ok('The "Compliance" dropdown should exist')
        .expect(approvalsPage.statusDropdown.exists).ok('The "Status" dropdown should exist')
        .expect(approvalsPage.paidResetButton.exists).ok('The "Reset" button for the "Paid" tab table should exist')
        .expect(await checkLabels(approvalsPage.paidTable.headers,approvalHeaders)).ok()
        .click(approvalsPage.complianceDropdown)
        .expect(await checkLabels(approvalsPage.complianceDropdownOptions,complianceMenu,'compliance_name')).ok()
        .click(approvalsPage.statusDropdown)
        .expect(await checkLabels(approvalsPage.statusDropdownOptions,statusMenu,'status_name')).ok();
});

test('TC 24879: \'Projects Codes\' Page', async t => {
    let projectCodesPage = new ProjectCodesPage();
    let projectModal = new ProjectModal();
    let projectCodesMenu = getMenu(t.fixtureCtx.costAllocationMenu.submenu,3010103);
    let labels = t.fixtureCtx.labels;
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Cost Allocation 
        .click(byID(t.fixtureCtx.costAllocationMenu.action_key))
    //5. Click on Project Codes
        .click(byID(projectCodesMenu.action_key))
    //6. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-prjcod-000']),'The "Page Title" was wrong', timeout)
    //7. Check Page Elements
        .expect(projectCodesPage.projectNameInput.exists).ok('The "Project Name" input should exist')
        .expect(projectCodesPage.projectCodeInput.exists).ok('The "Project Code" input should exist')
        .expect(projectCodesPage.addNewButton.exists).ok('The "Add New" button should exist')
        .expect(projectCodesPage.datePicker.exists).ok('The "Date Picker" should exist')
        .expect(projectCodesPage.table.exists).ok('The table grid should exist')
        .expect(projectCodesPage.saveButton.exists).ok('The Save button should exist')
        .expect(projectCodesPage.cancelButton.exists).ok('The Cancel button should exist')
        .expect(projectCodesPage.labels.withText(labels['ui-prjcod-014']).exists).ok('The "Show Project Code" label button should exist')
        .expect(projectCodesPage.labels.withText(labels['ui-prjcod-010']).exists).ok('The "Project Code" label button should exist')
        .expect(projectCodesPage.labels.withText(labels['ui-prjcod-002']).exists).ok('The "Project Name" label button should exist')
        .expect(projectCodesPage.labels.withText(labels['ui-prjcod-005']).exists).ok('The "Effective Date" label button should exist')
        
        .wait(1000);
    //8. If the Projects code table is not empty, click on the first "Edit" button from the table grid
    if (await projectCodesPage.firstEditButton.exists)
    {
        await t
            .click(projectCodesPage.firstEditButton)
        //9. Check the modal elements
            .expect(projectModal.projectNameInput.exists).ok('The "Project Name" input should exist')
            .expect(projectModal.projectCodeInput.exists).ok('The "Project Code" input should exist')
            .expect(projectModal.datePicker.exists).ok('The datepicker should exist')
            .expect(projectModal.saveButton.exists).ok('The "Save" button should exist')
            .expect(projectModal.closeButton.exists).ok('The "Close" button should exist')
            .expect(projectModal.labels.withText(labels['ui-prjcod-010']).exists).ok('The "Project Code" label button should exist')
            .expect(projectModal.labels.withText(labels['ui-prjcod-002']).exists).ok('The "Project Name" label button should exist')
           // .expect(projectModal.labels.withText(labels['ui-prjcod-005']).exists).ok('The "Effective Date" label button should exist')
        //10. Click "Close
            .click(projectModal.closeButton);
    }
});

test('TC 24882: \'Distance Rate Setup\' Page', async t => {
    let distanceRateSetupMenu = getMenu(t.fixtureCtx.settingsMenu.submenu,30104);
    let labels = t.fixtureCtx.labels;
    let distanceRateSetupPage = new DistanceRateSetupPage();
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on the Settings submenu
        .click(byID(t.fixtureCtx.settingsMenu.action_key))
    //4. Click on Distance Rate Setup
        .click(byID(distanceRateSetupMenu.action_key))
    //5. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-dist-000']),'The "Page Title" was wrong', timeout)
    //6. Check Page Elements
        .expect(distanceRateSetupPage.unitDropdown.exists).ok('The "Mile" dropdown should exist')
        .expect(distanceRateSetupPage.rateInput.exists).ok('The "Rate" input should exist')
        .expect(distanceRateSetupPage.currencyDropdown.exists).ok('The "Currency" dropdown should exist')
        .expect(distanceRateSetupPage.perInput.exists).ok('The "Per" input should exist')
        .expect(distanceRateSetupPage.datePicker.exists).ok('The "Date picker" should exist')
        .expect(distanceRateSetupPage.addNewButton.exists).ok('The "Add New" button should exist')
        .expect(distanceRateSetupPage.actionsDropdown.exists).ok('The "Actions" dropdown should exist')
        .expect(distanceRateSetupPage.table.exists).ok('The grid table should exist. Perhaps it was empty');
});

test('TC 24883: \'Currency Setup\' Page', async t => {
    let currencies = await apiHandler.getCurrencies();
    let currencySetupPage = new CurrencySetupPage();
    let currencySetup = getMenu(t.fixtureCtx.settingsMenu.submenu,30105);
    let labels = t.fixtureCtx.labels;
    
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on the Settings submenu
        .click(byID(t.fixtureCtx.settingsMenu.action_key))
    //5. Click on Currency Setup
        .click(byID(currencySetup.action_key))
    //6. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-ccy-000']),'The "Page Title" was wrong', timeout)
    //7. Check Page Elements
        .expect(currencySetupPage.baseCurrencyDropdown.exists).ok('The "Base Currency" dropdown should exist')
        .expect(currencySetupPage.table.exists).ok('The table grid should exist. Perhaps it was empty')
        .expect(currencySetupPage.conversionFor.exists).ok('The "Conversion For" title should exist')
        .expect(currencySetupPage.selectedCurrency.exists).ok('The "Selected currency" span should exist')
        .expect(currencySetupPage.saveButton.exists).ok('The "Save" button should exist');
    //8. Check Currencies
    await t
        .expect(await checkLabels(currencySetupPage.tableCells,currencies,'currency_code')).ok();
    //9. Change Choose Base Currency
    await t
        .click(currencySetupPage.baseCurrencyDropdown)
        .click(currencySetupPage.baseCurrencyDropdownOptions.nth(1));
    await t
        .expect(currencySetupPage.selectedCurrency.withText('EUR').exists).ok('The "CONVERSION FOR" was wrong');
});

test('TC 24884: \'Manage Users\' Page', async t => {
    let manageUsersPage = new ManageUsersPage();
    let manageUsersSubmenu = getMenu(t.fixtureCtx.manageUsersMenu.submenu,3010603);
    let labels = t.fixtureCtx.labels;
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Manage Users
        .click(byID(t.fixtureCtx.manageUsersMenu.action_key))
    //5. Click on Manage Users
        .click(byID(manageUsersSubmenu.action_key))
    //6. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-usrm-000']),'The "Page Title" was wrong', timeout)
    //7. Check Page Elements
        .expect(manageUsersPage.addUserButton.exists).ok('The "Add User" button should exist')
        .expect(manageUsersPage.table.exists).ok('The grid table should exist. Perhaps it was empty')
        .expect(manageUsersPage.firstNameInput.exists).ok('The "First Name" input should exist')
        .expect(manageUsersPage.lastNameInput.exists).ok('The "Last Name" input should exist')
        .expect(manageUsersPage.emailInput.exists).ok('The "Email" input should exist')
        .expect(manageUsersPage.statusInput.exists).ok('The "Status" input should exist')
        .expect(manageUsersPage.resetButton.exists).ok('The "Reset" button should exist')
        .wait(5000);
    if(manageUsersPage.editUser.exists){
        await t
            .click(manageUsersPage.editUser)
            .expect(manageUsersPage.personalTab.exists).ok('The "Personal Info" tab should exist')
            //TODO: TEM-2474
            //.expect(manageUsersPage.glTab.exists).ok('The "GL Tags" tab should exist')
            //.expect(manageUsersPage.userRoleTab.exists).ok('The "User Role" tab should exist')
            //TODO: TEM-2475
            //.expect(manageUsersPage.notificationTab.exists).ok('The "Notification" tab should exist')
            .expect(manageUsersPage.approvalLimitTab.exists).ok('The "Approval Limit" tab should exist')
            .expect(manageUsersPage.activityTab.exists).ok('The "Activity" tab should exist')
            //Click on GL Tags
        //TODO: TEM-2474 
        /*    
            .click(manageUsersPage.glTab);
        await t
            .expect(manageUsersPage.segmentInput.exists).ok('The "Segment" input should exist')
            .expect(manageUsersPage.segmentValueInput.exists).ok('The "Segment Value" input should exist')
            .expect(manageUsersPage.addTagButton.exists).ok('The "Add Tag" button should exist')  
            .expect(manageUsersPage.segmentTable.exists).ok('The "Segment" table should exist'); 
            //Click on User Role
           // .click(manageUsersPage.userRoleTab);
        await t
          //  .expect(manageUsersPage.roleLeft.exists).ok('The "Role Left" table should exist')
          //  .expect(manageUsersPage.faRight.exists).ok('The "Role Left Add" fa should exist')
           // .expect(manageUsersPage.roleRight.exists).ok('The "Role Right" table should exist')  
           // .expect(manageUsersPage.faLeft.exists).ok('The "Role Right Add" fa should exist') 
           //TODO: TEM-2475
           //Click on Notifications
          //  .click(manageUsersPage.notificationTab);

        */
        await t
           // .expect(manageUsersPage.notificationTable.exists).ok('The "Notification" table should exist')
           // .expect(manageUsersPage.deliveryType.exists).ok('The "Delivery Type" input should exist')
            //Click on Approval Limit 
            .click(manageUsersPage.approvalLimitTab);
        await t
            .expect(manageUsersPage.approvalLimitInput.exists).ok('The "Approval Limit" input should exist')
            .expect(manageUsersPage.approvalLimitUpdateButton.exists).ok('The "Update" button should exist')
            //Click on Activity Tab 
            .click(manageUsersPage.activityTab);
        await t
            .expect(manageUsersPage.activityTable.exists).ok('The "Activity" table should exist',longTimeout);
    }
});

test('TC 24885: \'User Mapping\' Page', async t => {
    let userMappingPage = new UserMappingPage();
    let userMappingMenu = getMenu(t.fixtureCtx.manageUsersMenu.submenu,3010602);
    let labels = t.fixtureCtx.labels;
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Manage Users
        .click(byID(t.fixtureCtx.manageUsersMenu.action_key))
    //5. Click on User mapping
        .click(byID(userMappingMenu.action_key))
    //6. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-usrm-300']),'The "Page Title" was wrong', timeout)
    //7. Check Page Elements
        .expect(userMappingPage.table.exists).ok('The grid table should exist. Perhaps it was empty')
        .expect(userMappingPage.addNewButton.exists).ok('The "Add New" button should exist')
    //8. Click on Add New Button
        .click(userMappingPage.addNewButton)
    //9. Check labels of page
        .expect(userMappingPage.addLables.withText(labels['ui-usrm-201']).exists).ok('The "Mapping Name" label should exist')
        .expect(userMappingPage.addLables.withText(labels['ui-usrm-204']).exists).ok('The "File Type" label should exist')
        .expect(userMappingPage.addLables.withText(labels['ui-usrm-207']).exists).ok('The "Has Headers" label should exist')
    //10. Check elements of page
        .expect(page.title.innerText).match(insensitive(labels['ui-usrm-200']),'The "Page Title" was wrong', timeout)
        .expect(userMappingPage.closeButton.exists).ok('The "Close" button should exist')
        .expect(userMappingPage.mappingName.exists).ok('The "Mapping Name" input should exist')
        .expect(userMappingPage.fileType.exists).ok('The "File Type" dropdown should exist')
        .expect(userMappingPage.headers.exists).ok('The "Headers" check should exist')
        .expect(userMappingPage.updateExample.exists).ok('The "Update Example" button should exist')
        .expect(userMappingPage.mapContainr.exists).ok('The "Map Info" should exist')
        .expect(userMappingPage.textArea.exists).ok('The textarea should exist')
});

test('TC 24889: \'Date Format\' Page', async t => {
    let dateFormatPage = new DateFormatPage();
    let dateFormat = getMenu(t.fixtureCtx.settingsMenu.submenu,30109);
    let labels = t.fixtureCtx.labels;
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click the Settings submenu
        .click(byID(t.fixtureCtx.settingsMenu.action_key))
    //4. Click on Date Format
        .click(byID(dateFormat.action_key))
    //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-date-000']),'The "Page Title" was wrong', timeout)
    //6. Check Page Elements
        .expect(dateFormatPage.formatDropdown.exists).ok('The "Format" dropdown should exist')
        .expect(dateFormatPage.saveButton.exists).ok('The "Save" button should exist')
        .expect(dateFormatPage.closeButton.exists).ok('The "Close" button should exist');      
});

test('TC 24890: \'Policies\' Page', async t => {
    let policiesPage = new PoliciesPage();
    let policiesMenu = getMenu(t.fixtureCtx.complianceSetupMenu.submenu,3011001);
    let labels = t.fixtureCtx.labels;
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Compliance Setup
        .click(byID(t.fixtureCtx.complianceSetupMenu.action_key))
    //5. Click on Policies
        .click(byID(policiesMenu.action_key))
    //6. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-policy-000']),'The "Page Title" was wrong', timeout)
    //7. Check Page Elements
        .expect(policiesPage.policiesListTable.exists).ok('The Policies List table should exist. Perhaps it was empty')
        .click(policiesPage.policiesActivityTab)
        .expect(policiesPage.policiesActivityTable.exists).ok('The Policies Activity table should exist. Perhaps it was empty')
        .click(policiesPage.policiesListTab)
        .expect(policiesPage.addNewPolicyButton.exists).ok('The Add new button should exist')
    //8. Click Add New Policy 
        .click(policiesPage.addNewPolicyButton)
    //9. Check Page Elements
        .expect(policiesPage.policyNameInput.exists).ok('The "Policy Name" input should exist')
        .expect(policiesPage.saveButton.exists).ok('The "Save" button should exist')
        .expect(policiesPage.cancelButton.exists).ok('The "Cancel" button should exist')
        .expect(policiesPage.approvedRadio.exists).ok('The "Approved Radio" should exist')
        .expect(policiesPage.submittedRadio.exists).ok('The "Submitted Radio" should exist');
});

test('TC 24891: \'Rules\' Page', async t => {
    let rulesPage = new RulesPage();
    let newRulePage = new NewRulePage();
    let confirmModal = new ConfirmModal();
    let requiredField = t.fixtureCtx.labels['msg-00-002'];
    let rulesMenu = getMenu(t.fixtureCtx.complianceSetupMenu.submenu,3011002);
    let labels = t.fixtureCtx.labels;
    let rulesLibrary = await apiHandler.getRuleLibrary();
    let rulesActivity = await apiHandler.getRuleActivity();
    let rulelistHeaders = [ labels['ui-apv-006'],
                            labels['ui-apv-007'],
                            labels['ui-apv-008'],
                            labels['ui-apv-009'],
                            labels['ui-apv-010'],
                            labels['ui-apv-011'] ];
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Compliance Setup
        .click(byID(t.fixtureCtx.complianceSetupMenu.action_key))
    //5. Click on Rules
        .click(byID(rulesMenu.action_key))
    //6. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-rule-000']),'The "Page Title" was wrong', timeout)
    //7. Check Page Elements
    if(rulesLibrary.total > 0)
        await t.expect(rulesPage.rulesListTable.exists).ok('The Rules list table should exist. Perhaps it was empty')
    
    await t.click(rulesPage.rulesActivityTab);
    
    if(rulesActivity.total > 0)
        await t.expect(rulesPage.rulesActivityTable.exists).ok('The Rules activity table should exist. Perhaps it was empty');
    
    await t    
        .click(rulesPage.rulesListTab)
        .expect(rulesPage.addNewRuleButton.exists).ok('Add New Rule button should exist')
    //8. Click Add New Rule
        .click(rulesPage.addNewRuleButton)
    //9. Check Page Elements
        .expect(newRulePage.ruleNameInput.exists).ok('The "Rule name" input should exist')
        .expect(newRulePage.ruleMessageTextarea.exists).ok('The "Message" text area should exist')
        .expect(newRulePage.severityTypeDropdown.exists).ok('The "Severity Type" dropdown should exist')
        .expect(newRulePage.typeDropdown.exists).ok('The "Type" dropdown should exist')
        .expect(newRulePage.aggregationDropdown.exists).ok('The "Aggregation" dropdown should exist')
        .expect(newRulePage.saveButton.exists).ok('The "Save" button should exist')
        .expect(newRulePage.cancelButton.exists).ok('The "Cancel" button should exist')
    //10. Click Cancel and click Save on the confirmation popup
        .click(newRulePage.cancelButton)
        .click(confirmModal.acceptButton)
    //11. Check required fields messages
        .expect(newRulePage.ruleNameInput.error.innerText).contains(requiredField,'The Name input should display "Required field"')
        .expect(newRulePage.ruleMessageTextarea.error.innerText).contains(requiredField,'The Message text area should display "Required field"');
});

//TODO: TEM-2475
test.skip('TC 24893: \'Email Templates\' Page', async t => {
    let emailTemplatesPage = new EmailTemplatesPage();
    let emailTemplatesMenu = getMenu(t.fixtureCtx.notificationMenu.submenu,30111);
    let labels = t.fixtureCtx.labels;
    let emailsTemmplate = await apiHandler.getEmailsTemplate();
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on the Notification submenu
        .click(byID(t.fixtureCtx.notificationMenu.action_key))
    //5. Click on Email Templates
        .click(byID(emailTemplatesMenu.action_key))
    //6. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-email-000']),'The "Page Title" was wrong', timeout)
    //7. Check Page Elements
        .expect(emailTemplatesPage.addNewButton.exists).ok('The "Add New" button should exist');
    if(emailsTemmplate > 0){
        await t
            .expect(emailTemplatesPage.table.exists).ok('The table grid should exist. Perhaps it was empty')
            .expect(emailTemplatesPage.filterTemplateName.exists).ok('The "Template Name" input filter should exist')
            .expect(emailTemplatesPage.filterTemplateSubjet.exists).ok('The "Template Subjet" input filter should exist')
            .expect(emailTemplatesPage.filterReset.exists).ok('The "Reset" button filter should exist');
            let filtersIds = [
                'email_template_name',
                'subject'
            ];
            await t.expect(await emailTemplatesPage.table.checkFilters(filtersIds)).ok('Table filters were not correctly displayed');
    }    
        

    
    await t
    //8. Click on the "Add New" button
        .click(emailTemplatesPage.addNewButton)
    //9. Check Page Elements
        .expect(emailTemplatesPage.templateNameInput.exists).ok('The "Template Name" input should exist')
        .expect(emailTemplatesPage.emailSenderDropdown.exists).ok('The "Email Sender" dropdown should exist')
        .click(emailTemplatesPage.emailSenderDropdown)
        .wait(500)
        .expect(emailTemplatesPage.emailSenderDropdownOptions.exists).ok('The "Email Sender" dropdown options should exist')
        .click(emailTemplatesPage.emailSenderDropdown)
        .expect(emailTemplatesPage.subjectInput.exists).ok('The "Subject" input should exist')
        .expect(emailTemplatesPage.editor.exists).ok('The "Editor" should exist')
        .expect(emailTemplatesPage.editorTextArea.exists).ok('The "Editor" text area should exist')
        .click(emailTemplatesPage.editorTextArea)
        .expect(emailTemplatesPage.businessObjectsDropdown.exists).ok('The "Business Object" dropdown should exist')
        .click(emailTemplatesPage.businessObjectsDropdown)
        .expect(emailTemplatesPage.businessObjectsDropdownOptions.exists).ok('The "Business Object" dropdown options should exist')
        .click(emailTemplatesPage.businessObjectsDropdown)
        .expect(emailTemplatesPage.cancelButton.exists).ok('The "Cancel" button should exist')
        .expect(emailTemplatesPage.saveButton.exists).ok('The "Save" button should exist')
        .click(emailTemplatesPage.cancelButton);
});

test('TC 24877: \'Expense Category\' Page', async t => {
    let expenseCategoryPage = new ExpenseCategoryPage();
    let expenseCategory = getMenu(t.fixtureCtx.settingsMenu.submenu,3010101);
    let labels = t.fixtureCtx.labels;
    let allExpeseCategory = await apiHandler.getAllExpenseCategories();
    let headers = [
        labels['ui-expcat-007'], //Expense Category
        labels['ui-expcat-008'], //Effective Date
        labels['ui-expcat-009']  //Active
    ]
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on the Settings submenu
        .click(byID(t.fixtureCtx.settingsMenu.action_key))
    //5. Click on Expense Category
		.click(visible(byID(expenseCategory.action_key)))
    //6. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-expcat-000']),'The "Page Title" was wrong', timeout);
    await t
    //7. Check the Page Elements
        .expect(expenseCategoryPage.categoryNameInput.exists).ok('The "Category Name" input should exist')
        .expect(expenseCategoryPage.slider.exists).ok('The "Slider" should exist')
        .expect(expenseCategoryPage.categoryDropdown.exists).ok('The "Category" dropdown should exist')
        .expect(expenseCategoryPage.addNewButton.exists).ok('The "Add New" button should exist')
        .expect(expenseCategoryPage.actionsDropdown.exists).ok('The "Actions" dropdown should exist')
        .expect(expenseCategoryPage.closeButton.exists).ok('The "Close" button should exist')
        .expect(expenseCategoryPage.datePicker.exists).ok('The "Date picker" should exist')
        .expect(expenseCategoryPage.labels.withText(labels['ui-expcat-001']).exists).ok('The "Category Name" label should exist')
        .expect(expenseCategoryPage.labels.withText(labels['ui-expcat-013']).exists).ok('The "Icon" label should exist')
        .expect(expenseCategoryPage.labels.withText(labels['ui-expcat-008']).exists).ok('The "Effective Date" label should exist');
    if(allExpeseCategory.total > 0){
        await t.expect(expenseCategoryPage.table.exists).ok('The table grid should exist. Parhaps it was empty');
        await t.expect(await checkLabels(expenseCategoryPage.table.headers,headers)).ok('Table headers are not correct');
    }

});


test.skip('TC 24878: \'GL Allocation\' Page', async t => {
    let glMappingPage = new GLMappingPage();
    let glMappingMenu = getMenu(t.fixtureCtx.costAllocationMenu.submenu,3010102);

    let labels = t.fixtureCtx.labels;
    let headers = [
        labels['ui-glmap-004'], //Expense Category
        labels['ui-glmap-010'], //Effective Date
        labels['ui-glmap-016']  //Active
    ]
    let lookups = await apiHandler.getGLAllocationLookups();
    let segments = await apiHandler.getGLAllocationSegments();
    
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
    await t
        .click(byID(t.fixtureCtx.configurationMenu.action_key))

    //4. Click on Cost Allocation
        .click(byID(t.fixtureCtx.costAllocationMenu.action_key))

    //5. Click on GL Mapping
        .click(byID(glMappingMenu.action_key))

    //6. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-glmap-000']),'The "Page Title" was wrong', timeout)

    //7. Check the Page Elements
        .expect(glMappingPage.label.withText(labels['ui-glmap-006']).exists).ok('The "Category Name" label should exist')
        .expect(glMappingPage.categoryDropdown.exists).ok('The "Category Name" dropdown should exist')
        .expect(glMappingPage.tableAll.exists).ok('The table grid should exist. Perhaps it was empty')
        .expect(glMappingPage.addNewButton.exists).ok('The "Add" button should exist')
        .expect(glMappingPage.addNewButton.innerText).match(insensitive(labels['ui-usr-036']),'The "Add" button was wrong', timeout)
        .expect(glMappingPage.importButton.exists).ok('The "Import" button should exist')
        .expect(glMappingPage.importButton.innerText).match(insensitive(labels['ui-glmap-018']),'The "Import" button was wrong', timeout);
        
    //8. Check Lookups and Segments fields
    let element;
    let fieldCss = 'div.dropdown-arrow'; //Dropdown input.

    //Lookups.
    for(let i=0; i<lookups.length; i++){
        element = lookups[i];
        await t
            .expect(glMappingPage.fieldLabel.withText(element.segment_lookup_name).exists).ok(`${element.segment_lookup_name} field label was not found`)
            .expect(glMappingPage.fieldLabel.withText(element.segment_lookup_name).sibling(0).find(fieldCss).exists).ok(`${element.segment_lookup_name} field input was not found`);
    }
    //Segments.
    for(let i=0; i<segments.length; i++){
        element = segments[i];
        fieldCss = 'input'; //Text or typeahead input.
        if(element.input_type == 1)
            fieldCss = 'div.dropdown-arrow'; //Dropdown input.
            

        await t
            .expect(glMappingPage.fieldLabel.withText(element.segment_name).exists).ok(`${element.segment_name} field label was not found`)
            .expect(glMappingPage.fieldLabel.withText(element.segment_name).parent(0).find(fieldCss).exists).ok(`${element.segment_name} field input was not found`);
    }
    
    //9. Check Tab All
    await t
        .expect(glMappingPage.tabAll.exists).ok('The All Tab must be exists')
        .expect(await checkLabels(glMappingPage.tableAll.headers,headers)).ok('Table headers are not correct')
        .expect(glMappingPage.categoryNameFilter.exists).ok('Category Name filter must be exists')
        .expect(glMappingPage.dateFilter.exists).ok('Date filter must be exists')
        .expect(glMappingPage.resetButtonFilter.exists).ok('The Reset button must be exists')
        .typeText(glMappingPage.categoryNameFilter,'air fare')
        .pressKey('enter')
        .click(glMappingPage.resetButtonFilter)
        .expect(await glMappingPage.categoryNameFilter.value == '').ok('The input must be empty');
        
    await t
    //10. Check Tab Active
        .expect(glMappingPage.tabActive.exists).ok('The Active Tab must be exists')
        .click(glMappingPage.tabActive)
        .expect(glMappingPage.tableActive.exists).ok('The active table should exist')
        .expect(await checkLabels(glMappingPage.tableActive.headers,headers)).ok('Table headers are not correct')
        .expect(glMappingPage.categoryNameActiveFilter.exists).ok('Category Name filter active must be exists')
        .expect(glMappingPage.dateFilterActive.exists).ok('Date filter active must be exists')
        .typeText(glMappingPage.categoryNameActiveFilter,'air fare')
        .pressKey('enter')
        .click(glMappingPage.resetButtonActiveFilter)
        .expect(await glMappingPage.categoryNameActiveFilter.value == '').ok('The input must be empty');
        
    //11. Check Tab Inactive
    await t
        .expect(glMappingPage.tabInactive.exists).ok('The inactive Tab must be exists')
        .click(glMappingPage.tabInactive)
        .expect(glMappingPage.tableInactive.exists).ok('The inactive table should exist')
        .expect(await checkLabels(glMappingPage.tableInactive.headers,headers)).ok('Table headers are not correct')
        .expect(glMappingPage.categoryNameInactiveFilter.exists).ok('Category Name filter inactive must be exists')
        .expect(glMappingPage.dateFilterInactive.exists).ok('Date filter active must be exists')
        .typeText(glMappingPage.categoryNameInactiveFilter,'air fare')
        .pressKey('enter')
        .click(glMappingPage.resetButtonInactiveFilter)
        .expect(await glMappingPage.categoryNameInactiveFilter.value == '').ok('The input must be empty')
});


test('TC 24881: \'Branding Module\' Page', async t => {
    let brandingModulePage = new BrandingModulePage();
    let customBrandingModal = new CustomBrandingModal();
    let labels = t.fixtureCtx.labels;
    let brandingModuleMenu = getMenu(t.fixtureCtx.settingsMenu.submenu,30103);

    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on the Settings submenu
        .click(byID(t.fixtureCtx.settingsMenu.action_key))
    //4. Click on "Branding Module"
        .click(byID(brandingModuleMenu.action_key))
    //5. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-brand-000']),'The "Page Title" was wrong', timeout)
    //6. Check the Page Elements
        .expect(brandingModulePage.uploadInput.exists).ok('The "Upload" input should exist')
        .expect(brandingModulePage.deleteLogoButton.exists).ok('The "Delete Logo" button should exist')
        .expect(brandingModulePage.copyrightInput.exists).ok('The "Copyright" input should exist')
        .expect(brandingModulePage.paletteCheckboxes.exists).ok('The "Palette" checkboxes should exist')
        .expect(brandingModulePage.applyButton.exists).ok('The "Apply" button should exist')
        .expect(brandingModulePage.addCustomButton.exists).ok('The "Add Custom" button should exist');
    let customPalette = await apiHandler.getBranding();
    if (customPalette['palettes'].length < 4)
    {
        await t
            .click(brandingModulePage.addCustomButton)
            .wait(3000)
            .expect(customBrandingModal.paletteNameInput.exists).ok('The "Palette Name" input should exist')
            .expect(customBrandingModal.primaryInput.exists).ok('The "Primary" input should exist')
            .expect(customBrandingModal.secondaryInput.exists).ok('The "Secondary" input should exist')
            .expect(customBrandingModal.accentInput.exists).ok('The "Accent" input should exist')
            .expect(customBrandingModal.saveButton.exists).ok('The "Save" button should exist')
            .expect(customBrandingModal.cancelButton.exists).ok('The "Cancel" button should exist')
            .wait(3000)
            .click(customBrandingModal.cancelButton);
    }
    await t
        //7. Click on checkbox of palette
        .typeText(brandingModulePage.copyrightInput,'Default Palette')
        .click(brandingModulePage.paletteCheckboxes.nth(1));
});

test('TC 24888: \'Manage Groups\' Page', async t => {
    let groupsPage = new GroupsPage();
    let addEditGroupsModal = new AddEditGroupsModal();
    let labels = t.fixtureCtx.labels;
    let manageGroupsMenu = getMenu(t.fixtureCtx.groupsMenu.submenu,30107);
    let groupTypes =  (await apiHandler.getGroupTypes()).items;
    let approvalGroupType = groupTypes.find(element => element.type_id === 1).type_name;
    let policyGroupType = groupTypes.find(element => element.type_id === 2).type_name;

    let manageGroupsTabs = [
        labels['ui-group-016'], //Add/Edit Groups
        labels['ui-group-055'], //Assign Policy to Group
        labels['ui-group-056'], //Assign User to Group
        labels['ui-group-047'], //Assign Approval limit

    ]

    let groupsTableHeaders = [	
        labels['ui-group-014'], //Group
        labels['ui-group-037'], //Group ID
        labels['ui-group-038'], //Parent Group ID
        labels['ui-group-039']  //Parent group name
    ];

    let assignApprovalHeaders = [	
        labels['ui-group-037'], //Group ID
        labels['ui-group-019'], //Group name
        labels['ui-group-048'], //Approval Limit
        labels['ui-group-049']  //User Overrides
    ];

    let groupsApproval = await apiHandler.getGroupsByType(1);
    let groupsPolicy = await apiHandler.getGroupsByType(2);

    let groupsReportApprobal = await apiHandler.getGroupsReportByType(1);
    let groupsReportPolicy = await apiHandler.getGroupsReportByType(2);
    await t
    //2. Go to Corcentric Expense
    
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    
    //4. Click on Groups -> Manage Groups
        .click(byID(t.fixtureCtx.groupsMenu.action_key))
        .click(byID(manageGroupsMenu.action_key))
    
    //5. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-group-000']),'The "Page Title" was wrong', timeout);
    
    //6. Check Page Elements
        //Tabs.
    await t
        .expect(await checkLabels(groupsPage.tabs,manageGroupsTabs)).ok('Manage Groups tabs were not displayed correctly')
        .expect(groupsPage.labelLegend.withText(labels['ui-group-034']).exists).ok('"Group type" label is not present')
        .expect(groupsPage.groupTypeDropdown.exists).ok('Group type dropdown is not present')
        .expect(groupsPage.labelLegend.withText(labels['ui-group-035']).exists).ok('"Group type ID" label is not present')
        .expect(groupsPage.button.withText(labels['ui-group-036']).exists).ok('New button is not present')

    //7. Click the "New" button
        .click(groupsPage.button.withText(labels['ui-group-036']))

    //8. Check Modal Title
        .expect(addEditGroupsModal.title.innerText).match(insensitive(labels['ui-group-016']))
    //9. Check Modal Elements
        .expect(addEditGroupsModal.labelLegend.withText(labels['ui-group-045']).exists).ok('"Select group type" label is not present')
        .expect(groupsPage.groupTypeDropdown.exists).ok('Group type dropdown is not present')
        .expect(addEditGroupsModal.labelLegend.withText(labels['ui-group-035']).exists).ok('"Group type ID" label is not present')
        .expect(addEditGroupsModal.labelLegend.withText(labels['ui-group-019']).exists).ok('"Group Name" label is not present')
        .expect(addEditGroupsModal.labelLegend.withText(labels['ui-group-039']).exists).ok('"Parent group name" label is not present')
        .expect(addEditGroupsModal.labelLegend.withText(labels['ui-group-038']).exists).ok('"Parent group ID" label is not present')
        .expect(addEditGroupsModal.button.withText(labels['ui-group-002']).exists).ok('Save button is not present')
        .expect(addEditGroupsModal.button.withText(labels['ui-group-001']).exists).ok('Cancel button is not present')

    //10. Select "Approval" and "Policy" group types
        //Approval
        .click(addEditGroupsModal.groupTypeDropdown)
        .click(addEditGroupsModal.dropdownOptions.withText(approvalGroupType))
        .expect(addEditGroupsModal.groupTypeID.innerText).match(insensitive('1'))
        .expect(addEditGroupsModal.groupNameInput.exists).ok('Group Name input is not present')
        .expect(addEditGroupsModal.groupsTable.exists).ok('Groups table is not present')
        //.expect(addEditGroupsModal.groupID.exists).ok('Group ID value is not present')
        .expect(addEditGroupsModal.parentGroupDropdown.exists).ok('Parent group name dropdown is not present')
        //Policy
        .click(addEditGroupsModal.groupTypeDropdown)
        .click(addEditGroupsModal.dropdownOptions.withText(policyGroupType))
        .expect(addEditGroupsModal.groupTypeID.innerText).match(insensitive('2'))
        .expect(addEditGroupsModal.groupNameInput.exists).ok('Group Name input is not present')
        .expect(addEditGroupsModal.groupsTable.exists).ok('Groups table is not present')
        //.expect(addEditGroupsModal.groupID.exists).ok('Group ID value is not present')
        .expect(addEditGroupsModal.parentGroupDropdown.exists).ok('Parent group name dropdown is not present')
    
    //11. Click "Cancel"
        .click(addEditGroupsModal.button.withText(labels['ui-group-001']))

	//12. Select "Approval" and "Policy" group types
		//Approval
        .click(groupsPage.groupTypeDropdown)
        .click(groupsPage.dropdownOptions.withText(approvalGroupType))
        .expect(groupsPage.groupID.innerText).match(insensitive('1'))
        .expect(groupsPage.groupsTable.exists).ok('Group table is not present');
    
    if(groupsApproval.total > 0)
        await t.expect(await checkLabels(groupsPage.groupsTable.headers,groupsTableHeaders)).ok('Group table headers are not correct');
    await t
        //Policy
        .click(groupsPage.groupTypeDropdown)
        .click(groupsPage.dropdownOptions.withText(policyGroupType))
        .expect(groupsPage.groupID.innerText).match(insensitive('2'))       
        .expect(groupsPage.groupsTable.exists).ok('Group table is not present');
    
    if(groupsPolicy.total > 0)
        await t.expect(await checkLabels(groupsPage.groupsTable.headers,groupsTableHeaders)).ok('Group table headers are not correct');
    
    await t
    //13. Click the "Assign Policy to Group" tab
        .click(groupsPage.assignPolicyToGroupTab)
    
    //14. Check Page Elements
        .expect(groupsPage.labelLegend.withText(labels['ui-group-034'])).ok('Group type label is not present')
        .expect(groupsPage.assignPolicyGroupTypeDropdown.exists).ok('Group type dropdown is not present')
        .expect(groupsPage.labelLegend.withText(labels['ui-group-000'])).ok('Groups label is not present')
        .expect(groupsPage.assignPolicyGroupsDropdown.exists).ok('Groups dropdown is not present')
        .click(groupsPage.assignPolicyGroupTypeDropdown.find('input'))
        .click(groupsPage.dropdownOptions.nth(0));
    if(groupsReportApprobal.length > 0){
        await t
            .click(groupsPage.assignPolicyGroupsDropdown.find('input'))
            .click(groupsPage.dropdownOptions.nth(0))
            .expect(groupsPage.assignPolicySearchInput.exists).ok('Search input is not present')
            .expect(groupsPage.switcherRight.exists).ok('Right table is not present')
            .expect(groupsPage.switcherLeft.exists).ok('Left table is not present')
            .expect(groupsPage.switchActionLabel.withText(labels['ui-cm-011']).exists).ok('Add label is not present')
            .expect(groupsPage.switchActionLabel.withText(labels['ui-cm-012']).exists).ok('Remove label is not present')
            .expect(groupsPage.leftArrow.exists).ok('Left arrow is not present')
            .expect(groupsPage.rightArrow.exists).ok('Right arrow is not present');
    }
    //15. Click the "Assign User to Group" tab
    await t    
        .click(groupsPage.assignUserToGroupTab)
    
    //16. Check Page Elements
        .expect(groupsPage.labelLegend.withText(labels['ui-group-034'])).ok('Group type label is not present')
        .expect(groupsPage.assignUserGroupTypeDropdown.exists).ok('Group type dropdown is not present')
        .expect(groupsPage.labelLegend.withText(labels['ui-group-000'])).ok('Groups label is not present')
        .expect(groupsPage.assignUserGroupsDropdown.exists).ok('Groups dropdown is not present')
        .click(groupsPage.assignUserGroupTypeDropdown.find('input'))
        .click(groupsPage.dropdownOptions.nth(0));
    if(groupsReportPolicy.length > 0){ 
        await t
            .click(groupsPage.assignUserGroupsDropdown.find('input'))
            .click(groupsPage.dropdownOptions.nth(0))
            .expect(groupsPage.assignUserSearchInput.exists).ok('Search input is not present')
            .expect(groupsPage.switcherRight.exists).ok('Right table is not present')
            .expect(groupsPage.switcherLeft.exists).ok('Left table is not present')
            .expect(groupsPage.switchActionLabel.withText(labels['ui-cm-011']).exists).ok('Add label is not present')
            .expect(groupsPage.switchActionLabel.withText(labels['ui-cm-012']).exists).ok('Remove label is not present')
            .expect(groupsPage.leftArrow.exists).ok('Left arrow is not present')
            .expect(groupsPage.rightArrow.exists).ok('Right arrow is not present');
    }

    //17. Click the "Assign Approval Limit" tab
        await t
            .click(groupsPage.assignApprovalLimitTab)
    
    //18. Check Page Elements
        .expect(groupsPage.labelLegend.withText(labels['ui-group-035']).exists).ok('"Group type ID" label is not present')
        .expect(groupsPage.labelLegend.withText(labels['ui-group-034'])).ok('Group Type label is not present')
        .expect(groupsPage.assignGroupTypeDropdown.exists).ok('Group type dropdown is not present')

    //19. Select "Approval" and "Policy" group types 
        //Approval
        .click(groupsPage.assignGroupTypeDropdown.find('input'))
        .click(groupsPage.dropdownOptions.withText(approvalGroupType))
        .expect(groupsPage.groupsTable.exists).ok('Group table is not present');
    await t
        .expect(await checkLabels(groupsPage.approvalLimitTable.headers,assignApprovalHeaders)).ok('Group table headers are not correct')
        /*
        //Policy
        .click(groupsPage.assignGroupTypeDropdown.find('input'))
        .click(groupsPage.dropdownOptions.withText(policyGroupType))
        .expect(groupsPage.groupID.innerText).match(insensitive('2'))        
        .expect(groupsPage.approvalLimitTable.exists).ok('Assign Group table is not present');
        await t
            .expect(await checkLabels(groupsPage.approvalLimitTable.headers,assignApprovalHeaders)).ok('Assign Group table headers are not correct');
        */
        //12. Check first Group row elements 
        let policyApprovalLimit = await apiHandler.getApprovalLimitGroups(1);

        if(policyApprovalLimit.total){
            let firstGroup = policyApprovalLimit.items[0];
            await t
                .expect(groupsPage.approvalLimitTable.rows.nth(1).find('.fa-pencil')).ok('Edit icon was not found in Approval Limits Table')
                .expect(groupsPage.approvalLimitTable.rows.nth(1).find('.fa-trash')).ok('Trash icon was not found in Approval Limits Table')
                .expect(groupsPage.approvalLimitTable.rows.nth(1).innerText).contains(firstGroup.group_id,'Group ID value was not found in Approval Limits Table')
                .expect(groupsPage.approvalLimitTable.rows.nth(1).innerText).contains(firstGroup.group_name,'Group Name value was not found in Approval Limits Table')
                .expect(groupsPage.approvalLimitTable.rows.nth(1).innerText).contains(firstGroup.user_override_count,'User Override value was not found in Approval Limits Table')
                .expect(groupsPage.approvalLimitTable.rows.nth(1).find('.fa-search')).ok('Search icon was not found in Approval Limits Table');
        }
});

test('TC 24892: \'Manage Roles\' Page', async t => {
    let manageRolesPage = new ManageRolesPage();

    let manageRoles = getMenu(t.fixtureCtx.groupsMenu.submenu,30114);
    let manageRolesMenu = byID(manageRoles.action_key);

    let labels = t.fixtureCtx.labels;

    let rolesTableHeaders = [
        labels['ui-manageroles-031'], //Roles
        labels['ui-manageroles-033']  //Default
    ];
    
    let categoriesTableHeaders = [
        labels['ui-manageroles-015'], //Object
        labels['ui-manageroles-016']  //Effective
    ];

    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on the "Groups" menu
        .click(byID(t.fixtureCtx.groupsMenu.action_key))
    //5. Click on "Manage Roles"
        .click(manageRolesMenu)
    //6. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-manageroles-017']),'The "Page Title" was wrong', timeout)
    //7. Check the Page Elements
        //.expect(manageRolesPage.addRoleButton.exists).ok('The "Add role" button should exist')
        .expect(manageRolesPage.rolesTable.exists).ok('The "Roles" table grid should exist. Perhaps it was empty');
	await t
		.expect(await checkLabels(manageRolesPage.rolesTable.headers,rolesTableHeaders)).ok('Roles table headers are not correct')
		.expect(manageRolesPage.groupTypeDropdown.exists).ok('The "Group type" dropdown should exist')
		.expect(manageRolesPage.rolesTab.exists).ok('The "Roles" tab should exist')
		.expect(manageRolesPage.rolesTab.innerText).contains(labels['ui-manageroles-018'], 'Roles tab label is not correct', timeout)
        .expect(manageRolesPage.categoriesTab.exists).ok('The "Categories" tab should exist')
		.expect(manageRolesPage.categoriesTab.innerText).contains(labels['ui-manageroles-019'], 'Categories tab label is not correct', timeout)
        //9. Select "Policy" on "Group Type" dropdown
    	.click(manageRolesPage.groupTypeDropdown)
        .click(manageRolesPage.dropdownOptions.nth(1))		
		//10. Go to "Categories" tab
        .click(manageRolesPage.categoriesTab)
		//11. Check Page Elements
		.expect(manageRolesPage.rolesDropdown.exists).ok('The "Roles" dropdown should exist')
		.expect(manageRolesPage.rolesTab.exists).ok('The "Roles" tab should exist')
		.expect(manageRolesPage.rolesTab.innerText).contains(labels['ui-manageroles-018'], 'Roles tab label is not correct')
        .expect(manageRolesPage.categoriesTab.exists).ok('The "Categories" tab should exist')
		.expect(manageRolesPage.categoriesTab.innerText).contains(labels['ui-manageroles-019'], 'Categories tab label is not correct')
		.expect(manageRolesPage.applyButton.exists).ok('The "Apply" button should exist')
		.expect(manageRolesPage.boxRolesDropdown.exists).ok('The "Roles" box dropdown should exist')
		.expect(manageRolesPage.boxCategoryDropdown.exists).ok('The "Category" box dropdown should exist')
		//12. Click any role from "Roles" dropdown
		.click(manageRolesPage.groupTypeDropdown)
        .click(manageRolesPage.dropdownOptions.nth(0))
        .expect(manageRolesPage.savePermissionsButton.exists).ok('The "Save permissions" button should exist')
		.expect(manageRolesPage.categoriesTable.exists).ok('The "Categories" table grid should exist. Perhaps it was empty');
    await t
		.expect(await checkLabels(manageRolesPage.categoriesTable.headers,categoriesTableHeaders)).ok('Categories table headers are not correct');
});

test('TC 24947: \'Dashboards\' Page', async t => {
    let menues = t.fixtureCtx.menues;
    let dashboardsMenu = byID(getMenu(menues,106).action_key);
    let dashboardButtons = Selector('div.dashboard-btn');
    let labels = t.fixtureCtx.labels;
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Dashboards submenu on the left
        .click(dashboardsMenu)
    //4. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-reporting-000']),'The "Page Title" was wrong', timeout)
    //5. Check the Dashboard buttons
        .expect(dashboardButtons.withText(labels['ui-reporting-002']).exists).ok('The "Departmental Spend By Category" button should exist')
        .expect(dashboardButtons.withText(labels['ui-reporting-002']).find('i').hasClass('fa-line-chart')).ok('The "Departmental Spend By Category" button should have a "line chart" icon')
        .expect(dashboardButtons.withText(labels['ui-reporting-001']).exists).ok('The "Category Spend By Department" button should exist')
        .expect(dashboardButtons.withText(labels['ui-reporting-001']).find('i').hasClass('fa-filter')).ok('The "Category Spend By Department" button should have a "filter" icon')
        .expect(dashboardButtons.withText(labels['ui-reporting-003']).exists).ok('The "Violation By Department" button should exist')
        .expect(dashboardButtons.withText(labels['ui-reporting-003']).find('i').hasClass('fa-area-chart')).ok('The "Violation By Department" button should have an "area chart" icon')
        .expect(dashboardButtons.withText(labels['ui-reporting-004']).exists).ok('The "Manager Cycle Times" button should exist')
        .expect(dashboardButtons.withText(labels['ui-reporting-004']).find('i').hasClass('fa-star')).ok('The "Manager Cycle Times" button should have a "star" icon')
        .expect(dashboardButtons.withText(labels['ui-reporting-005']).exists).ok('The "Employee Cycle Times" button should exist')
        .expect(dashboardButtons.withText(labels['ui-reporting-005']).find('i').hasClass('fa-cog')).ok('The "Employee Cycle Times" button should have a "cog" icon')
        .expect(dashboardButtons.withText(labels['ui-reporting-006']).exists).ok('The "Top 10 Manager Reports By Status" button should exist')
        .expect(dashboardButtons.withText(labels['ui-reporting-006']).find('i').hasClass('fa-trophy')).ok('The "Top 10 Manager Reports By Status" button should have a "trophy" icon');
});

test('TC 24958: \'Top 10 Manager Reports By Status\' Page', async t => {
    let menues = t.fixtureCtx.menues;
    let dashboardsMenu = byID(getMenu(menues,106).action_key);
    let dashboardButtons = Selector('div.dashboard-btn');
    let labels = t.fixtureCtx.labels;
    let topReportsManagersPage = new TopReportsManagersPage();

    await t
    //2. Go to Corcentric Expense
    //3. Click on the Dashboards submenu on the left
        .click(dashboardsMenu)
    //4. Click on the "Top 10 Manager Reports By Status" dashboard button
        .click(dashboardButtons.withText(labels['ui-reporting-006']))
    //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-reporting-006']),'The "Page Title" was wrong', timeout);
        
        let windowHeight = await getWindowInnerHeight();
        let windowWidth = await getWindowInnerWidth();
    //6. Click on the Canvas Element
    await t

        .click(topReportsManagersPage.canvas, { offsetX: parseInt(windowWidth/6.8), offsetY: parseInt(windowHeight/10) })
        .wait(500);
    //7. Check the Page Elements
        //TODO check click on canvas.
        //.expect(topReportsManagersPage.table.exists).ok('After clicking the canvas, the grid table should exist',timeout);
});


test('TC 24960: \'Category Spend By Department\' Page', async t => {
    let categorySpendByDepartmentPage = new CategorySpendByDepartmentPage();
    let menues = t.fixtureCtx.menues;
    let dashboardsMenu = byID(getMenu(menues,106).action_key);
    let dashboardButtons = Selector('div.dashboard-btn');
    let labels = t.fixtureCtx.labels;
    let divisions = await apiHandler.getDivisionItems();

    await t
    //2. Go to Corcentric Expense 
    //3. Click on the "Dashboards" submenu on the left
        .click(dashboardsMenu)
    //4. Click on the "Category Spend by Department" button 
        .click(dashboardButtons.withText(labels['ui-reporting-001']))
    //5. Check the Title 
        .expect(page.title.innerText).match(insensitive(labels['ui-dash-000']),'The "Page Title" was wrong', timeout)
    //6. Check Page Elements
        .expect(categorySpendByDepartmentPage.periodDropdown.exists).ok('The "Period" dropdown should exist')
        .expect(categorySpendByDepartmentPage.startDatePicker.exists).ok('The "Start Date Picker" should exist')
        .expect(categorySpendByDepartmentPage.endDatePicker.exists).ok('The "End Date Picker" should exist')
        .expect(categorySpendByDepartmentPage.updateButton.exists).ok('The "Update" button should exist')
        .expect(categorySpendByDepartmentPage.divisionsDropdown.exists).ok('The "Divisions" dropdown should exist')
        .expect(categorySpendByDepartmentPage.labelsPage.withText(labels['ui-dash-004']).exists).ok('The "Choose Reporting Period" label should exist')
        .expect(categorySpendByDepartmentPage.labelsPage.withText(labels['ui-dash-018']).exists).ok('The "Choose department for Report" label should exist')
        .expect(categorySpendByDepartmentPage.labelsPage.withText(labels['ui-dash-020']).exists).ok('The "Start Date" label should exist')
        .expect(categorySpendByDepartmentPage.labelsPage.withText(labels['ui-dash-021']).exists).ok('The "End Date" label should exist')
        .expect(categorySpendByDepartmentPage.updateButton.hasAttribute('disabled')).ok('The "update" button has should disabled')
        .wait(2000);
    await t
        .expect(await checkLabels(categorySpendByDepartmentPage.departamentDropdown,divisions,'description')).ok();     
    //7. Select category
    await t
        .click(categorySpendByDepartmentPage.divisionsDropdown);

    if(divisions.items.length > 0){
        await t
            .typeText(categorySpendByDepartmentPage.divisionsDropdown,divisions.items[0]['description']) 
            .click(categorySpendByDepartmentPage.categoriesOptions.find('input'))
            .click(categorySpendByDepartmentPage.updateButton); 
    }
    
    if (await infoModal.exists)
    {
        await t.click(infoModal.closeButton);
    };
});

test('TC 24961: \'Department Spend By Category\' Page', async t => {
    let departmentSpendByCategoryPage = new DepartmentSpendByCategoryPage();
    let menues = t.fixtureCtx.menues;
    let dashboardsMenu = byID(getMenu(menues,106).action_key);
    let dashboardButtons = Selector('div.dashboard-btn');
    let labels = t.fixtureCtx.labels;
    let categories = await apiHandler.getCategoryItems();
    
    await t
    //2. Go to Corcentric Expense
    //3. Click on the "Dashboards" submenu on the left
        .click(dashboardsMenu)
    //4. Click on the "Department Spend By Category" button
        .click(dashboardButtons.withText(labels['ui-reporting-002']))
    //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-dash-001']),'The "Page Title" was wrong', timeout)
    //6. Check Page Elements
        .expect(departmentSpendByCategoryPage.periodDropdown.exists).ok('The "Period" dropdown should exist')
        .expect(departmentSpendByCategoryPage.startDatePicker.exists).ok('The "Start Date Picker" should exist')
        .expect(departmentSpendByCategoryPage.endDatePicker.exists).ok('The "End Date Picker" should exist')
        .expect(departmentSpendByCategoryPage.updateButton.exists).ok('The "Update" button should exist')
        .expect(departmentSpendByCategoryPage.categoriesDropdown.exists).ok('The "Categories" dropdown should exist')
        .expect(departmentSpendByCategoryPage.labelsPage.withText(labels['ui-dash-004']).exists).ok('The "Choose Reporting Period" label should exist')
        .expect(departmentSpendByCategoryPage.labelsPage.withText(labels['ui-dash-016']).exists).ok('The "Choose Categories for Report" label should exist')
        .expect(departmentSpendByCategoryPage.labelsPage.withText(labels['ui-dash-020']).exists).ok('The "Start Date" label should exist')
        .expect(departmentSpendByCategoryPage.labelsPage.withText(labels['ui-dash-021']).exists).ok('The "End Date" label should exist')
        .expect(departmentSpendByCategoryPage.updateButton.hasAttribute('disabled')).ok('The "update" button has should disabled')
        .wait(2000);
    await t
        .expect(await checkLabels(departmentSpendByCategoryPage.departamentDropdown,categories,'category_name')).ok();     
    //7. Select category
    await t
        .click(departmentSpendByCategoryPage.categoriesDropdown)
        .typeText(departmentSpendByCategoryPage.categoriesDropdown,categories.items[0]['category_name']) 
        .click(departmentSpendByCategoryPage.categoriesOptions.find('input'))
        .click(departmentSpendByCategoryPage.updateButton);
    //8. Check canvas and elements
    //await t
        //TODO check canvas and click.
        //.click(departmentSpendByCategoryPage.labelCheckbox)
        //.expect(departmentSpendByCategoryPage.canvas.exists).ok('The "Graphic" canvas should exist')
        //.expect(departmentSpendByCategoryPage.stackedCheckbox.exists).ok('The "Stacked View" checkbox should exist')
        //.expect(departmentSpendByCategoryPage.labelCheckbox.exists).ok('The "Stacked View" label should exist')
        //.expect(departmentSpendByCategoryPage.question.exists).ok('The "Question" icon should exist')
        //.click(departmentSpendByCategoryPage.labelCheckbox);  

    if (await infoModal.exists)
    {
        await t.click(infoModal.closeButton);
    };
});

test('TC 26676: \'Manager Cycle Times\' Page', async t => {
    let managerCycleTimesPage = new ManagerCycleTimesPage();
    let menues = t.fixtureCtx.menues;
    let dashboardsMenu = byID(getMenu(menues,106).action_key);
    let dashboardButtons = Selector('div.dashboard-btn');
    let labels = t.fixtureCtx.labels;
    let divisions = await apiHandler.getDivisionItems();
   
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Dashboards submenu on the left
        .click(dashboardsMenu)
    //4. Click on the "Manager Cycle Times" dashboard button
        .click(dashboardButtons.withText(labels['ui-reporting-004']))
    //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-reporting-004']),'The "Page Title" was wrong', timeout)
      
    //6. Check the Page Elements
        .expect(managerCycleTimesPage.periodDropdown.exists).ok('The "Choose Reporting Period" dropdown should exist')
        .expect(managerCycleTimesPage.departamentDropdown.exists).ok('The "Categories" dropdown should exist')
        .expect(managerCycleTimesPage.labelsPage.withText(labels['ui-dash-004']).exists).ok('The "Choose Reporting Period" label should exist')
        .expect(managerCycleTimesPage.labelsPage.withText(labels['ui-dash-018']).exists).ok('The "Choose department for Report" label should exist')
        .expect(managerCycleTimesPage.labelsPage.withText(labels['ui-dash-020']).exists).ok('The "Start Date" label should exist')
        .expect(managerCycleTimesPage.labelsPage.withText(labels['ui-dash-021']).exists).ok('The "End Date" label should exist')
        .expect(managerCycleTimesPage.startDatePicker.exists).ok('The "Start Date Picker" should exist')
        .expect(managerCycleTimesPage.endDatePicker.exists).ok('The "End Date Picker" should exist')
        .expect(managerCycleTimesPage.updateButton.exists).ok('The "Update" button should exist')
        .expect(managerCycleTimesPage.updateButton.hasAttribute('disabled')).ok('The "update" button has should disabled')   
    await t
        .expect(await checkLabels(managerCycleTimesPage.departamentDropdown,divisions,'description')).ok();     
    
    if(divisions.items.length > 0){    
        //7. Select departament
        await t
            .typeText(managerCycleTimesPage.departamentDropdown,divisions.items[0]['description']);
        await t
            .click(managerCycleTimesPage.departamentOptions.find('label').find('input'))
            .wait(2000);
        await t    
            .click(managerCycleTimesPage.updateButton)
            .wait(2000)
            .click(managerCycleTimesPage.updateButton);
        
        //8. Check canvas and elements
        await t
            //TODO check canvas and click.    
            .expect(managerCycleTimesPage.canvas.exists).ok('The "Graphic" canvas should exist');
            //.expect(managerCycleTimesPage.stackedCheckbox.exists).ok('The "Stacked View" checkbox should exist')
            //.expect(managerCycleTimesPage.labelCheckbox.exists).ok('The "Stacked View" label should exist')
            //.expect(managerCycleTimesPage.question.exists).ok('The "Question" icon should exist')
            //.click(managerCycleTimesPage.labelCheckbox)
            //.click(managerCycleTimesPage.labelCheckbox);   
    } 

});

test('TC 26679: \'Violations By Department\' Page', async t => {
    let violationsByTypePage = new ViolationsByTypePage();
    let menues = t.fixtureCtx.menues;
    let dashboardsMenu = byID(getMenu(menues,106).action_key);
    let dashboardButtons = Selector('div.dashboard-btn');
    let labels = t.fixtureCtx.labels;
    let divisions = await apiHandler.getDivisionItems();
   
    await t
    //3. Click on the Dashboards submenu on the left
        .click(dashboardsMenu);
    await t
    //4. Click on the "Violations By Type" dashboard button
        .click(dashboardButtons.withText(labels['ui-reporting-003']));
    await t
    //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-dash-014']),'The "Page Title" was wrong', timeout)
      
    //6. Check the Page Elements
        .expect(violationsByTypePage.periodDropdown.exists).ok('The "Choose Reporting Period" dropdown should exist')
        .expect(violationsByTypePage.departamentDropdown.exists).ok('The "Categories" dropdown should exist')
        .expect(violationsByTypePage.labelsPage.withText(labels['ui-dash-018']).exists).ok('The "Choose department for Report" label should exist')
        .expect(violationsByTypePage.labelsPage.withText(labels['ui-dash-020']).exists).ok('The "Start Date" label should exist')
        .expect(violationsByTypePage.labelsPage.withText(labels['ui-dash-021']).exists).ok('The "End Date" label should exist')
        .expect(violationsByTypePage.startDatePicker.exists).ok('The "Start Date Picker" should exist')
        .expect(violationsByTypePage.endDatePicker.exists).ok('The "End Date Picker" should exist')
        .expect(violationsByTypePage.updateButton.exists).ok('The "Update" button should exist')
        .expect(violationsByTypePage.updateButton.hasAttribute('disabled')).ok('The "update" button has should disabled')   
    await t
        .expect(await checkLabels(violationsByTypePage.departamentDropdown,divisions,'description')).ok();     
    
    if(divisions.items.length > 0){ 
        //7. Select departament
        await t
            .typeText(violationsByTypePage.departamentDropdown,divisions.items[0]['description'])  
            .click(violationsByTypePage.departamentOptions.find('input'))
            .click(violationsByTypePage.updateButton);
    }
    
    //8. Check canvas and elements
    //await t
        //TODO check canvas and click.
        //.expect(violationsByTypePage.canvas.exists).ok('The "Graphic" canvas should exist')
        //.expect(violationsByTypePage.stackedCheckbox.exists).ok('The "Stacked View" checkbox should exist')
        //.expect(violationsByTypePage.labelCheckbox.exists).ok('The "Stacked View" label should exist')
        //.expect(violationsByTypePage.question.exists).ok('The "Question" icon should exist')
        //.click(violationsByTypePage.labelCheckbox)
        //.click(violationsByTypePage.labelCheckbox);    

});

test('TC 26680: \'Employee Cycle Times\' Page', async t => {
    let employeeCycleTimesPage = new EmployeeCycleTimesPage();
    let menues = t.fixtureCtx.menues;
    let dashboardsMenu = byID(getMenu(menues,106).action_key);
    let dashboardButtons = Selector('div.dashboard-btn');
    let labels = t.fixtureCtx.labels;
    let divisions = await apiHandler.getDivisionItems();
   
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Dashboards submenu on the left
        .click(dashboardsMenu)
    //4. Click on the "Employee Cycle Times" dashboard button
        .click(dashboardButtons.withText(labels['ui-reporting-005']))
    //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-reporting-005']),'The "Page Title" was wrong', timeout)
      
    //6. Check the Page Elements
        .expect(employeeCycleTimesPage.periodDropdown.exists).ok('The "Choose Reporting Period" dropdown should exist')
        .expect(employeeCycleTimesPage.departamentDropdown.exists).ok('The "Categories" dropdown should exist')
        .expect(employeeCycleTimesPage.labelsPage.withText(labels['ui-dash-004']).exists).ok('The "Choose Reporting Period" label should exist')
        .expect(employeeCycleTimesPage.labelsPage.withText(labels['ui-dash-018']).exists).ok('The "Choose department for Report" label should exist')
        .expect(employeeCycleTimesPage.labelsPage.withText(labels['ui-dash-020']).exists).ok('The "Start Date" label should exist')
        .expect(employeeCycleTimesPage.labelsPage.withText(labels['ui-dash-021']).exists).ok('The "End Date" label should exist')
        .expect(employeeCycleTimesPage.updateButton.exists).ok('The "Update" button should exist')
        .expect(employeeCycleTimesPage.updateButton.hasAttribute('disabled')).ok('The "update" button has should disabled');
    await t
        .expect(await checkLabels(employeeCycleTimesPage.departamentDropdown,divisions,'description')).ok();     
    
    if(divisions.items.length > 0){
        //7. Select departament
        await t
            .typeText(employeeCycleTimesPage.departamentDropdown,divisions.items[0]['description'])  
            .click(employeeCycleTimesPage.departamentOptions.find('input'))
            .click(employeeCycleTimesPage.updateButton);
    }
       
});

test('TC 25162: \'OOO Delegation\' Page', async t => {
    let oooDelegationPage = new OOODelegationPage();
    let labels = t.fixtureCtx.labels;
    let menues = t.fixtureCtx.menues;
    let home = byID(getMenu(menues,101).action_key);
    await t
    //2. Go to Corcentric Expense
        .wait(2000)
        .expect(home.exists).ok('The left menu should be present before clicking OOO delegation', timeout) 
    //3. Click on the User dropdown
        .click(page.userDropdown.toggle)
    //4. Click on the "OOO Delegation" dropdown item
        .expect(page.userDropdown.oooDelegation.exists).ok('The "OOO Delegation" item should exist in the dropdown', timeout)
        .click(page.userDropdown.oooDelegation)
    //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-oood-000']),'The "Page Title" was wrong', timeout) 
    //6. Check Page Elements
        .expect(oooDelegationPage.toggle.exists).ok('The toggle should exist')
        .expect(oooDelegationPage.hiddenCheckbox.exists).ok('The hidden checkbox for the toggle should exist')
        .expect(oooDelegationPage.delegationDropdown.exists).ok('The "Delegation" dropdown should exist')
        .expect(oooDelegationPage.fromDatepicker.exists).ok('The "From" datepicker should exist')
        .expect(oooDelegationPage.toDatepicker.exists).ok('The "To" datepicker should exist')
        .expect(oooDelegationPage.updateButton.exists).ok('The "Update" button should exist');

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

test('TC 25532: \'Approval Profile\' Page', async t => {
    let manageUsersPage = new ManageUsersPage();
    let userManagementPage = new UserManagementPage();
    let approvalProfilePage = new ApprovalProfilePage();
    let labels = t.fixtureCtx.labels;
    let manageUsersSubmenu = getMenu(t.fixtureCtx.manageUsersMenu.submenu,3010603);
    let email_user = 'hborda@corcentric.com';

    let headers = [ labels['ui-apvuser-010'], //Sequence
        labels['ui-apvuser-011'], //Name
        labels['ui-apvuser-012']  //Orientation
    ];

    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Manage Users
        .click(byID(t.fixtureCtx.manageUsersMenu.action_key))
    //5. Click on Manage Users
        .click(byID(manageUsersSubmenu.action_key))
        .wait(5000);

    //6-7. Search for the logged in user. Click edit on the User
    await manageUsersPage.openUser('Test','Good',email_user);
    await t
        .wait(2000)
    //8. Click the "Approval Profile" button
        .click(userManagementPage.approvalProfileButton)
    //9. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-apvuser-000']),'The "Page Title" was wrong', timeout)
    //10. Check the Page Elements
        .expect(approvalProfilePage.saveButton.exists).ok('The "Save" button should exist')
        .expect(approvalProfilePage.cancelButton.exists).ok('The "Cancel" button should exist')
        .expect(approvalProfilePage.defaultCheckbox.exists).ok('The "Default" checkbox should exist')
        .expect(approvalProfilePage.customCheckbox.exists).ok('The "Custom" checkbox should exist')
        .expect(approvalProfilePage.includeManagerCheckbox.exists).ok('The "Include Manager" checkbox should exist')
        .expect(approvalProfilePage.dropdown.exists).ok('The dropdown should exist')
        .expect(approvalProfilePage.table.exists).ok('The table grid should exist')
        .expect(approvalProfilePage.addButton.exists).ok('The "Add" button should exist')
    //11. Check the Table Headers
        .expect(await checkLabels(approvalProfilePage.tableHeaders,headers)).ok()
    //12. Click the "Add" button
        .click(approvalProfilePage.addButton)
    //13. Check the Elements
        .expect(approvalProfilePage.findApproverInput.exists).ok('The "Find Approver" input for the "Add Approver" modal should exist')
        .expect(approvalProfilePage.approverDropdown.exists).ok('The "Approver" dropdown for the "Add Approver" modal should exist')
        .expect(approvalProfilePage.saveApproverButton.exists).ok('The "Save" button for the "Add Approver" modal should exist');
});

test('TC 25584: \'Groups Mapping\' Page', async t => {
    let groupsMappingPage = new GroupsMappingPage();
    let mappingPage = new MappingPage();
    let labels = t.fixtureCtx.labels;

    let groupsSubmenu = getMenu(t.fixtureCtx.groupsMenu.submenu,301161);

    let headers = [ 
        labels['ui-groupmap-001'],
        labels['ui-groupmap-002'],
        labels['ui-groupmap-003'],
        labels['ui-groupmap-004'],
        labels['ui-groupmap-005'],
        labels['ui-groupmap-006'],
        labels['ui-groupmap-007']
    ];

    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on the "Groups" menu
        .click(byID(t.fixtureCtx.groupsMenu.action_key))
    //5. Click on the "Groups Mapping" item
        .click(byID(groupsSubmenu.action_key))
    //6. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-groupmap-000']),'The "Page Title" was wrong', timeout)
    //7. Check the Elements
        .expect(groupsMappingPage.newButton.exists).ok('The "Add" button should exist')
        .expect(await checkLabels(groupsMappingPage.table.headers,headers)).ok('The table headers were wrong')
    //8. Click the "New" button
        .click(groupsMappingPage.newButton)
    //9. Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-groupmap-200']),'The "Page Title" was wrong', timeout)
    //9. Check the Elements
        .expect(mappingPage.closeButton.exists).ok('The "Close" button should exist')
        .expect(mappingPage.mappingNameInput.exists).ok('The "Mapping Name" input should exist')
        .expect(mappingPage.fileTypeDropdown.exists).ok('The "File Type" dropdown should exist')
        .expect(mappingPage.groupTypeDropdown.exists).ok('The "Group Type" dropdown should exist')
        .expect(mappingPage.hasHeadersCheckbox.exists).ok('The "Has Header" checkbox should exist')
        .expect(mappingPage.commentsTextarea.exists).ok('The "Comments" textarea should exist')
        .expect(mappingPage.fileNameInput.exists).ok('The "File Name" input should exist')
        .expect(mappingPage.uploadFileFieldsButton.exists).ok('The "Upload File Fields" button should exist')
        .expect(mappingPage.mappingContainer.exists).ok('The "Mapping" container should exist')
        .expect(mappingPage.testButton.exists).ok('The "Test" button should exist')
        .expect(mappingPage.clearFileButton.exists).ok('The "Clear File" button should exist')
        .expect(mappingPage.saveButton.exists).ok('The "Save" button should exist')
        .expect(mappingPage.importButton.exists).ok('The "Import" button should exist');
});

test('TC 25932: \'AP Integration\' Page', async t => {
    let apIntegrationPage = new APIntegrationPage();
    let labels = t.fixtureCtx.labels;
    let apIntegrationMenu = getMenu(t.fixtureCtx.settingsMenu.submenu,30113);

    await t 
    //2. Go to Corcentric Expense
    //3. Click on Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Settings submenu
        .click(byID(t.fixtureCtx.settingsMenu.action_key))
    //5. Click on AP Integration
        .click(byID(apIntegrationMenu.action_key))
    //6. Check page title 
    //Labels are with a space at first
    .expect(page.title.innerText).match(insensitive(labels['ui-ap-000']),'The "Page Title" was wrong', timeout)
    //7. Check page elements
        .expect(apIntegrationPage.checkboxApprove.exists).ok('The "Approve checkbox" should exist')
        .expect(apIntegrationPage.checkboxSend.exists).ok('The "Send checkbox" should exist')
        .expect(apIntegrationPage.checkboxApproveAndSend.exists).ok('The "Approve and Send checkbox" should exist')
        .expect(apIntegrationPage.inputFile.exists).ok('The "Input File" should exist')
        .expect(apIntegrationPage.saveButton.exists).ok('The "Save Button" should exist')
    //Labels are with a space at first
    //On site "Select an option to lorem ipsum"
    //.expect(apIntegrationPage.selectSpan.innerText).contains(labels['ui-AP-001']) //Select an option to manage the processing of expense reports between Corcentric Expense and Cor360.
    //.expect(apIntegrationPage.inputSpan.innerText).contains(labels['ui-AP-002'])	//Cor360 Invoice Input Folder	
    //8. Click on radios    
        .click(apIntegrationPage.checkboxSend)
        .click(apIntegrationPage.checkboxApproveAndSend)
        .click(apIntegrationPage.checkboxApprove);
});

test('TC 25936: \'Approval Routing\' Page', async t => {
    let approvalRoutingPage = new ApprovalRoutingPage();
    let approvalRouting = getMenu(t.fixtureCtx.settingsMenu.submenu,30115);
    let approvalLabels = await apiHandler.getApprovalProfileChainTypes();

    await t
    //2. Go to Corcentric Expense
    //3. Click on Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Settings submenu
        .click(byID(t.fixtureCtx.settingsMenu.action_key))
    //5. Click on Approval Routing
        .click(byID(approvalRouting.action_key))
    //6. Check page title
        .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-apvmethod-000'],'The "Page Title" was wrong', timeout)
    //7. Check Page Elements
        .expect(approvalRoutingPage.saveButton.exists).ok('The "Save" button should exist')
        .expect(approvalRoutingPage.radioButtons.count).eql(3,'There should be 3 radio buttons')
        .expect(approvalRoutingPage.span.withText('Select expense report approval method').exists).ok('The "Span" title should exist')
        .expect(await checkLabels(approvalRoutingPage.radioButtonsLabels,approvalLabels,'item_description')).ok('Some of the required labels were not found')
    //8. Click on radios    
        .click(approvalRoutingPage.radioButtons.nth(1))
        .click(approvalRoutingPage.radioButtons.nth(2))
        .click(approvalRoutingPage.radioButtons.nth(0));
});

test('TC 26052: \'Manage Group-Role\' Page', async t => {
    let manageGroupRolePage = new ManageGroupRolePage();
    let manageGroupRole = getMenu(t.fixtureCtx.manageUsersMenu.submenu,3010606);
    let labels = t.fixtureCtx.labels;
    let groupTypes =  (await apiHandler.getGroupTypes()).items;
    let approvalGroupType = groupTypes.find(element => element.type_id === 1).type_name;
    let policyGroupType = groupTypes.find(element => element.type_id === 2).type_name;
    let membershipsTableHeaders = [ 
        labels['ui-rolemembership-000'], //Default
        labels['ui-rolemembership-002'], //Group Name
        labels['ui-rolemembership-003']  //Role
    ];


    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Users->Manage Group-Role
        .click(byID(t.fixtureCtx.manageUsersMenu.action_key))
        .click(byID(manageGroupRole.action_key))
    //Check Title
        .expect(page.title.innerText).match(insensitive(labels['ui-rolemembership-004']),'The "Page Title" was wrong', timeout)
    //5. Check Page Elements
        .expect(manageGroupRolePage.usersTable.exists).ok('The grid table should exist. Perhaps it was empty')
        .expect(manageGroupRolePage.searchInput.exists).ok('The search input should exist')
    //6. Click any user from the table
        .click(manageGroupRolePage.usersTable.find('td').nth(0))
    //Check elements
        .expect(manageGroupRolePage.groupTypeDropdown.exists).ok('The "Group type" dropdown should exist')
        .click(manageGroupRolePage.groupTypeDropdown);
    await t
        .expect(await checkLabels(manageGroupRolePage.dropdownOptions,groupTypes,'type_name')).ok('Group type options are not correct')
        .expect(manageGroupRolePage.groupDropdown.exists).ok('The "Group" dropdown should exist')
        .expect(manageGroupRolePage.roleDropdown.exists).ok('The "Role" dropdown should exist')
        .expect(manageGroupRolePage.addButton.exists).ok('Add button should exist')
    //7. Select "Approval" from Group Type 
        .click(manageGroupRolePage.dropdownOptions.find('p').withText(insensitive(approvalGroupType)))
        //.expect(manageGroupRolePage.membershipsTable.exists).ok('Membership table from Approval Group Type is not present');
    //await t
       //.expect(await checkLabels(manageGroupRolePage.membershipsTable.headers,membershipsTableHeaders)).ok('Membership table headers from Approval Group Type are not correct')
    //8. Select "Policy" from Group Type                                    
        .click(manageGroupRolePage.groupTypeDropdown)
        //.click(manageGroupRolePage.dropdownOptions.find('p').withText(insensitive(policyGroupType)))
        //.expect(manageGroupRolePage.membershipsTable.exists).ok('Membership table from Approval Group Type is not present');
    //await t
       //.expect(await checkLabels(manageGroupRolePage.membershipsTable.headers,membershipsTableHeaders)).ok('Membership table headers from Policy Group Type are not correct');    
});

test('TC 27496: \'User Management\' Page', async t => {
    let manageUsersPage = new ManageUsersPage();
    let userManagementPage = new UserManagementPage();
    let labels = t.fixtureCtx.labels;
    let manageUsersSubmenu = getMenu(t.fixtureCtx.manageUsersMenu.submenu,3010603);
    let notificationHeaders = [
		labels['ui-setup-021'], // Notification
		labels['ui-setup-022']  // Delivery Type
	];
    let glTagsHeaders = [labels['ui-usrm-130'], labels['ui-usrm-131']];
    let activityTableHeaders = [labels['ui-usrm-120'], labels['ui-usrm-121']];
    let email_user = 'hborda@corcentric.com';

    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .setTestSpeed( 0.5 )
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Manage Users
        .click(byID(t.fixtureCtx.manageUsersMenu.action_key))
    //5. Click on Manage Users
        .click(byID(manageUsersSubmenu.action_key));
        await manageUsersPage.openUser('Test','Good',email_user);
    await t
    //6-7. Search for the logged in user. Click edit on the User
        .wait(2000)
        //8. Components verification
        .expect(userManagementPage.personalInfoTab.exists).ok('Personal Info tab should exist')
        .expect(userManagementPage.usernameInput.exists).ok('User name input should exist')
        .expect(userManagementPage.firstnameInput.exists).ok('User first name input should exist')
        .expect(userManagementPage.lastnameInput.exists).ok('User last name input should exist')
        .expect(userManagementPage.middlenameInput.exists).ok('User middle name input should exist')
        .expect(userManagementPage.phoneNumberInput.exists).ok('User phone number should exist')
        .expect(userManagementPage.emailInput.exists).ok('User email input should exist')
        .expect(userManagementPage.divisionInput.exists).ok('User division input should exist')
        .expect(userManagementPage.vendorInput.exists).ok('User vendor input should exist')
        .expect(userManagementPage.resetPasswordButton.withText(labels['ui-usrm-114']).exists).ok('User reset password button should exist')
        .expect(userManagementPage.approvalProfileButton.exists).ok('User approbal profile button should exist')
        .expect(userManagementPage.saveButton.exists).ok('User save button should exist')
        .expect(userManagementPage.cancelButton.exists).ok('User cancel button should exist')
        .expect(userManagementPage.imageProfile.exists).ok('The image profile should exist')
        // labels verification
        .expect(userManagementPage.personalInfoTabLabel.withText(labels['ui-usrm-103']).exists).ok('The "Personal Info" label should exist')
        .expect(userManagementPage.labelsPage.withText(labels['ui-usrm-107']).exists).ok('The "User name" label should exist')
        .expect(userManagementPage.labelsPage.withText(labels['ui-usrm-108']).exists).ok('The "First name" label should exist')
        .expect(userManagementPage.labelsPage.withText(labels['ui-usrm-109']).exists).ok('The "Email" label should exist')
        .expect(userManagementPage.labelsPage.withText(labels['ui-usrm-110']).exists).ok('The "Middle name" label should exist')
        .expect(userManagementPage.labelsPage.withText(labels['ui-usrm-111']).exists).ok('The "last name" label should exist')
        .expect(userManagementPage.labelsPage.withText(labels['ui-usrm-112']).exists).ok('The "Phone number" label should exist')
        .expect(userManagementPage.upLoadLabel.withText(labels['ui-usrm-113']).exists).ok('The "Upload" label should exist')
        .expect(userManagementPage.labelsPage.withText(labels['ui-usrm-119']).exists).ok('The "Vendor id" label should exist')
        .expect(userManagementPage.labelsPage.withText(labels['ui-usrm-129']).exists).ok('The "Division" label should exist')
        .expect(userManagementPage.saveButtonLabel.withText(labels['ui-usrm-102']).exists).ok('The "Save" label should exist')
        .expect(userManagementPage.cancelButtonLabel.withText(labels['ui-usrm-101']).exists).ok('The "Cancel" label should exist')
        .expect(userManagementPage.labelsPage.withText(labels['ui-usrm-125']).exists).ok('The "Company" label should exist')
        .expect(userManagementPage.labelsPage.withText(labels['ui-usrm-126']).exists).ok('The "Status" label should exist')
        .click(userManagementPage.resetPasswordButton);
        await t
        .expect(userManagementPage.acceptButonModal.withText(labels['ui-usrm-117']).exists).ok("Modals's Accept button should exist ") 
        .expect(userManagementPage.cancelButtonModal.withText(labels['ui-usrm-118']).exists).ok("Modals's Cancel button should exist ")
        .click(userManagementPage.cancelButtonModal.withText(labels['ui-usrm-118']))
        //TODO: TEM-2474
        /*
        .click(userManagementPage.glTagsTab)
        .expect(userManagementPage.glTagsTable.exists).ok('Gl Table should exist')
        .expect(userManagementPage.newTagButton.exists).ok('+Tag button should exists')
        .expect(userManagementPage.newTagButton.hasAttribute('disabled')).ok('+Tag button has to be disbled')
        await t
        .expect(await checkLabels(userManagementPage.glTagsTable.headers, glTagsHeaders)).ok('GL Tags table headers should exist')
        .expect(userManagementPage.segmentNameInput.exists).ok('Segment name input should exist')
        .expect(userManagementPage.segmentValue.exists).ok('Segment value input should exist')
        .expect(userManagementPage.labelsPage.withText(labels['ui-usrm-130']).exists).ok('Segment name label should exist')
        .expect(userManagementPage.labelsPage.withText(labels['ui-usrm-131']).exists).ok('Segment value label should exist')
        // TODO: REMOVE ROLES
        /* Remove this section on TEM
        .click(userManagementPage.userRolesTab)
        .expect(userManagementPage.userRolesTab.exists).ok('User reles tab should exist')
        .expect(userManagementPage.fromTable.exists).ok('From table should exist')
        .expect(userManagementPage.toTable.exists).ok('To table should exist')
        .expect(userManagementPage.addButton.exists).ok('Add button should exist')
        .expect(userManagementPage.removeButton.exists).ok('Remove button should exist')
        .expect(userManagementPage.addButtonLabel.withText(labels['ui-cm-011']).exists).ok('Add button label should exist')
        .expect(userManagementPage.removeButtonLabel.withText(labels['ui-cm-011']).exists).ok('Remove button label should exist')
        */
        .click(userManagementPage.approvalTab)
        .expect(userManagementPage.approvalTab.exists).ok('Approval tab should exist')
        .expect(userManagementPage.approvalLimitInput.exists).ok('Approval limit input should exist')
        .expect(userManagementPage.updateButton.exists).ok('Update button should exist')
        .expect(userManagementPage.approvalLimitInputLabel.withText(labels['ui-usrm-145']).exists).ok('Approval limit label should exist')
        //TODO: TEM-2476
        /*
        .click(userManagementPage.notificationsTab)
        .expect(userManagementPage.notificationsTab.exists).ok('Notifications tab should exist')
        .expect(userManagementPage.notificationsTable.exists).ok('Notifications tab table should exist');
        await t
        .expect(await checkLabels(userManagementPage.notificationsTable.headers, notificationHeaders)).ok('Table headers are wrong')
        */
        .click(userManagementPage.profileActivityTab)
        .expect(userManagementPage.profileActivityTab.exists).ok('Profile activity tab should exist')
        .expect(userManagementPage.profileActivityTable.exists).ok('Profile activity table should exist');
        await t
        .expect(await checkLabels(userManagementPage.profileActivityTable.headers, activityTableHeaders)).ok('Activity table headers are wrong')
        .click(userManagementPage.personalInfoTab)
        .click(userManagementPage.cancelButton)
});

test(`TC 27610: UI Validation - User Profile Menu`, async t => {
    const labels = t.fixtureCtx.labels;
    const profileOptions = await apiHandler.getTEMUserDropdown();
    const roles = (await apiHandler.getMyProfile()).app_roles;
	
	await t
		//2. Go to Corcentric Expense
        //3. Click on the dropdown next to the avatar image
		.click(page.userDropdown.toggle);

		//4. Check dropdown options
    await t
        .expect(page.userDropdown.changePassword.exists).ok('Change Password option should exist')
        .expect(page.userDropdown.oooDelegation.exists).ok('OOO Delegation option should exist')
        .expect(page.userDropdown.roles.exists).ok('Roles option should exist')
        .expect(page.userDropdown.myAccount.exists).ok('My Account option should exist')
       // .expect(page.userDropdown.help.exists).ok('Help option should exist')
        .expect(page.userDropdown.logout.exists).ok('Logout option should exist');
    await t
        .expect(await checkLabels(page.userDropdown.dropdownItem,profileOptions,'title')).ok('Dropdown options are not correct')

        //5. Click Roles option
        .click(page.userDropdown.roles);
    await t
        .expect(await checkLabels(page.userDropdown.dropdownItem,roles,'group_roles')).ok('Roles were not correctly displayed');
});

test('TC 27638: \'GL Allocation Settings\' Page', async t => {
    let glAllocationSettingPage = new GlAllocationSettingPage();
    let glAllocationSettings = getMenu(t.fixtureCtx.settingsMenu.submenu,302001);
    let optionsDropdown = await apiHandler.getGLAllocationSettingsExpense();
    let optionsDropdownEntryTypes = await apiHandler.getGLAllocationEntryTypes();
    const labels = t.fixtureCtx.labels;
   
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click the Settings submenu
        .click(byID(t.fixtureCtx.settingsMenu.action_key))
    //4. Click on Date Format
        .click(byID(glAllocationSettings.action_key))
    //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-glmap-032']),'The "Page Title" was wrong', timeout);
    await t
    //6. Check Page Elements
        .expect(glAllocationSettingPage.saveButton.exists).ok('Save button should exist')
        .expect(glAllocationSettingPage.inputFilter.exists).ok('Filter input should exist')
        .expect(glAllocationSettingPage.dropdownGL.exists).ok('GL Allocation Settings dropdown should exist')
        .expect(glAllocationSettingPage.dropdownGLPerExpense.exists).ok('Number of GL Allocations per Expense dropdown should exist')
        //TODO: TEM-2355
        .expect(glAllocationSettingPage.labelsPage.withText(labels['ui-glmap-030']).exists).ok('The "Select GL Allocation method" label should exist')
        .expect(glAllocationSettingPage.labelsPage.withText(labels['ui-glmap-034']).exists).ok('The "Select GL Allocation method" label should exist')
    //7. Check Dropdown Options
        .click(glAllocationSettingPage.dropdownGL.find('i'))
        .expect(glAllocationSettingPage.dropdownGL.rows.exists).ok('GL Allocation Settings options dropdown should exist')
        .expect(await glAllocationSettingPage.checkAllOptions(optionsDropdown.items)).ok('The GL Allocation Settings options dropdown should correct')
        .click(glAllocationSettingPage.dropdownGL.find('i'))
        .click(glAllocationSettingPage.dropdownGLPerExpense)
        .expect(glAllocationSettingPage.dropdownOptionsGLPerExpense.find('p').withText(optionsDropdownEntryTypes.items[0].gl_allocation_entry_type)).ok('The Number of GL Allocations per Expense (Single) option dropdown should correct');
        //.expect(glAllocationSettingPage.dropdownOptionsGLPerExpense.find('p').nth(1).withText(optionsDropdownEntryTypes.items[1].gl_allocation_entry_type)).ok('The Number of GL Allocations per Expense (Multiple) option dropdown should correct');
});

//TODO: UI-1680
test('TC 27756: UI Validation - Define GL', async t => {
    let defineGLPage = new DefineGLPage();
    let defaultGL = getMenu(t.fixtureCtx.generalLedger.submenu,301171);
    let defineGLHeaders = [
		'Segment ID', 
        'Code',
        'Description'  
	];

    await t
    //2. Go to Corcentric Expense
    //3. Click on Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on General Ledger submenu
        .click(byID(t.fixtureCtx.generalLedger.action_key))
    //5. Click on Approval Routing
        .click(byID(defaultGL.action_key))
    //6. Check page title
       // .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-apvmethod-000'],'The "Page Title" was wrong', timeout)
       .expect(page.title.innerText).contains('Define GL','The "Page Title" was wrong', timeout)
    //7. Check Page Elements
        .expect(defineGLPage.defineGLTable.exists).ok('The "Define GL" table should exist')
        .expect(await checkLabels(defineGLPage.defineGLTable.headers,defineGLHeaders)).ok('The "Header" table should exist');
});

test('TC 27786: UI Validation - Manage GL', async t => {
    let manageGLPage = new ManageGLPage();
    let manageGL = getMenu(t.fixtureCtx.generalLedger.submenu,301172);
    let segments = await apiHandler.getSegments();
    let values = await apiHandler.getAllValuesManagGL();
    let manageGLHeaders = [];

    for(let i=0; i<segments.items.length;i++){
        manageGLHeaders[i] = segments.items[i].value.description;
    }
    await t
    //2. Go to Corcentric Expense
    //3. Click on Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on General Ledger submenu
        .click(byID(t.fixtureCtx.generalLedger.action_key))
    //5. Click on Approval Routing
        .click(byID(manageGL.action_key))
    //6. Check page title
        .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-managegl-000'],'The "Page Title" was wrong', timeout);
    if(values.total > 0){
        //7. Check Page Elements
        await t
            .expect(manageGLPage.manageGLTable.exists).ok('The "Manage GL" table should exist')
            .expect(await checkLabels(manageGLPage.manageGLTable.headers,manageGLHeaders)).ok('The "Header" table should exist');
    }else{
        await t
            .expect(manageGLPage.labelValue.withText(t.fixtureCtx.labels['ui-managegl-016']).exists).ok('The "No GL Values to display" label should exist')
    }
    await t
        .expect(manageGLPage.importGLValuesButton.exists).ok('The "Import GL Values" button should exist')
        .expect(manageGLPage.clearallGLValuesButton.exists).ok('The "Clear All GL Values" button should exist')
        .expect(manageGLPage.addGLValueButton.exists).ok('The "Add GL Values" button should exist');
    if(values.total > 0){
        //Check filters
        for(let i=0; i<segments.items.length;i++){
            await t
                .expect(manageGLPage.manageGLTable.filters.find('input').nth(i).exists).ok('The "Segments" input should exist')
                .typeText(manageGLPage.manageGLTable.filters.find('input').nth(i),'a');
        }   
        await t.click(manageGLPage.reserButton);  
        for(let i=0; i<segments.items.length;i++){
            await t.expect(await manageGLPage.manageGLTable.filters.find('input').nth(i).value).eql('','Must be empty');         
        }
    }     
    //8. Click on Clear All GL Values
    await t
        .click(manageGLPage.addButtons.withText(t.fixtureCtx.labels['ui-managegl-003']))
        .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-managegl-003'],'The "Page Title" was wrong', timeout)
        .expect(manageGLPage.addButtons.withText(t.fixtureCtx.labels['ui-managegl-011']).exists).ok('The "Save" button should exist')
        .expect(manageGLPage.addButtons.withText(t.fixtureCtx.labels['ui-managegl-009']).exists).ok('The "Cancel" button should exist');
    //Check labels 
    for(let i=0; i<segments.items.length;i++){
        await t
            .expect(manageGLPage.labelValue.withText(segments.items[i].value.description).exists).ok('The labels should exist')
            .expect(manageGLPage.addInputs.nth(i).find('input').exists).ok('The Inputs should exist')
            .typeText(manageGLPage.addInputs.nth(i).find('input'),'a',paste);
    }
    //Click cancel button
    await t
        .click(manageGLPage.addButtons.withText(t.fixtureCtx.labels['ui-managegl-009']))
        .expect(manageGLPage.addButtonsPrimary.withText(t.fixtureCtx.labels['ui-cm-036'])).ok('The "Accept" button should exist')
        .expect(manageGLPage.addButtonsPrimary.withText(t.fixtureCtx.labels['ui-cm-029'])).ok('The "Cancel" button should exist')
        .click(manageGLPage.addButtonsPrimary.withText(t.fixtureCtx.labels['ui-cm-029']))
        .click(manageGLPage.addButtons.withText(t.fixtureCtx.labels['ui-managegl-009']))
        .click(manageGLPage.addButtonsPrimary.withText(t.fixtureCtx.labels['ui-cm-036']));
    
    //9. Click on Clear All GL Values
    await t
        .click(manageGLPage.importGLValuesButton)
        .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-usrm-318'],'The "Page Title" was wrong', timeout)
        .click(manageGLPage.manageGLAccess);

    //10. Click on Clear All GL Values
    await t
        .click(manageGLPage.clearallGLValuesButton)
        .expect(manageGLPage.modalConfirm.exists).ok('The Modal Confirm should exist')
        .expect(manageGLPage.modalTitle.exists).ok('The "Title" modal should exist')
        .expect(manageGLPage.modalBody.exists).ok('The "Body" modal should exist')
        .expect(manageGLPage.modalFooter.exists).ok('The "Footer" modal should exist')
        .expect(manageGLPage.clearButton.exists).ok('The "Clear" button modal should exist')
        .expect(manageGLPage.cancelButton.exists).ok('The "Cancel" button modal should exist')
        .expect(manageGLPage.modalBody.find('p').withText(t.fixtureCtx.labels['ui-managegl-007']).exists).ok('The "Are you sure you want to clear All GL Values?" label should exist')
        .expect(manageGLPage.modalTitle.withText(t.fixtureCtx.labels['ui-managegl-002']).exists).ok('The "Clear all GL Values" label should exist')
        .expect(manageGLPage.addButtonsPrimary.withText(t.fixtureCtx.labels['ui-cm-029']).exists).ok('The "Cancel" button should exist')
        .click(manageGLPage.addButtonsPrimary.withText(t.fixtureCtx.labels['ui-cm-029']));
});



test('TC 27858: UI Validation -  Manage GL Mapping', async t => {
    let manageGLMappingPage = new ManageGLMappingPage();
    let manageGLMapping = getMenu(t.fixtureCtx.generalLedger.submenu,301173);
    
    let manageGLHeaders = [
        t.fixtureCtx.labels['ui-usrm-304'], 
        t.fixtureCtx.labels['ui-usrm-305'], 
        t.fixtureCtx.labels['ui-usrm-307'],
        t.fixtureCtx.labels['ui-usrm-308'], 
        t.fixtureCtx.labels['ui-usrm-309'], 
        t.fixtureCtx.labels['ui-usrm-310'] 
    ];

    let manageGLMappingInfo = await apiHandler.getmanageGLMapping();
    
    await t
    //2. Go to Corcentric Expense
    //3. Click on Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on General Ledger submenu
        .click(byID(t.fixtureCtx.generalLedger.action_key))
    //5. Click on Approval Routing
        .click(byID(manageGLMapping.action_key))
    //6. Check page title
        .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-usrm-318'],'The "Page Title" was wrong', timeout)
    //7. Check elements
        .expect(manageGLMappingPage.addButton.exists).ok('The "Add New" button should exist')
        .expect(manageGLMappingPage.manageGLMappingTable.exists).ok('The "Manage GL Mapping" table should exist')
        .expect(await checkLabels(manageGLMappingPage.manageGLMappingTable.headers, manageGLHeaders)).ok('Manage GL Mapping table headers are wrong')
        .click(manageGLMappingPage.addButton);
    //8. Check labels Manage GL Import
    await t 
        .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-usrm-255'],'The "Page Title" was wrong', timeout)    
        .expect(manageGLMappingPage.label.withText(t.fixtureCtx.labels['ui-usrm-201']).exists).ok('Mapping Name label should exist')
        .expect(manageGLMappingPage.label.withText(t.fixtureCtx.labels['ui-usrm-204']).exists).ok('File Type label should exist')
        .expect(manageGLMappingPage.label.withText(t.fixtureCtx.labels['ui-usrm-207']).exists).ok('Has Headers label should exist')
        //9. Check elements Manage GL Mapping
        .expect(manageGLMappingPage.mappingNameInput.exists).ok('The "Mapping Name" input should exist')
        .expect(manageGLMappingPage.fileTypeDropdown.exists).ok('The "File Type" drop should exist')
        .expect(manageGLMappingPage.hasHeaderCheckbox.exists).ok('The "Has Header" checkbox should exist')
        
        .expect(manageGLMappingPage.closeButton.exists).ok('The "Close" button should exist')
        .expect(manageGLMappingPage.uploadButton.exists).ok('The "Upload Example File" button should exist')
        .expect(manageGLMappingPage.testButton.exists).ok('The "Test" button should exist')
        .expect(manageGLMappingPage.mapClearButton.exists).ok('The "Map Clear" button should exist')
        .expect(manageGLMappingPage.usrSaveButton.exists).ok('The "Save" button should exist')
        .expect(manageGLMappingPage.usrImportButton.exists).ok('The "Import" button should exist')
        .expect(manageGLMappingPage.textarea.exists).ok('The textarea should exist')
        .click(manageGLMappingPage.closeButton);
    if(manageGLMappingInfo.total > 0){
        await t
            .click(manageGLMappingPage.editButton)
            .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-usrm-255'],'The "Page Title" was wrong', timeout)    
            .click(manageGLMappingPage.closeButton);
    }
});


test('TC 27864: UI Validation -  User GL Default', async t => {
    let userGLDefaultPage = new UserGLDefaultPage();
    let userGLdefault = getMenu(t.fixtureCtx.generalLedger.submenu,301174);
    
    let segments = await apiHandler.getSegments();
    let userGLHeaders = [];
    userGLHeaders[0] = 'Full Name';
    userGLHeaders[1] = 'User Name';
    let pos = 2;
    for(let i=0; i<segments.items.length;i++){
        userGLHeaders[pos] = segments.items[i].value.description;
        pos++;
    }

    let userGLDefaultInfo = await apiHandler.getuserGLDefault();

   await t
    //2. Go to Corcentric Expense
    //3. Click on Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on General Ledger submenu
        .click(byID(t.fixtureCtx.generalLedger.action_key))
    //5. Click on Approval Routing
        .click(byID(userGLdefault.action_key))
    //6. Check page title
        .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-gldefault-000'],'The "Page Title" was wrong', timeout)
    //7. Check elements
        .expect(userGLDefaultPage.addButton.exists).ok('The "Add New" button should exist');
    if(userGLDefaultInfo.total > 0){
        await t
        .expect(userGLDefaultPage.userGLDefaultTable.exists).ok('The "User GL Default" table should exist')
        .expect(await checkLabels(userGLDefaultPage.userGLDefaultTable.headers, userGLHeaders)).ok('Manage GL Mapping table headers are wrong')
    }
    if(userGLDefaultInfo.total > 0){
        //Check inputs filter
        await t
            .expect(userGLDefaultPage.reserButton.exists).ok('The "Reset Filter" button should exist')
            .expect(userGLDefaultPage.userGLDefaultTable.filters.find('input').nth(0).exists).ok('The "Full Name" input should exist')
            .expect(userGLDefaultPage.userGLDefaultTable.filters.find('input').nth(1).exists).ok('The "User Name" input should exist');         
        pos = 2;
        for(let i=0; i<segments.items.length;i++){
        await t.expect(userGLDefaultPage.userGLDefaultTable.filters.find('input').nth(pos).exists).ok('The "Segments" input should exist');
        pos++;
        }
        pos = 2;
        for(let i=0; i<segments.items.length;i++){
            await t.typeText(userGLDefaultPage.userGLDefaultTable.filters.find('input').nth(pos),'a');
            pos++;
        } 
        await t.click(userGLDefaultPage.reserButton);  
        pos = 2;
        for(let i=0; i<segments.items.length;i++){
            await t.expect(await userGLDefaultPage.userGLDefaultTable.filters.find('input').nth(pos).value).eql('','Must be empty');         
            pos++;
        }
    } 
    await t
        .click(userGLDefaultPage.addButton)
        .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-gldefault-002'],'The "Page Title" was wrong', timeout)
        .expect(userGLDefaultPage.userInput.exists).ok('The "User" input should exist')
        .expect(userGLDefaultPage.cancelButton.exists).ok('The "Cancel" button should exist')
        .expect(userGLDefaultPage.saveButton.exists).ok('The "Save" button should exist')
        .expect(userGLDefaultPage.addRow.exists).ok('The "Add Row" icon should exist')
        .click(userGLDefaultPage.addRow);
    // Check labels
    for(let i=0; i<segments.items.length;i++){
        await t.expect(userGLDefaultPage.label.withText(segments.items[i].value.description).exists).ok(segments.items[i].value.description+' label should exist');
    }
    //8. Press on Cancel and return
    await t
        .click(userGLDefaultPage.cancelButton)
        .expect(userGLDefaultPage.modalConfirm.exists).ok('The "Modal Confirm" should exist')
        .click(userGLDefaultPage.modalFooterButton.nth(2))
        .click(userGLDefaultPage.cancelButton)
        .click(userGLDefaultPage.modalFooterButton.nth(1))
        .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-gldefault-000'],'The "Page Title" was wrong', timeout);
});


test('TC 27875: UI Validation - User GL Default Mapping', async t => {
    let userGLDefaultMappingPage = new UserGLDefaultMappingPage();
    let manageGLMappingPage = new ManageGLMappingPage();
    let userGLdefaultMapping = getMenu(t.fixtureCtx.generalLedger.submenu,301175);
    
    let importMaps = await apiHandler.getAllImportMaps();
    let userGLMappingHeaders = [
        t.fixtureCtx.labels['ui-usrm-304'], 
        t.fixtureCtx.labels['ui-usrm-305'], 
        t.fixtureCtx.labels['ui-usrm-307'],
        t.fixtureCtx.labels['ui-usrm-308']
    ];

   await t
    //2. Go to Corcentric Expense
    //3. Click on Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on General Ledger submenu
        .click(byID(t.fixtureCtx.generalLedger.action_key))
    //5. Click on Approval Routing
        .click(byID(userGLdefaultMapping.action_key))
    //6. Check page title
        .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-usrm-315'],'The "Page Title" was wrong', timeout)
    //7. Check elements
        .expect(userGLDefaultMappingPage.addButton.exists).ok('The "Add New" button should exist');
    if(importMaps.total > 0){
        await t
            .expect(userGLDefaultMappingPage.userGLDefaultTable.exists).ok('The "User GL Import" table should exist')
            .expect(userGLDefaultMappingPage.editButton.exists).ok('The "Edit" button should exist')
            .expect(userGLDefaultMappingPage.removeButton.exists).ok('The "Remove" button should exist')
            .expect(await checkLabels(userGLDefaultMappingPage.userGLDefaultTable.headers, userGLMappingHeaders)).ok('User GL Mapping table headers are wrong');
    }
    //8. Add New Page
    await t
        .click(userGLDefaultMappingPage.addButton)
        .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-usrm-256'],'The "Page Title" was wrong', timeout)
        .expect(manageGLMappingPage.label.withText(t.fixtureCtx.labels['ui-usrm-201']).exists).ok('Mapping Name label should exist')
        .expect(manageGLMappingPage.label.withText(t.fixtureCtx.labels['ui-usrm-204']).exists).ok('File Type label should exist')
        .expect(manageGLMappingPage.label.withText(t.fixtureCtx.labels['ui-usrm-207']).exists).ok('Has Headers label should exist')
    //9. Check elements Manage GL Mapping
        .expect(manageGLMappingPage.mappingNameInput.exists).ok('The "Mapping Name" input should exist')
        .expect(manageGLMappingPage.fileTypeDropdown.exists).ok('The "File Type" drop should exist')
        .expect(manageGLMappingPage.hasHeaderCheckbox.exists).ok('The "Has Header" checkbox should exist')
        
        .expect(manageGLMappingPage.closeButton.exists).ok('The "Close" button should exist')
        .expect(manageGLMappingPage.uploadButton.exists).ok('The "Upload Example File" button should exist')
        .expect(manageGLMappingPage.testButton.exists).ok('The "Test" button should exist')
        .expect(manageGLMappingPage.mapClearButton.exists).ok('The "Map Clear" button should exist')
        .expect(manageGLMappingPage.usrSaveButton.exists).ok('The "Save" button should exist')
        .expect(manageGLMappingPage.usrImportButton.exists).ok('The "Import" button should exist')
        .expect(manageGLMappingPage.textarea.exists).ok('The textarea should exist')
        .click(manageGLMappingPage.closeButton);
    if(importMaps.total > 0){
        await t
            .click(userGLDefaultMappingPage.editButton)
            .expect(page.title.innerText).contains(t.fixtureCtx.labels['ui-usrm-256'],'The "Page Title" was wrong', timeout)    
            .click(manageGLMappingPage.closeButton);
    }


});