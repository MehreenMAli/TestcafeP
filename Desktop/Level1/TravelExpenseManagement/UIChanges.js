import { Selector } from 'testcafe';
import { before, after } from '../../../hooks';
import Page from '../../../page-models/page';
import SideBarPage from '../../../page-models/sideBarPage';
import BrandingModulePage from '../../../page-models/tem/brandingModulePage';
import { byID, getMenu, insensitive, timeout, convertToHex, checkLabels, paste, checkRequests, logger, replace, longTimeout, clickable } from '../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import users from '../../../users';
import config from '../../../config';
import ExpensesPage from '../../../page-models/tem/expensesPage';
import APIHandler from '../../../utils/apiHandler';
import { loadFixture } from '../../../tests-manager/categorization';
import DateFormatPage from '../../../page-models/tem/dateFormatPage';
import EmailTemplatesPage from '../../../page-models/tem/emailTemplatesPage';
import ManageUsersPage from '../../../page-models/tem/users/manageUsersPage';
import NewUser from '../../../page-models/tem/users/newUser';
import ConfirmModal from '../../../page-models/confirmModal';
import PoliciesPage from '../../../page-models/tem/compliance-setup/policiesPage';
import InfoModal from '../../../page-models/infoModal';
import ProjectCodesPage from '../../../page-models/tem/cost-allocation/projectCodesPage';
import Localizator from '../../../utils/localizator';
import DistanceRateSetupPage from '../../../page-models/tem/distanceRateSetupPage';
import ExpenseCategoryPage from '../../../page-models/tem/cost-allocation/expenseCategoryPage';
import GroupsPage from '../../../page-models/tem/groupsPage';
import AddEditGroupsModal from '../../../page-models/tem/addEditGroupsModal';
import RulesPage from '../../../page-models/tem/compliance-setup/rulesPage';
import GlAllocationSettingPage from '../../../page-models/tem/glAllocationSettingPage';
import HeaderPage from '../../../page-models/headerPage';
import Expense from '../../../page-models/tem/expense';
import Report from '../../../page-models/tem/report';
import ReportsPage from '../../../page-models/tem/reportsPage'
import ManageGL from '../../../page-models/tem/generalLedger/manageGL';
import ManageGLMapping from '../../../page-models/tem/generalLedger/manageGLMapping';
import UserGLDefaultMapping from '../../../page-models/tem/generalLedger/userGLDefaultMapping';

const localizator = new Localizator();
const uniqueId = Date.now().toString();
const page = new Page();
const args = parseArguments();
const apiHandler = new APIHandler();
const category = {
	id: 62000,
	name: "Corcentric Expense"
};

let temFixture = fixture`Level 1 - Corcentric Expense - UI Changes - Running on "${args.env.toUpperCase()}"`
    .page(config[args.env].baseUrl)
    .requestHooks(logger)
    .before(async ctx  => {
        await before();
        let apps = await apiHandler.getApps();
        let application = apps.find(element => element['application_id'] === 62000);
        let menues = await apiHandler.getMenues(application.menu_param);
        ctx.configurationMenu = getMenu(menues,301);
        ctx.apps = apps;
        ctx.app = application.title; //Corcentric Expense
        ctx.menues = await apiHandler.getMenues(application.menu_param);
        ctx.labels = await localizator.getLabelsAsJson('ui-brand-000');
        ctx.labels = await localizator.getLabelsAsJson('ui-00-03*,ui-00-02*,ui-policy-*,ui-email-000,ui-rule-000,ui-email-000,ui-date-000,ui-usrm-300,ui-usrm-000,ui-ccy-000,ui-dist-000,ui-prjcod-000,ui-expcat-000,ui-glmap-000,ui-proxy-0*,ui-brand-000,ui-group-000,ui-group-016,ui-gldef-000,ui-glimp-000,ui-reporting-00*,ui-dash-0*,ui-oood-000,ui-datatable-001,ui-defroltem-030,ui-apvuser-0*,ui-group-0*,msg-00-002,ui-usr-0*,ui-groupmap-*,ui-apvmethod-000,ui-manageroles-*,ui-rolemembership-0*,ui-cm-0*,ui-usrm-256');
        ctx.groupsMenu = getMenu(ctx.configurationMenu.submenu,30116);
        ctx.generalLedger = getMenu(ctx.configurationMenu.submenu, 30117);
    })
    .after( async () => {
        await after();
    })
    .beforeEach( async () => {
        let currentUser = users[args.user];
        await page.login(currentUser.username,
            currentUser.password,
            currentUser.landingPage);
        await page.setTestSpeed(0.2);
    })
    .afterEach( async () => {
        await page.logout();
        await checkRequests(logger.requests);
    });

loadFixture(users[args.user],category,temFixture);

test('TC 25315: Changes Copyright', async t => {
    let brandingModulePage = new BrandingModulePage();
    let configurationMenu = getMenu(t.fixtureCtx.menues,301);
    let settingsMenu = getMenu(configurationMenu.submenu,30200)
    let brandingModuleMenu = getMenu(settingsMenu.submenu,30103);
    
    await t
        //2. Go to Corcentric Expense
        //3. Click on the Configuration menu on the left
        .click(byID(configurationMenu.action_key))
        //4. Click on the Settings menu on the left
        .click(byID(settingsMenu.action_key))
        //5. Click on Branding Module
        .click(byID(brandingModuleMenu.action_key))
        .expect(page.title.innerText).match(insensitive(t.fixtureCtx.labels['ui-brand-000']),'The "Page Title" was wrong', timeout);
        //6. Change the "Footer Copyright Text"
        await t
            .typeText(brandingModulePage.copyrightInput, 'Test Copyright', { paste: true, replace: true })
            //7. Click "Apply"
            .click(brandingModulePage.applyButton)
            .wait(3000);
        let brand = await apiHandler.getBrand();
        await t
            .expect(brand.copyright).eql('Test Copyright', 'The brand should be edited');  
    await t
        .click(brandingModulePage.copyrightInput)
        .pressKey('ctrl+a')
        .pressKey('backspace')
        .click(brandingModulePage.applyButton);
    brand = await apiHandler.getBrand();
    await t
        .expect(brand.copyright).eql(null, 'The copyright should be the default one'); 
});

