import { Selector } from 'testcafe';
import Report from '../../../page-models/tem/report';
import Expense from '../../../page-models/tem/expense';
import ExpensesLibraryModal from '../../../page-models/tem/expensesLibraryModal';
import { paste, getVariable, getMenu, checkRequests, logger, timeout } from '../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from '../../../hooks';
import users from '../../../users';
import config from '../../../config';
import APIHandler from '../../../utils/apiHandler';
import { loadFixture } from '../../../tests-manager/categorization';
import Localizator from '../../../utils/localizator';
import MobilePage from '../../../page-models/mobilePage';
import ConfirmModal from '../../../page-models/confirmModal';
import ExpensesPage from '../../../page-models/tem/expensesPage';
import UploadingModal from '../../../page-models/uploadingModal';
import ReceiptsPage from '../../../page-models/tem/receiptsPage';

const localizator = new Localizator();
const uniqueId = Date.now().toString();
const dashboardTitles = Selector('div[class=title]');
const page = new MobilePage();
const args = parseArguments();
const expense = new Expense();
const report = new Report();
const expensesLibraryModal = new ExpensesLibraryModal();
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
        ctx.labels = await localizator.getLabelsAsJson('ui-00-0*,ui-cm-01*,msg-00-002,msg-00-012,msg-00-013,ui-usr-0*,ui-cm-0*');
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
        await checkRequests(logger.requests);
    });

loadFixture(users[args.user],category,temFixture);

//TODO: Wait TEM-2076
test.skip('TC 27327: Mobile - Report Creation', async t => {
    let reportName = 'Test Report '+uniqueId;
    let reportNameTrunc = reportName.substring(0,19);
    let businessPurpose = 'UI Testing';
    let requiredField = t.fixtureCtx.labels['msg-00-002'];
    let biggerThanField = t.fixtureCtx.labels['msg-00-012'];
    let minorThanField = t.fixtureCtx.labels['msg-00-013'];

    await t
        //2. Click on "Corcentric Expense"
        .click(dashboardTitles.withText(t.fixtureCtx.app))
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
    await t
        //14. Click the "Save" button
        .click(report.saveButton)
        //15. Check the Report page UI
        .expect(page.title.innerText).eql(reportName)
        .expect(report.reportName.innerText).contains(reportName)
        .expect(report.businessPurpose.innerText).contains(businessPurpose)
        .expect(report.detailsfromDate.innerText).contains('01')
        .expect(report.detailstoDate.innerText).contains(day)
        //16. Insert a Comment in the "Add Comment" textarea
        .click(report.commentDetail)
        .typeText(report.textArea,'Comment '+reportName,paste)
        .expect(report.textArea.value).eql('Comment '+reportName)
        //17. Click the "Reset" button
        .click(report.resetButton)
        //18. Insert a Comment in the "Add Comment" textarea        
        .typeText(report.textArea,'Comment '+reportName,paste)
        //19. Click the "Post" button 
        .click(report.postButton)
        .click(report.commentBack);
    await t
        .expect(report.noteItem.exists).ok('The comment item should be displayed')
        .expect(report.noteItem.innerText, timeout).contains('Comment '+reportName)
        //21. Click the "Add Expense" button
        .click(report.addExpenseButton)
        //22. Click "Cancel" in the "Add Expense" section
        .click(expense.cancelButton)
        //23. Click "Select from Library"
        .click(report.selectFromLibraryButtonPhone)
        //24. Check library elements
        .expect(expensesLibraryModal.expenseLibraryTable.exists).ok('The "Elements" form should exist')
        .expect(expensesLibraryModal.addExpenseToReportButton.exists).ok('The "Add" expense button should exist')
        .expect(expensesLibraryModal.cancelExpenseToReportButton.exists).ok('The "Cancel" expense button should exist')
        .click(expensesLibraryModal.expenseLibraryTable.rows.nth(1).find('td input'))
        //25. Click "Add expense to Report"
        .click(expensesLibraryModal.addExpenseToReportButton)
        .wait(1000)
        .expect(report.reportName.innerText).eql(reportName,"Report Name was not correctly displayed");
});

test('TC 27328: Mobile - Expense Creation', async t => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    let confirmModal = new ConfirmModal();
    let expensesPage = new ExpensesPage();
    let uploadingModal = new UploadingModal();
    let purposeExpend = 'Purpose '+uniqueId;

    let menues = t.fixtureCtx.menues;
    await t
    //2. Go to "Corcentric Expense"
        .click(dashboardTitles.withText(t.fixtureCtx.app))
    
    //3. Click on "Add an Expense"
        .click(dashboardTitles.withText(t.fixtureCtx.labels['ui-00-032']))

    //4. Choose @date in the "Date" input

    //5. Insert @amount in the "Amount" input
        .expect(expense.amountInput.exists).ok('The amount input should be displayed')
        .typeText(expense.amountInput,'12',paste)

    //6. Select any category in the "Category" dropdown

    //7. Insert @businessPurpose in the "Business Purpose" textarea
        .typeText(expense.businessPurposeTextarea,purposeExpend,paste)

    //8. Insert @comment in the "Comment" textarea
        .typeText(expense.commentTextarea,'Comment '+uniqueId,paste)
        .expect(expense.commentTextarea.value).eql('Comment '+uniqueId)

    //9. Click the "Add receipt" button
        .click(expense.addReceiptButton)

    //10. Click the "Upload" button and select a mock receipt
        .setFilesToUpload(expense.fileUpload, './../../../mock-files/testReceipt.jpg')
        .click(uploadingModal.doneButton)

    //11. Close the "Receipts" modal
        .click(expense.saveButton);

    //12. Click first row to see Expense Details
    let row = await expensesPage.allTable.getRow(2);
    await t
        .click(expensesPage.allTable.rows.nth(2))

    //13. Validate the Expense Details data
        .expect(expense.expanseDetailLabel.withText(today)).ok('The "Date" should be Today')
        .expect(expense.expanseDetailLabel.withText('')).ok('The "Report" should be empty')
        .expect(expense.expanseDetailLabel.withText(purposeExpend)).ok('The "Business Purpose" should be the one entered recently')
        .expect(expense.expanseDetailLabel.withText('$12.00')).ok('The "Amount" should be $12.00')
        .expect(expense.expanseDetailLabel.withText('')).ok('The "Project Code" should be empty');
});

test('TC 27330: Mobile - Receipt Creation/Removal', async t => {
    let receiptsPage = new ReceiptsPage();
    let menues = t.fixtureCtx.menues;
    let receipts = getMenu(menues,104);
    
    //2. Go to "Corcentric Expense"
    await t
        .click(dashboardTitles.withText(t.fixtureCtx.app))
    
    //3. Click on Add a Receipt
        .click(dashboardTitles.withText(t.fixtureCtx.labels['ui-00-033']))
        
    //4. Select file to upload from @FilePath
        .expect(receiptsPage.uploadInput.exists).ok('The "Upload" input should exist')
        .setFilesToUpload(receiptsPage.uploadInput, './../../../mock-files/testReceipt.jpg')
        .wait(5000)
    
    //5. Delete Receipts    
        .click(receiptsPage.firstDeleteButton)
        .click(receiptsPage.modalDeleteConfirm.find('button'))
        .wait(2000);
});