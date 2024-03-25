import { logger, checkRequests, insensitive, timeout, checkLabels, findCor360ApprovalDocument, toTitleCase, paste } from '../../../utils/helperFunctions';
import { parseArguments } from './../../../utils/parseArguments';
import { before, after } from '../../../hooks';
import config from '../../../config';
import users from '../../../users';
import MobilePage from '../../../page-models/mobilePage';
import InboxPage from '../../../page-models/cor360approval/inboxPage';
import WorkPage from '../../../page-models/Cor360Approval/workPage';
import ViewPage from '../../../page-models/Cor360Approval/viewPage';
import APIHandler from '../../../utils/apiHandler';
import { loadFixture } from '../../../tests-manager/categorization';
import { p_Test } from '../../../tests-manager/parameterization';
import Localizator from '../../../utils/localizator';
import ShortError from '../../../error-types/shortError';

const localizator = new Localizator();
process.removeAllListeners('unhandledRejection');

const page = new MobilePage();
const args = parseArguments();
const apiHandler = new APIHandler();
const category = {
	id: 3601,
	name: "Cor360 Approval"
};

let cor360appFixture = fixture`Mobile - Level 1 - Cor360 Approval - UI Validations - Running on "${args.env.toUpperCase()}"`
	.page(config[args.env].baseUrl)
	.requestHooks(logger)
	.before(async ctx  => {
		await before();
		ctx.labels = await localizator.getLabelsAsJson('cor360-ap-0*,ui-cm-0*');
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


loadFixture(users[args.user],category,cor360appFixture);

test('TC 26777: Validate Route action on Invoice', async t => {
    let inboxPage = new InboxPage();
    let viewPage = new ViewPage();
    let USER_IN_COMPANY = "USERS_PROFILE";

    let document = await findCor360ApprovalDocument({ docType: "I" });
    let routeTypes = await apiHandler.getCor360RouteTypes();
    let userInCompany = routeTypes.items.find(element => element.key === USER_IN_COMPANY);

    if(document){
        //2. Click Work icon on any Invoice
        await t
            .wait(1000)
            .expect(await inboxPage.viewDocument(document.document_id_display)).ok('View Details action on Document could not be performed')
        
        //3. Click on Route option
            .click(viewPage.routeIcon)

        //4. Select "Route to User in Company" in "Route Type"
            .click(viewPage.routeToUserDropdown)
            .click(viewPage.dropdownOptions.withText(userInCompany.text))
            
        //5. Select first User in "Route Item To"
            .click(viewPage.selectUserDropdown)
            .click(viewPage.dropdownOptions.nth(1))

        //6. Complete "Comment" area with "Test Route"
            .typeText(viewPage.routeComment,"Test Route",paste)

        //7. Click on Ok button
            .click(viewPage.routeOkButton)
            .wait(1000);

        //8. Validate Route action
        await t
            .expect(await inboxPage.findDocument(document.document_id_display)).notOk('Document was not routed');
    }
    else {
        throw new ShortError('There are no Invoices to test');
    }
    
});

test('TC 27391: Validate Route action on PR', async t => {
    let inboxPage = new InboxPage();
    let viewPage = new ViewPage();
    let USER_IN_COMPANY = "USERS_PROFILE";

    let document = await findCor360ApprovalDocument({ docType: "PR" });
    let routeTypes = await apiHandler.getCor360RouteTypes();
    let userInCompany = routeTypes.items.find(element => element.key === USER_IN_COMPANY);
    
    if(document){
        //2. Click Work icon on any PO Requisition
        await t
            .wait(1000)
            .expect(await inboxPage.viewDocument(document.document_id_display)).ok('View Details action on Document could not be performed')
            
        //3. Click on Route option
            .click(viewPage.routeIcon)
        
        //4. Select "Route to User in Company" in "Route Type"
            .click(viewPage.routeToUserDropdown)
            .click(viewPage.dropdownOptions.withText(userInCompany.text))
            
        //5. Select first User in "Route Item To"
            .click(viewPage.selectUserDropdown)
            .click(viewPage.dropdownOptions.nth(1))
        
        //6. Complete "Comment" area with "Test Route"
            .typeText(viewPage.routeComment,"Test Route",paste)

        //7. Click on Ok button
            .click(viewPage.routeOkButton)
            .wait(1000);

        //8. Validate Route action
        await t
            .expect(await inboxPage.findDocument(document.document_id_display)).notOk('Document was not routed');
    }
    else {
        throw new ShortError('There are no PO Requisitions to test');
    }
});
	
p_Test(27370, `TC 27370: Validate Pend action on Document`, async t => {

	let inboxPage = new InboxPage();
    let viewPage = new ViewPage();
    let params = t.fixtureCtx.params;
    let labels = t.fixtureCtx.labels;

    let remarks = "Test Pend";
    let document = await findCor360ApprovalDocument({ docType: params["DocType"], docStatus: "new" });
    
    if(document){
        //2. Click View Details icon on any @DocType document on New state
        await t
            .wait(1000)
            .expect(await inboxPage.viewDocument(document.document_id_display)).ok('View Details action on Document could not be performed')
            
        //3. Click on Pend button
            .click(viewPage.pendIcon)
        
        //4. Complete fields
            .typeText(viewPage.pendComment, remarks, paste)
            
        //5. Click Ok button
            .click(viewPage.pendOkButton);
        
        //6. Validate Pend action
        await t
            .expect(await inboxPage.findDocument(document.document_id_display)).ok('Pended action was not performed correctly')
        //Filter by Pended
            .click(inboxPage.statusDropdown)
            .click(inboxPage.statusDropdownOptions.withText(labels['cor360-ap-002']));
        await t
            .expect(await inboxPage.findDocument(document.document_id_display)).ok('Pended document was not found after filtering')
    }
    else {
        throw new ShortError(`There are no documents of type ${params["DocType"]} on new state to test`);
    }
});

p_Test(26724, `TC 26724: Validate Reject action on Document`, async t => {

	let inboxPage = new InboxPage();
    let workPage = new WorkPage();
    let params = t.fixtureCtx.params;
    let labels = t.fixtureCtx.labels;

    let comment = "Test Reject";
    let document = await findCor360ApprovalDocument({ docType: params["DocType"] });

    //2. Click ‘Work’ on any document with @DocType
    await t
        .wait(1000)
        .expect(await inboxPage.workOnDocument(document.document_id_display)).ok('Work action on Document could not be performed')
        
    //3. Click on "Reject" button
        .click(workPage.rejectIcon)
    
    //4. Select first option on "User Selection Mode"
    //Already selected
        
    //5. Select first option on "Activity and User"
    //Already selected
    
    //6. Complete with a comment
        .typeText(workPage.rejectComment,comment,paste)

    //7. Press "Ok" button
        .click(workPage.rejectOkButton)
    await t
        .expect(await inboxPage.findDocument(document.document_id_display)).notOk('Reject action was not performed correctly');
});

p_Test(26749, `TC 26749: Validate Copy action on Document`, async t => {

	let inboxPage = new InboxPage();
    let viewPage = new ViewPage();
    let params = t.fixtureCtx.params;
    let routeTypes = (await apiHandler.getCor36CCRouteTypes()).items;
    let userInCompany = routeTypes.find(element => element.key === 'USERS_PROFILE');
    let comment = "Test CC";

    let document = await findCor360ApprovalDocument({ docType: params["DocType"] });
    
    if(document){
        //2. Click View Details icon on any @DocType document on New state
        await t
            .wait(1000)
            .expect(await inboxPage.viewDocument(document.document_id_display)).ok('View Details action on Document could not be performed')
            
        //3. Click on CC button
            .click(viewPage.ccIcon)
        
        //4. Complete fields
            //Route Type.
            .click(viewPage.copyToUserDropdown)
            .click(viewPage.dropdownOptions.withText(userInCompany.text))
            //Copy Item To
            .click(viewPage.filterInput)
            .click(viewPage.mobileDropdownOptions.nth(0))
            .typeText(viewPage.ccComment,comment,paste)
            
        //5. Click Ok button
            .click(viewPage.ccOkButton);
    }
    else {
        throw new ShortError(`There are no documents of type ${params["DocType"]} to test`);
    }
});

p_Test(27492, `TC 27492: Validate Approve action on Document`, async t => {
    //Test is skipped because approve action could return 405 response and the test fails although it
    //is a valid behavior. Check response codes handling.

	let inboxPage = new InboxPage();
    let workPage = new WorkPage();
    let params = t.fixtureCtx.params;
    let labels = t.fixtureCtx.labels;

    //2. Click Work icon on any @DocType document
    let document = await findCor360ApprovalDocument({ docType: params["DocType"] });
    await t
        .wait(1000)
        .expect(await inboxPage.workOnDocument(document.document_id_display)).ok('Work action on Document could not be performed')
        
    //3. Click on Approve icon
        .click(workPage.approveIcon)
    
    //4. Click "Approve" button
        .click(workPage.button.withText(insensitive(labels['cor360-ap-065'])))
        .expect(inboxPage.title.exists).ok('Inbox was not displayed after approve action.');
});

p_Test(27493, `TC 27493: Validate Decline action on Document`, async t => {
    //Test is skipped because approve action could return 405 response and the test fails although it
    //is a valid behavior. Check response codes handling.

	let inboxPage = new InboxPage();
    let workPage = new WorkPage();
    let params = t.fixtureCtx.params;
    let labels = t.fixtureCtx.labels;

    const declineComment = "Test Decline";

    //2. Click Work icon on any @DocType document
    let document = await findCor360ApprovalDocument({ docType: params["DocType"] });
    await t
        .wait(1000)
        .expect(await inboxPage.workOnDocument(document.document_id_display)).ok('Work action on Document could not be performed')
        
    //3. Click on Decline icon
        .click(workPage.declineIcon)
    
    //4. Complete decline Comment with "Test Decline"
        .typeText(workPage.declineComment,declineComment,paste)

    //5. Select "Invalid Charge" on Decline Reason
        //Already done

    //6. Click Ok button
        .click(workPage.declineOkButton);
    await t
        .expect(await inboxPage.findDocument(document.document_id_display)).notOk('Document is still present on Inbox');
});