test('TC 25317: Changes Colors', async t => {
    let brandingModulePage = new BrandingModulePage();
    let configurationMenu = getMenu(t.fixtureCtx.menues,301);
    let settingsMenu = getMenu(configurationMenu.submenu,30200)
    let brandingModuleMenu = getMenu(settingsMenu.submenu,30103);
    await t
        //2. Go to Corcentric Expense
        //3. Click on the Configuration menu on the left
        .click(byID(configurationMenu.action_key))
        //4. Click on the Settings menu on the left
        .click(byID(settingsMenu.action_key))
        //5. Click on Branding Module
        .click(byID(brandingModuleMenu.action_key))
        .expect(page.title.innerText).match(insensitive(t.fixtureCtx.labels['ui-brand-000']),'The "Page Title" was wrong', timeout)
    //5. Choose a non default color palette
        .click(brandingModulePage.paletteCheckboxes.nth(1))
        .click(brandingModulePage.applyButton)
        .wait(2000);
    //6. Check the colors
    let branding = await apiHandler.getBranding();
    let activePalette = branding['palettes'].find(element => element.is_active === true);
    let colors = await brandingModulePage.getSelectedColors();
    await t
        .wait(2000)
        .expect(colors!=='undefined').ok('Could not select a custom color',longTimeout)
        .expect(activePalette.is_active).ok('Second palette color must be selected')
    //7. Choose the default color palette
        .click(brandingModulePage.paletteCheckboxes.nth(0))
        .click(brandingModulePage.applyButton)
        .wait(5000);
    colors = await brandingModulePage.getSelectedColors();
    activePalette = branding['palettes'].find(element => element.is_active);
    await t
        .wait(2000)
        .expect(colors!=='undefined').ok('Could not select a custom color')
        .expect(activePalette.palette_name==='Palette One').ok('Default palette color must be selected')
        .expect(activePalette.is_active).ok('Default palette color must be selected')
        .wait(2000); 
});

test('TC 25320: Modifies the table', async t => {
    let expensesPage = new ExpensesPage();
    let menues = t.fixtureCtx.menues;
    let expenses = byID(getMenu(menues,103).action_key);
    let expensesLabels = await localizator.getLabelsAsJson('ui-exp-*');
    let headers = [
        expensesLabels['ui-exp-200'], //DATE
        expensesLabels['ui-exp-201'], //CATEGORY
        expensesLabels['ui-exp-202'], //REPORT
        expensesLabels['ui-exp-203'], //BUSINESS PURPOSE
        expensesLabels['ui-exp-204'], //AMOUNT
        expensesLabels['ui-exp-206']  //COMPLIANCE
    ];

    await t
        //2. Go to Corcentric Expense
        //3. Click the 'Expenses' option on the left side menu
        .click(expenses)
        .expect(page.title.innerText).match(insensitive(expensesLabels['ui-exp-104']),'The "Page Title" was wrong', timeout)
        //4. Check "Display" dropdown
        .expect(expensesPage.displayButton.exists).ok('The "Display" button should exist')
        //5. Click the "Display" dropdown
        .click(expensesPage.displayButton)
        //6. Check "Restore to Default"
        .expect(expensesPage.restoreToDefaultButton.hasAttribute('disabled')).ok('Restore to default should be disabled')
        .expect(await checkLabels(expensesPage.displayItems,headers)).ok()
        //7. Uncheck an @item of the "Display" dropdown
        .click(expensesPage.displayCheckboxes.nth(3))
        .click(expensesPage.displayCheckboxes.nth(4))
        //8. Click "Restore to Default"
        .click(expensesPage.restoreToDefaultButton)
        .click(expensesPage.applyButton)
        //9. Check the table headers
        .expect(await checkLabels(expensesPage.allTable.headers,headers)).ok();
});

test('TC 26751: Change Date Format', async t => {
    let settingsMenu =  getMenu(t.fixtureCtx.configurationMenu.submenu,30200);
    let dateFormatPage = new DateFormatPage();
    let dateFormat = getMenu(settingsMenu.submenu,30109);
    let labels = t.fixtureCtx.labels;
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click the Settings submenu
        .click(byID(settingsMenu.action_key))
    //4. Click on Date Format
        .click(byID(dateFormat.action_key))
    //5. Check the Title
        .expect(page.title.innerText).match(insensitive(labels['ui-date-000']),'The "Page Title" was wrong', timeout)
    //6. Check Page Elements
        .expect(dateFormatPage.formatDropdown.exists).ok('The "Format" dropdown should exist')
        .expect(dateFormatPage.saveButton.exists).ok('The "Save" button should exist')
        .expect(dateFormatPage.closeButton.exists).ok('The "Close" button should exist')  
    //7. Click on Date Format element
        .click(dateFormatPage.formatDropdown.find('i'))
        .click(dateFormatPage.formatDropdown.find('p').nth(1))
    //8. Click on Save Button
        .click(dateFormatPage.saveButton);
    let dateChange = await apiHandler.getClientDateFormat();
    await t
    //9. Check change
        .expect(dateChange.default_date_format==='EEEE, MMMM d, yyyy').ok('Default date format must be Long Date')
        .click(dateFormatPage.formatDropdown.find('i'))
        .click(dateFormatPage.formatDropdown.find('p'))
        .click(dateFormatPage.saveButton);
    dateChange = await apiHandler.getClientDateFormat();
    await t
        .expect(dateChange.default_date_format==='M/d/yyyy').ok('Default date format must be Short Date');
});

test.skip('TC 26789: Edit an Email Template', async t => {
    let notificationMenu = getMenu(t.fixtureCtx.configurationMenu.submenu,30120);
    let emailTemplatesMenu = getMenu(notificationMenu.submenu,30111);
    let emailTemplatesPage = new EmailTemplatesPage();
    let emailTemplateName = 'Test New Template'+uniqueId;
    let emailTemplateSubject = 'Test Subject';
    let emailTemplateNameEdit = 'Test Edit Template'+uniqueId;
    let emailTemplateSubjectEdit = 'Test Subject Edit';

    
    await t
        //2. Go to TEM
        //3. Click on the Configuration menu on the left side
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on the Notifications menu on the left side
        .click(byID(notificationMenu.action_key))
        //5. Click on Email Templates
        .click(byID(emailTemplatesMenu.action_key))
        //6. Create Email Template
        .click(emailTemplatesPage.addNewButton)
        .typeText(emailTemplatesPage.templateNameInput,`${emailTemplateName}`,paste)
        .typeText(emailTemplatesPage.subjectInput,`${emailTemplateSubject}`,paste)
        .click(emailTemplatesPage.editorTextArea) //To make it active
        .click(emailTemplatesPage.businessObjectsDropdown)
        .click(emailTemplatesPage.businessObjectsDropdownOptions.nth(0))
        .click(emailTemplatesPage.fieldsItems.nth(2))
        .click(emailTemplatesPage.saveButton)
        .wait(2000)
        .typeText(emailTemplatesPage.filterTemplateName,`${emailTemplateName}`,paste)
        .pressKey('enter')
        .wait(2000)
        .click(emailTemplatesPage.editButton);
    //7. Edit Template
    await t
        .click(emailTemplatesPage.templateNameInput)
        .pressKey('ctrl+a delete')
        .typeText(emailTemplatesPage.templateNameInput,`${emailTemplateNameEdit}`,paste)
        .click(emailTemplatesPage.subjectInput)
        .pressKey('ctrl+a delete')
        .typeText(emailTemplatesPage.subjectInput,`${emailTemplateSubjectEdit}`,paste)
        .click(emailTemplatesPage.saveButton)
        .wait(2000)
    //8. Check change on Template
        .typeText(emailTemplatesPage.filterTemplateName,`${emailTemplateNameEdit}`,paste)
        .pressKey('enter')
        .wait(5000);
    //9. Delete the template
    await emailTemplatesPage.deleteTemplate(`${emailTemplateNameEdit}`);
});

test('TC 26815: Edit a User', async t => {
    let manageUsersPage = new ManageUsersPage();
    let newUser = new NewUser();
    let menues = t.fixtureCtx.menues;
    let configuration = getMenu(menues,301);
    let manageUsers = getMenu(t.fixtureCtx.configurationMenu.submenu,30106);
    let manageUsersSub = getMenu(manageUsers.submenu,3010603);
    let confirmModal = new ConfirmModal();
    
    //1. Prerequisite: add @User
    let userName = 'TC-26815';
    let userFirsName = 'QA';
    let userEmail = 'testforedit'+uniqueId+'@test.com';
    let userLastName = 'NEWTC26815';
    let userLastNameEdit = 'EDITTC26815';
    let userFirsNameEdit = 'QAEDIT';
    let user = await apiHandler.addUser("cust1", "cust2", "middleName", "11231", userName,userFirsName,userEmail,userLastName);
    let user_created = await apiHandler.getUsers(userFirsName, userLastName);
    try{
        await t
        //2. Go to TEM
        //3. Click on Configuration
        .click(byID(configuration.action_key))
        //4. Click on Users menu
        .click(byID(manageUsers.action_key))
        //5. Click on Manage Users
        .click(byID(manageUsersSub.action_key));
        //6. Edit User
        await manageUsersPage.openUser(userFirsName,userLastName,userEmail);
        await t    
            .click(newUser.username)
            .pressKey('ctrl+a delete')
            .pressKey('ctrl+a delete')   
            .click(newUser.cancelButton)
            .click(newUser.modalCancelButton)
            .click(newUser.cancelButton)
            .click(newUser.modalAcceptButton);
        await manageUsersPage.openUser(userFirsName,userLastName,userEmail);    
        await t    
            .click(newUser.username)
            .pressKey('ctrl+a delete')
            .pressKey('ctrl+a delete')   
            .typeText(newUser.username,userLastNameEdit,paste)
            .click(newUser.firstName)
            .pressKey('ctrl+a delete') 
            .typeText(newUser.firstName,userFirsNameEdit,paste)
            .click(newUser.email)
            .click(newUser.saveButton)
            .wait(5000)
            .click(await clickable(confirmModal.acceptButton),longTimeout)
            .wait(2000);
        //7. Check user    
        let usuarios = await apiHandler.getUsers(userFirsNameEdit,userLastName);
        await t
            .wait(2000)
            .expect(await manageUsersPage.existsUser(usuarios.total)).ok('The "User" must be edited ok')  
            //8. Delete the User
            .expect(await manageUsersPage.deleteUser(userFirsNameEdit,userLastName)).ok("The User must be deleted");
    }catch (err){
        let user_id = user_created.items[0]['user_id'];
        await apiHandler.deleteUser(user_id);
        throw err;
    }
    
      
});

test('TC 26816: Policy Setup Edition', async t => {
    let rulesPage = new RulesPage();
    let policiesPage = new PoliciesPage();
    let menues = t.fixtureCtx.menues;
    let configuration = getMenu(menues,301);
    let complianceSetup = getMenu(configuration.submenu,30110);
    let policies = getMenu(complianceSetup.submenu,3011001);
    let infoModal = new InfoModal();
    let labels = t.fixtureCtx.labels;

    let rulesHeaders = [ labels['ui-rule-001'],
        labels['ui-rule-006'],
        labels['ui-rule-007'],
        labels['ui-rule-008']];

    //1. Prerequisite: add @Policy
    let policyName = `NewPolice26816`;
    let policy = await apiHandler.addPolicySetup(policyName);
    let policyNameEdit = `EditPolice26816`;
    try {
        await t
            //2. Click on Configuration
            .click(byID(configuration.action_key))
            //3. Click on Compliance Setup
            .click(byID(complianceSetup.action_key))
            //4. Click on Policies
            .click(byID(policies.action_key));
            //5. Edit Policy
        await t
            .wait(5000)
            .expect(await policiesPage.editPolicy(policy.policy_name)).ok('The Policy should exist')
            //6. Check Elements
            .expect(policiesPage.saveButton.exists).ok('The "Save" button should exist')
            .expect(policiesPage.cancelButton.exists).ok('The "Cancel" button should exist')
            .expect(policiesPage.addRule.exists).ok('The "Add Rule" button should exist')
            //7. Click on Add Rule
            .click(policiesPage.addRule)
            //8. Check modal an buttons
            .wait(2000)
            .expect(policiesPage.modalSelect.exists).ok('The "Select your option" modal should exist')
            .expect(policiesPage.createRuleButton.exists).ok('The "Create Rule" button should exist');
        await t
            .wait(2000)
            //9. Add Rule from library
            .click(policiesPage.addRuleLibraryButton)
            .expect(policiesPage.modalRulesLibrery.exists).ok('The "Rules Librery" modal should exist')
            .expect(policiesPage.modalRulesLibrery.find('h4').innerText).match(insensitive(labels['ui-policy-029']),'The "Modal Title" was wrong', timeout)
            .expect(policiesPage.ruleTable.exists).ok('The "Rules" table should exist')
            .click(policiesPage.modalRulesLibrery.find('button').nth(2))
            .click(policiesPage.addRuleLibraryButton)
            .click(policiesPage.ruleTable.find('input').nth(1))
            .click(policiesPage.modalRulesLibrery.find('button').nth(1))
            //10. Check Create a new rule
            .click(policiesPage.addRule)
            .expect(policiesPage.modalSelect.exists).ok('The "Select your option" modal should exist')
            .click(policiesPage.createRuleButton)
            .expect(rulesPage.ruleNameInput.exists).ok('The "Rule Name" input should exist')
            .expect(rulesPage.ruleMessageTextarea.exists).ok('The "Rule Message" textarea should exist')
            .expect(rulesPage.ruleCriteriaDropdown.exists).ok('The "Rule Criteria" Dropdown should exist')
            .click(rulesPage.cancelButton)
            //11. Edit Policy name
            .typeText(policiesPage.policyNameInput,policyNameEdit,replace)
            .click(policiesPage.saveButton)
            .click(infoModal.closeButton);
        await t
            .expect(await policiesPage.searchPolicy(policyNameEdit)).ok('The Policy should be edited');
            //12. Postrequisite: Delete @Policy
        await t
            .expect(await apiHandler.deletePolicy(policy.policy_id)).ok('The Policy should be deleted');
    }
    catch (err){
        //Postrequisite: Delete @Policy
        await apiHandler.deletePolicy(policy.policy_id)
        throw err;
    }  
});

test('TC 26821: Project Code Edition', async t => {
    let projectCodesPage = new ProjectCodesPage();
    let menues = t.fixtureCtx.menues; 
    let configuration = getMenu(menues,301);
    let costAllocation = getMenu(configuration.submenu,30101);
    let projectCodes = getMenu(costAllocation.submenu,3010103);

    //1. Prerequisite: add @ProjectCode
    let projectCodeName = `QA26821`;
    let projectCodeCode = `CODE26821`;
    let project = await apiHandler.addProjectCode(projectCodeName,projectCodeCode);
   
    let projectCodeNameEdit = `EDITQA26821`;
    let projectCodeCodeEdit = `CODEEDIT26821`;
    try {
        await t
            //2. Go to Corcentric Expense
            //3. Click on the Configuration menu on the left
            .click(byID(configuration.action_key))
            //4. Click on Cost Allocation 
            .click(byID(costAllocation.action_key));
        await t    
            //5. Click on Project Codes
            .click(byID(projectCodes.action_key))
            .wait(4000)
            .expect(projectCodesPage.projectNameInput,longTimeout).ok('The Project Code Name input should be exists')
            .wait(7000);

        await t
            .expect(await projectCodesPage.editProjectCode(project.account_name)).ok('The Project Code should be exists');
        await t
            //7. Edit Project Code
            .click(projectCodesPage.projectNameModal)
            .pressKey('ctrl+a delete')
            .typeText(projectCodesPage.projectNameModal,projectCodeNameEdit,paste)
            .click(projectCodesPage.projectCodeModal)
            .pressKey('ctrl+a delete')
            .typeText(projectCodesPage.projectCodeModal,projectCodeCodeEdit,paste)
            .click(projectCodesPage.saveModal);
        //8. Check on table
        await t
            .expect(await projectCodesPage.searchProjectCode(projectCodeNameEdit)).ok('The Project Code should be exists');        
        //9. Postrequisite: add @ProjectCodeEdit
        await t
            .expect(await apiHandler.deleteProjectCode(project.account_id)).ok('The Project Code should be deleted');
    }
    catch (err){
        //9. Postrequisite: add @ProjectCodeEdit
        await apiHandler.deleteProjectCode(project.account_id)
        throw err;
    }    
});

test('TC 26823: Distance Rate Edition', async t => {
    let settingsMenu = getMenu(t.fixtureCtx.configurationMenu.submenu,30200);
    let distanceRateSetup = getMenu(settingsMenu.submenu,30104);
    let distanceRateSetupPage = new DistanceRateSetupPage();
    let confirmModal = new ConfirmModal();
    let firstDeleteButton = Selector('button.btn-action').nth(1);

    //1. Prerequisite: add @DistanceRate
    let unitId = 2;
    let unit = 'Kilometer';
    let rate = 999900;
    let currencyID = 1;
    let currency = 'USD';
    let per = '1';
    let distanceRate = await apiHandler.addDistanceRate(unitId,unit,rate,currencyID,currency,per);

    let perEdit = '2';

    try {
        await t
            //2. Go to Corcentric Expense
            //3. Click on the Configuration menu on the left
            .click(byID(t.fixtureCtx.configurationMenu.action_key))
            //4. Click on the Settings menu
            .click(byID(settingsMenu.action_key))
            //5. Click on Distance Rate Setup
            .click(byID(distanceRateSetup.action_key))
            //6. Edit Distance Rate Setup
            .wait(2000);
        await t
            .expect(distanceRateSetupPage.unitDropdown).ok('The "Unit" dropdown should exist')
            .wait(8000);
        await distanceRateSetupPage.editDistanceRate(rate);
        await t
            .wait(5000)
            .expect(distanceRateSetupPage.rateInputModal.exists).ok('The "Rate" input modal should exist')
            .expect(distanceRateSetupPage.perInputModal.exists).ok('The "Per" input modal should exist')
            .expect(distanceRateSetupPage.saveButtonModal.exists).ok('The "Save" button modal should exist')
            .expect(distanceRateSetupPage.closeButtonModal.exists).ok('The "Close" button modal should exist')
            .click(distanceRateSetupPage.rateInputModal)
            .click(distanceRateSetupPage.perInputModal)
            .pressKey('ctrl+a delete')
            .typeText(distanceRateSetupPage.perInputModal,perEdit,paste)
            .click(distanceRateSetupPage.saveButtonModal);
            //7. Check Distance Rate Setup edited
        await t.expect(await distanceRateSetupPage.existsDistanceRate(rate)).ok('The Distance Rate Setup should be edited');
            //8. Delete Distance Rate Setup
        await apiHandler.deleteDistanceRate(distanceRate.distance_id);
    }
    catch(err){
       await apiHandler.deleteDistanceRate(distanceRate.distance_id);
       throw err;
    }
});

test('TC 26824: \'Expense Categories Edition\'', async t => {
    let expenseCategoryPage = new ExpenseCategoryPage();
    let settingsMenu = getMenu(t.fixtureCtx.configurationMenu.submenu,30200);
    let expenseCategory = getMenu(settingsMenu.submenu,3010101);

    //@Prerequisite
    let expenseCategoryName = `EXPCAT_${uniqueId}`;
    let expenseCategoryNew = await apiHandler.addExpenseCategories(expenseCategoryName);
    
    try {
        await t
        //2. Go to Corcentric Expense
        //3. Click on the Configuration menu on the left
            .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on the Settings submenu
            .click(byID(settingsMenu.action_key))
        //5. Click on Expense Category
            .click(byID(expenseCategory.action_key))
            .wait(5000)
            .expect(expenseCategoryPage.categoryNameInput.exists).ok('The "Category Name" input should exist')
            .wait(5000);
        //6. Edit Expense Category
        await t.expect(await expenseCategoryPage.editExpenseCategory(expenseCategoryNew.category_name)).ok('The Expense Category should be exists');
        await t
            //Check Modal
            .expect(expenseCategoryPage.categoryNameModalInput.exists).ok('The "Category Name" modal input should exist')
            .expect(expenseCategoryPage.vehicleModal.exists).ok('The "Category Name" modal input should exist')
            .expect(expenseCategoryPage.saveModalButton.exists).ok('The "Category Name" modal input should exist')
            .expect(expenseCategoryPage.cancelModalButton.exists).ok('The "Category Name" modal input should exist')
            //Change Data
            .click(expenseCategoryPage.categoryNameModalInput)
            .pressKey('ctrl+a delete')
            .typeText(expenseCategoryPage.categoryNameModalInput,`ZEXP_${uniqueId}`,paste)
            .wait(2000)
            .click(expenseCategoryPage.saveModalButton);
        //7. Check Expense Category Edition
        await t.expect(await expenseCategoryPage.existsExpenseCategory(`ZEXP_${uniqueId}`)).ok('The Expense Category should be exists');
        //8. Desactive Expense Category
        await t
            .expect(await expenseCategoryPage.selectExpenseCategory(`ZEXP_${uniqueId}`)).ok('The Expense Category should be exists')
            .click(expenseCategoryPage.actionsDropdown.find('i'))
            .click(expenseCategoryPage.actionsDropdownOptions.nth(1));
        //@Postrequisite: Delete Expense Category
        await apiHandler.deleteExpenseCategory(expenseCategoryNew.category_id);
    }
    catch(err){
        await apiHandler.deleteExpenseCategory(expenseCategoryNew.category_id);
        throw err;
    }
    
}); 

test('TC 26819: Group Edition', async t => {
    let groupsPage = new GroupsPage();
    let addEditGroupsModal = new AddEditGroupsModal();
    let manageGroupsMenu = getMenu(t.fixtureCtx.groupsMenu.submenu,30107);

    let groups = await apiHandler.getGroupsByType(1);
    let parentName = groups.items[0].group_name; 
    let groupName = `AATestGroup_${uniqueId}`;
    let groupTypeId = 1;
    let groupNew = await apiHandler.addGroup(groupName,groupTypeId);  
    
    try {
        await t
        //2. Go to TEM
        //3. Click on Configuration
            .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on Groups
            .click(byID(t.fixtureCtx.groupsMenu.action_key))
            .click(byID(manageGroupsMenu.action_key))
            .wait(10000);
        await t
            .expect(groupsPage.button.exists).ok('New button is not present')
            .expect(groupsPage.groupTypeDropdown.exists).ok('Group type is not present')
            .click(groupsPage.groupTypeDropdown)
            .click(groupsPage.dropdownOptions)
            .wait(2000);
        //5. Edit Group
        await groupsPage.editGroup({groupName: groupName, parentName: ''});
        await t
            .click(addEditGroupsModal.parentGroupDropdown)
            .click(addEditGroupsModal.dropdownOptions.withText(parentName))
            .click(addEditGroupsModal.saveButton);
        let allGroups = await apiHandler.getGroup(groupTypeId);
        await groupsPage.editGroup({groupName: groupName, parentName: parentName});  
        await t
        //6. Check edition group
            .expect(await addEditGroupsModal.parentGroupDropdown.getAttribute('placeholder') === parentName).ok('Parent Group Name is not present')
            .click(addEditGroupsModal.cancelButton)
            .expect(await groupsPage.checkGroup(groupName,parentName,allGroups)).ok('Group edition is not present');
        //7. Delete Group
        await apiHandler.deleteGroup(groupNew.group_id,groupTypeId);
    }
    catch(err){
       await apiHandler.deleteGroup(groupNew.group_id,groupTypeId);
       throw err;
    }
});


test('TC 27188: New Group with Edition', async t => {
    let groupsPage = new GroupsPage();
    let addEditGroupsModal = new AddEditGroupsModal();
    let manageGroupsMenu = getMenu(t.fixtureCtx.groupsMenu.submenu,30107);

    let groups = await apiHandler.getGroupsByType(1);
    let parentName = groups.items[0].group_name; 
    let groupName = `AAETestG_${uniqueId}`;
    let newGroupEdit = `AAETG_${uniqueId}`;
    let groupTypeId = 1;
    let groupNew = await apiHandler.addGroup(groupName,groupTypeId);  
    
    try {
        await t
        //2. Go to TEM
        //3. Click on Configuration
            .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on Groups
            .click(byID(t.fixtureCtx.groupsMenu.action_key))
            .click(byID(manageGroupsMenu.action_key));
        await t
            .wait(6000)
            .expect(groupsPage.button.exists).ok('New button is not present',longTimeout)
            .expect(groupsPage.groupTypeDropdown.exists).ok('Group type is not present')
            .click(groupsPage.groupTypeDropdown)
            .click(groupsPage.dropdownOptions);
        //5. Edit Group
        await groupsPage.editGroup({groupName: groupName, parentName: ''});
        await t
            .click(addEditGroupsModal.groupNameInput)
            .pressKey('ctrl+a delete')
            .typeText(addEditGroupsModal.groupNameInput,newGroupEdit,paste)
            .click(addEditGroupsModal.saveButton);
        try {
            await t
                .click(groupsPage.groupTypeDropdown)
                .click(groupsPage.dropdownOptions.nth(1))
                .expect(groupsPage.groupTypeDropdown.exists).ok('Group type is not present')
                .click(groupsPage.groupTypeDropdown)
                .click(groupsPage.dropdownOptions);
            let allGroups = await apiHandler.getGroup(groupTypeId);
            await t.expect(await groupsPage.checkGroup(groupName,'',allGroups)).ok('The group must be exists');
            await t.expect(await groupsPage.checkGroup(groupName,'',allGroups)).ok('The new group must be exists');
            await groupsPage.deleteGroup({groupName: newGroupEdit, parentName: ''});  
            await groupsPage.deleteGroup({groupName: groupName, parentName: ''});
        }
        catch(err){
            await groupsPage.deleteGroup({groupName: newGroupEdit, parentName: ''});  
            await apiHandler.deleteGroup(groupNew.group_id,groupTypeId);
            throw err;
        }
    }
    catch(err){
       await apiHandler.deleteGroup(groupNew.group_id,groupTypeId);
       throw err;
    }
});

test('TC 26822: Rule Edition', async t => {
    let rulesPage = new RulesPage();
    let complianceSetupMenu = getMenu(t.fixtureCtx.configurationMenu.submenu,30110);
    let rules = getMenu(complianceSetupMenu.submenu,3011002);

    await t
    //2. Go to TEM
    //3. Click on Configuration
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click on Compliance
        .click(byID(complianceSetupMenu.action_key))
    //5. Click on Rules
        .click(byID(rules.action_key))
    //6. Click on "Add New Rule"
        .click(rulesPage.addNewRuleButton)
    //7. Type a Unique Rule Name
        .typeText(rulesPage.ruleNameInput,`NAME_${uniqueId}`,paste)
    //8. Type a Unique Rule Message
        .typeText(rulesPage.ruleMessageTextarea,`MESSAGE_${uniqueId}`,paste)
        .click(rulesPage.ruleCriteriaDropdown.find('i'))
        .click(rulesPage.ruleCriteriaDropdown.find('p').nth(1))
    //9. Click "Save"
        .click(rulesPage.saveButton)
    try {
        //10. Click "Edit"
        await rulesPage.editRule(`NAME_${uniqueId}`);
        await t
            .wait(5000)
            .click(rulesPage.ruleNameInput)
            .pressKey('ctrl+a delete')
            .typeText(rulesPage.ruleNameInput,`EditName_R`,paste)
            .click(rulesPage.saveButton);
        try {
            await rulesPage.existsRule(`EditName_R`);
            await rulesPage.deleteRule(`EditName_R`);
        }catch(err){
            await rulesPage.deleteRule(`NAME_${uniqueId}`);
            throw err;
        }
    }catch(err){
        await rulesPage.deleteRule(`NAME_${uniqueId}`);
        throw err;
    }
});

test('TC 27653: Change - GL Allocation Settings', async t => {
    let glAllocationSettingPage = new GlAllocationSettingPage();
    let expensesPage = new ExpensesPage();
    let headerPage = new HeaderPage();
    let settingsMenu = getMenu(t.fixtureCtx.configurationMenu.submenu,30200);
    let glAllocationSettings = getMenu(settingsMenu.submenu,302001);
    let optionsDropdown = await apiHandler.getGLAllocationSettingsExpense();
    let glAllocationConfig = await apiHandler.getGLAllocationConfiguration();
    let glAllocationGrid = await apiHandler.getGLAllocationGridExpense();
    
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
    //4. Click the Settings submenu
        .click(byID(settingsMenu.action_key))
    //4. Click on GL Allocation Settings
        .click(byID(glAllocationSettings.action_key))
    //5. Check the Title
        //.expect(page.title.innerText).match(insensitive(labels['ui-date-000']),'The "Page Title" was wrong', timeout)
        .expect(page.title.innerText).match(insensitive('GL Allocation Settings'),'The "Page Title" was wrong', timeout)
    //6. Check Page Elements
        .expect(glAllocationSettingPage.saveButton.exists).ok('Save button should exist')
        .expect(glAllocationSettingPage.inputFilter.exists).ok('Filter input should exist')
        .expect(glAllocationSettingPage.dropdownGL.exists).ok('GL Allocation Settings dropdown should exist')
    //7. Check Dropdown Options
        .click(glAllocationSettingPage.dropdownGL.find('i'))
        .expect(glAllocationSettingPage.dropdownGL.rows.exists).ok('GL Allocation Settings options dropdown should exist');
    await t
        .expect(await glAllocationSettingPage.checkAllOptions(optionsDropdown.items)).ok('The GL Allocation Settings options dropdown should correct')
    //8. Click on Manual Option
        .click(glAllocationSettingPage.dropdownGL.rows.nth(1))
        .click(glAllocationSettingPage.saveButton)
        .click(glAllocationSettingPage.modalConfirm.find('button'));
    await t
        .click(headerPage.plusExpense)
    if (glAllocationConfig.show_allocation_grid) {
        await t
            .expect(expensesPage.allocationTab.exists).ok('The "Allocation" tab should exist');
        if (glAllocationGrid.allocations.length > 0) {
            await t
                .expect(expensesPage.gridAllocation.exists).ok('The "Allocation" grid should exist')
                .expect(expensesPage.allocationAmountInputs.exists).ok('The allocation amount input should exist');
        }
    }
    await t
        .click(byID(glAllocationSettings.action_key))
        .expect(page.title.innerText).match(insensitive('GL Allocation Settings'), 'The "Page Title" was wrong', timeout);
    //9. Click on None Option
    await t
        .expect(glAllocationSettingPage.dropdownGL.find('i').exists).ok('GL Allocation Settings dropdown should exist')
        .click(glAllocationSettingPage.dropdownGL.find('i'))
        .click(glAllocationSettingPage.dropdownGL.rows.nth(0))
        .click(glAllocationSettingPage.saveButton)
        .click(glAllocationSettingPage.modalConfirm.find('button'));
    //10. Verify on New Expense
    await t
        .click(headerPage.plusExpense)
        .expect(expensesPage.allocationTab.exists).notOk('The "Allocation" tab should not exist');
});

test('TC 27876: Show Project Code functionality', async t => {
    let projectCodesPage = new ProjectCodesPage();
    let expensePage = new Expense();
    let reportPage = new Report();
    let headerPage = new HeaderPage();
    let expensesPage = new ExpensesPage();
    let reportsPage = new ReportsPage();
    let menues = t.fixtureCtx.menues;
    let configuration = getMenu(menues, 301);
    let reportsMenu = getMenu(menues, 102);
    let costAllocation = getMenu(configuration.submenu, 30101);
    let projectCodes = getMenu(costAllocation.submenu, 3010103);
    
    await t
    //2. Go to Corcentric Expense
    //3. Click on the Configuration menu on the left
        .click(byID(configuration.action_key))
    //4. Click on Cost Allocation 
        .click(byID(costAllocation.action_key));
    await t
    //5. Click on Project Codes
        .click(byID(projectCodes.action_key))
        .wait(4000)
    //10. verify project code display mode
    await t
        .click(projectCodesPage.dropDownButton)
        .expect(projectCodesPage.dropDownOptions.exists).ok('Option items should exists')
    //11 Select none option, project code should not be displayed on new report and new expense.
        .click(projectCodesPage.dropDownOptions.nth(0))
        .click(projectCodesPage.saveButton)
        .expect(projectCodesPage.confirmationModal.root.exists).ok('The confirm modal should be displayed')
        .click(projectCodesPage.confirmationModalSaveButton);
    await t
        .click(headerPage.plusExpense)
        .expect(expensePage.amountInput.exists).ok('Amount input should be displayed')
        .expect(expensePage.projectCodeComboBox.exists).notOk('Project code dropdown should not be displayed')
        .click(expensePage.cancelButton)
        .expect(expensesPage.allTab.exists).ok('All Tab should be displayed')
        .click(expensesPage.firstRowExpensesTable)
        .expect(expensesPage.editPencilButton.exists).ok('Edit button should be displayed')
        .click(expensesPage.editPencilButton)
        .expect(expensesPage.greenCheckButton.exists).ok('Check button should be displayed')
        .expect(expensesPage.redCancelButton.exists).ok('Cancel button should be displayed')
        .expect(expensesPage.projectCodeComboBoxEditionMode.exists).notOk('The project code dropdown should not be displayed')
        .click(expensesPage.redCancelButton);
    await t
        .click(headerPage.plusReport)
        .expect(reportPage.reportNameInput.exists).ok('Name input should be displayed')
        .expect(reportPage.projectCodeDropDown.exists).notOk('Project code dropdown should not be displayed')
        .click(reportPage.cancelButton)
        .click(byID(reportsMenu.action_key))
        .expect(reportsPage.allTab.exists).ok('Reports all tab should be displayed')
        .click(reportsPage.firstRowReportsTable)
        .expect(reportsPage.pencilEditButton.exists).ok('The pencil button should be displayed')
        .click(reportsPage.pencilEditButton)
        .expect(reportsPage.greenCheckButton.exists).ok('The green check button should be displayed')
        .expect(reportsPage.redCancelButton.exists).ok('The red cancel button should be displayed')
        .expect(reportsPage.projectCodeDropdown.exists).notOk('The project code dropdown should not be displayed')
        .click(reportsPage.redCancelButton);
    await t
        .click(byID(projectCodes.action_key))
        .expect(projectCodesPage.comboProjectCodeDisplayMode.exists).ok('Project code dropdown should be displayed')
        .click(projectCodesPage.dropDownButton)
        .expect(projectCodesPage.dropDownOptions.exists).ok('Option items should exists')
        //12 Select expense option, project code should be displayed only in new expense
        .click(projectCodesPage.dropDownOptions.nth(1))
        .click(projectCodesPage.saveButton)
        .expect(projectCodesPage.confirmationModal.root.exists).ok('The confirm modal should be displayed')
        .click(projectCodesPage.confirmationModalSaveButton);
    //13 verify on the new expense and expense library
    await t
        .click(headerPage.plusExpense)
        .expect(expensePage.amountInput.exists).ok('Amount input should be displayed')
        .expect(expensePage.projectCodeComboBox.exists).ok('Project code dropdown should be displayed')
        .click(expensePage.cancelButton)
        .expect(expensesPage.allTab.exists).ok('All Tab should be displayed')
        .click(expensesPage.firstRowExpensesTable)
        .expect(expensesPage.editPencilButton.exists).ok('Edit button should be displayed')
        .click(expensesPage.editPencilButton)
        .expect(expensesPage.greenCheckButton.exists).ok('Check button should be displayed')
        .expect(expensesPage.redCancelButton.exists).ok('Cancel button should be displayed')
        .expect(expensesPage.projectCodeComboBoxEditionMode.exists).ok('The project code dropdown should be displayed')
        .click(expensesPage.redCancelButton);
        //Verify on new report and reports library
    await t
        .click(headerPage.plusReport)
        .expect(reportPage.reportNameInput.exists).ok('Name input should be displayed')
        .expect(reportPage.projectCodeDropDown.exists).notOk('Project code dropdown should not be displayed')
        .click(reportPage.cancelButton)
        .click(byID(reportsMenu.action_key))
        .expect(reportsPage.allTab.exists).ok('Reports all tab should be displayed')
        .click(reportsPage.firstRowReportsTable)
        .expect(reportsPage.pencilEditButton.exists).ok('The pencil button should be displayed')
        .click(reportsPage.pencilEditButton)
        .expect(reportsPage.greenCheckButton.exists).ok('The green check button should be displayed')
        .expect(reportsPage.redCancelButton.exists).ok('The red cancel button should be displayed')
        .expect(reportsPage.projectCodeDropdown.exists).notOk('The project code dropdown should not be displayed')
        .click(reportsPage.redCancelButton);
    await t
        .click(byID(projectCodes.action_key))
        .expect(projectCodesPage.comboProjectCodeDisplayMode.exists).ok('Project code dropdown should be displayed')
        .click(projectCodesPage.dropDownButton)
        .expect(projectCodesPage.dropDownOptions.exists).ok('Option items should exists')
        //14 Select report option, project code should be displayed only in new report
        .click(projectCodesPage.dropDownOptions.nth(2))
        .click(projectCodesPage.saveButton)
        .expect(projectCodesPage.confirmationModal.root.exists).ok('The confirm modal should be displayed')
        .click(projectCodesPage.confirmationModalSaveButton);
    await t
        .click(headerPage.plusReport)
        .expect(reportPage.reportNameInput.exists).ok('Name input should be displayed')
        .expect(reportPage.projectCodeDropDown.exists).ok('Project code dropdown should be displayed')
        .click(reportPage.cancelButton)
        .click(byID(reportsMenu.action_key))
        .expect(reportsPage.allTab.exists).ok('Reports all tab should be displayed')
        .click(reportsPage.firstRowReportsTable)
        .expect(reportsPage.pencilEditButton.exists).ok('The pencil button should be displayed')
        .click(reportsPage.pencilEditButton)
        .expect(reportsPage.greenCheckButton.exists).ok('The green check button should be displayed')
        .expect(reportsPage.redCancelButton.exists).ok('The red cancel button should be displayed')
        .expect(reportsPage.projectCodeDropdown.exists).ok('The project code dropdown should be displayed')
        .click(reportsPage.redCancelButton);
        //verify on new expense and expenses library
    await t
        .click(headerPage.plusExpense)
        .expect(expensePage.amountInput.exists).ok('Amount input should be displayed')
        .expect(expensePage.projectCodeComboBox.exists).notOk('Project code dropdown should not be displayed')
        .click(expensePage.cancelButton)
        .expect(expensesPage.allTab.exists).ok('All Tab should be displayed')
        .click(expensesPage.firstRowExpensesTable)
        .expect(expensesPage.editPencilButton.exists).ok('Edit button should be displayed')
        .click(expensesPage.editPencilButton)
        .expect(expensesPage.greenCheckButton.exists).ok('Check button should be displayed')
        .expect(expensesPage.redCancelButton.exists).ok('Cancel button should be displayed')
        .expect(expensesPage.projectCodeComboBoxEditionMode.exists).notOk('The project code dropdown should not be displayed')
        .click(expensesPage.redCancelButton);
    await t
        .click(byID(projectCodes.action_key))
        .expect(projectCodesPage.comboProjectCodeDisplayMode.exists).ok('Project code dropdown should be displayed')
        .click(projectCodesPage.dropDownButton)
        .expect(projectCodesPage.dropDownOptions.exists).ok('Option items should exists')
        //15 Select expense+report option, project code should be displayed  in new report and new expense
        .click(projectCodesPage.dropDownOptions.nth(3))
        .click(projectCodesPage.saveButton)
        .expect(projectCodesPage.confirmationModal.root.exists).ok('The confirm modal should be displayed')
        .click(projectCodesPage.confirmationModalSaveButton);
    await t
        .click(headerPage.plusReport)
        .expect(reportPage.reportNameInput.exists).ok('Name input should be displayed')
        .expect(reportPage.projectCodeDropDown.exists).ok('Project code dropdown should be displayed')
        .click(reportPage.cancelButton)
        .click(byID(reportsMenu.action_key))
        .expect(reportsPage.allTab.exists).ok('Reports all tab should be displayed')
        .click(reportsPage.firstRowReportsTable)
        .expect(reportsPage.pencilEditButton.exists).ok('The pencil button should be displayed')
        .click(reportsPage.pencilEditButton)
        .expect(reportsPage.greenCheckButton.exists).ok('The green check button should be displayed')
        .expect(reportsPage.redCancelButton.exists).ok('The red cancel button should be displayed')
        .expect(reportsPage.projectCodeDropdown.exists).ok('The project code dropdown should be displayed')
        .click(reportsPage.redCancelButton);
    await t
        .click(headerPage.plusExpense)
        .expect(expensePage.amountInput.exists).ok('Amount input should be displayed')
        .expect(expensePage.projectCodeComboBox.exists).ok('Project code dropdown should be displayed')
        .click(expensePage.cancelButton)
        .expect(expensesPage.allTab.exists).ok('All Tab should be displayed')
        .click(expensesPage.firstRowExpensesTable)
        .expect(expensesPage.editPencilButton.exists).ok('Edit button should be displayed')
        .click(expensesPage.editPencilButton)
        .expect(expensesPage.greenCheckButton.exists).ok('Check button should be displayed')
        .expect(expensesPage.redCancelButton.exists).ok('Cancel button should be displayed')
        .expect(expensesPage.projectCodeComboBoxEditionMode.exists).ok('The project code dropdown should be displayed')
        .click(expensesPage.redCancelButton);
});

test('TC: 27901 Edit Allocation segmente', async t=>{
    let manageGLPage = new ManageGL();
    let defineGLManage = getMenu(t.fixtureCtx.generalLedger.submenu, 301172);
    let segmentName = 'segment' + uniqueId;
    let segmentNameEdited = 'segmentEdited' + uniqueId;
    let allSegments = await apiHandler.getSegments();

    await t
        //2. Go to Corcentric Expense
        //3. Click on Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on General Ledger submenu
        .click(byID(t.fixtureCtx.generalLedger.action_key))
        //5. Define GL
        .click(byID(defineGLManage.action_key));
    let arraysegmentos = [segmentName, segmentName, segmentName, segmentName, segmentName];
        let segments = await apiHandler.getSegments();
        let segmentsIDs = [];
        segments.items.forEach(element => {
            segmentsIDs.push(element.segment_id);
        });
    await apiHandler.addAllocationSegmenteRow(segmentsIDs, arraysegmentos);
    
    try {
        await t
            .typeText(manageGLPage.filterInputs.nth(0), segmentName, paste)
            .pressKey('enter')
            .expect(Selector('tr[draggable="false"] i.fa.fa-pencil').count).eql(1)
            .click(manageGLPage.editPencilButton)
            .click(manageGLPage.greenCheckButton)
            .expect(manageGLPage.newModal.exists).ok('Confirmation modal should be displayed')
            .click(manageGLPage.newModalcloseButton)
            .click(manageGLPage.editPencilButton);
        for (let i = 0; i < allSegments.total; i++) {
            await t
                .typeText(manageGLPage.rowInputs.nth(i), segmentNameEdited, {paste:true, replace: true });
        }
        await t
            .click(manageGLPage.greenCheckButton)
            .expect(manageGLPage.newModal.exists).ok('Confirmation modal should be displayed')
            .click(manageGLPage.newModalcloseButton);

        await t
            .typeText(manageGLPage.filterInputs.nth(0), segmentNameEdited, {paste:true, replace: true})
            .pressKey('enter')
            .expect(Selector('tr[draggable="false"] i.fa.fa-pencil').count).eql(1)
            .click(manageGLPage.manageGLTable.rows.find('i.fa.fa-times'))
            .expect(manageGLPage.modalConfirm.exists).ok('Confirmation modal should exist')
            .click(manageGLPage.deleteModalcloseButton);
    } catch (error) {
        let segments = await apiHandler.getSegments();
        let segment = segments.items[0].segment_id;
        let manageValues = await apiHandler.getAllValuesManagGL();
        let rowID = await manageGLPage.getRowSegmentId(segmentNameEdited, segment, manageValues);
        await apiHandler.deleteSegment(rowID);
        throw error;
    }
})

test('TC: 27968 Edition of new GL Mapping', async t => {
    let manageGLMapping = new ManageGLMapping();
    let manageGLMappingMenu = getMenu(t.fixtureCtx.generalLedger.submenu, 301173);
    let mappingName = 'TestMapping' + uniqueId;
    let mappingEditedName = 'TestMappingEdited' + uniqueId 
    await t
        //2. Go to Corcentric Expense
        //3. Click on Configuration menu on the left
        .click(byID(t.fixtureCtx.configurationMenu.action_key))
        //4. Click on General Ledger submenu
        .click(byID(t.fixtureCtx.generalLedger.action_key))
        .click(byID(manageGLMappingMenu.action_key), timeout);
    await t
        .expect(manageGLMapping.titlePage.innerText).match(insensitive('Manage GL Mappings'), 'The page title was worng', timeout)
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
        let allMaps='';
        await t
            .click(manageGLMapping.usrImportButton, timeout);
        try {
            await t
                .expect(manageGLMapping.manageGLMappingTable.exists).ok('Manage Mapping table should be displayed')
                .expect(await manageGLMapping.editMapping(mappingName)).ok('THe map should be edited')
                .typeText(manageGLMapping.mappingNameInput, mappingEditedName, { paste: true, replace: true })
                .click(manageGLMapping.usrSaveButton)
                .click(manageGLMapping.closeButton);
            allMaps = await apiHandler.getmanageGLMapping();
            await t
                .expect(await manageGLMapping.existMap(allMaps, mappingEditedName)).ok('The map should be deleted');
        } catch (err) {
            let maps = await apiHandler.getmanageGLMapping();
            let mapId = await maps.items.find(element => element.mapping_name == mappingName)
            if (mapId != null) {
                await apiHandler.deleteGLMapping(mapId.map_id);
            }
            throw err;
        }
        await t
            .expect(await manageGLMapping.deleteMapping(mappingEditedName)).ok('The new mapping should be deleted');
        allMaps = await apiHandler.getmanageGLMapping();
        await t
            .expect(await manageGLMapping.existMap(allMaps, mappingEditedName)).notOk('The map should be deleted');
    } catch (error) {
        let maps = await apiHandler.getmanageGLMapping();
        let mapId = await maps.items.find(element => element.mapping_name == mappingEditedName)
        if (mapId != null) {
            await apiHandler.deleteGLMapping(mapId.map_id);
        }
        throw error;
    }

})
test('TC: 28066 Edition of new user GL mapping default', async t => {
    let userGlDefaultMappingMenu = getMenu(t.fixtureCtx.generalLedger.submenu, 301175);
    let userGLDefaultMappingPage = new UserGLDefaultMapping();
    let mappingName = 'TestMapping' + uniqueId;
    let editMappingName = 'EditTestMapping' + uniqueId;
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
        //.expect(userGLDefaultMappingPage.title.innerText).match(insensitive(t.fixtureCtx.labels['ui-usrm-256']), 'The page title was worng', timeout)
        .typeText(userGLDefaultMappingPage.mapNameInput, mappingName, {replace:true, paste: true })
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
        //edition
        await t
            .expect(await userGLDefaultMappingPage.editMap(mappingName)).ok('The edition mode page should be displayed');
        await t
            .typeText(userGLDefaultMappingPage.mapNameInput, editMappingName, { replace: true, paste: true })
        
        await t
            .click(userGLDefaultMappingPage.saveButton)
            .click(userGLDefaultMappingPage.closeButton);
        await t
            .expect(await userGLDefaultMappingPage.existMapOnTable(editMappingName)).ok('The map should be diplayed on the table with the name edited');
        await t
            .expect(await userGLDefaultMappingPage.deleteMap(editMappingName)).ok('The map should be deleted');
    } catch (error) {
        let maps = await apiHandler.getAllImportMaps();
        let map = '';
        maps.items.find(element => {
            if (element.mapping_name == mappingName || element.mapping_name == editMappingName) {
                map = element;
            }
        });
        if (map != null) {
            await apiHandler.deleteUserDefaultImportMap(map.map_id);
        }
        throw error;
    }    
})
