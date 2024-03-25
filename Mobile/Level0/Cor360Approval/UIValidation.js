import { logger, checkRequests, insensitive, timeout, checkLabels, findCor360ApprovalDocument, toTitleCase } from '../../../utils/helperFunctions';
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

let cor360appFixture = fixture`Mobile - Level 0 - Cor360 Approval - UI Validations - Running on "${args.env.toUpperCase()}"`
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

	
test(`TC 26067: \'Inbox\' Page`, async t => {

	let inboxPage = new InboxPage();
	let labels = t.fixtureCtx.labels;
	let documents = await apiHandler.getCor360ApprovalDocuments();

	await t
		//2. Go to Inbox
		//3. Check Page Title
		.expect(inboxPage.title.innerText).match(insensitive(labels['cor360-ap-000']),'The "Page Title" was wrong', timeout)
		//4. Check Page Elements
		//Dropdown.
		.expect(inboxPage.statusDropdown.exists).ok("Document's Type Dropdown should exist");

		let allDocuments = documents.total;
		let newDocuments = documents.new_docs;
		let pendedDocuments = documents.pended;
		
		//All
		let statusDropdownOptions = [`${labels['cor360-ap-005']} (${allDocuments})`];
		//New Documents
		if(newDocuments)
			statusDropdownOptions.push(`${labels['cor360-ap-006']} (${newDocuments})`);
		//Pended
		if(pendedDocuments)
			statusDropdownOptions.push(`${labels['cor360-ap-007']} (${pendedDocuments})`);

	await t
		.click(inboxPage.statusDropdown);
	await t
		.expect(await checkLabels(inboxPage.statusDropdownOptions,statusDropdownOptions)).ok("Document's Type Dropdown options are not correct")
		//Table
		.expect(inboxPage.table.exists).ok('Table with documents should exist')
		
		//5. Check Document Elements and Data
		for(let i = 0; i < documents.items.length; i++){
			await t
				.expect(await inboxPage.checkDocumentData(documents.items[i],i)).ok("Document's data was not populated correctly in table")
				.expect(inboxPage.table.rows.nth(i*3).find('button[title="View Details"]').exists).ok('View button should exist')
				.expect(inboxPage.table.rows.nth(i*3).find('button[title="Invoice"]').exists).ok('Work button should exist')
				//Date row.
				.expect(inboxPage.table.rows.nth(i*3+1).find('td').nth(0).innerText).contains(labels["cor360-ap-003"],"Date field should exist")
				//Amount row.
				.expect(inboxPage.table.rows.nth(i*3+2).find('td').nth(0).innerText).contains(labels["cor360-ap-004"],"Amount field should exist")
		}
		
});

test(`TC 26073: View Details`, async t => {

	let inboxPage = new InboxPage();
	let viewPage = new ViewPage();
	let labels = t.fixtureCtx.labels;

	let tabs = [
		labels["cor360-ap-008"], //Documents
		labels["cor360-ap-013"], //Header
		labels["cor360-ap-014"], //Line Items
		labels["cor360-ap-011"]  //Allocations
	];

	let invoice = await findCor360ApprovalDocument({docType:'I', docTypeID: 1 });
	let poRequisition = await findCor360ApprovalDocument({docType:'PR', docTypeID: 2 });

	if(invoice){
		let invoiceDetail = await apiHandler.getCor360ApprovalDocumentDetail('invoice',invoice.document_id);
		await t
			//2. Click view button on any Invoice (I)
			.expect(await inboxPage.viewDocument(invoice.document_id_display)).ok('View Details action on Invoice could not be performed')
			//3. Check Invoice Page Elements
			//Title.
			.expect(viewPage.title.innerText).match(insensitive(labels['cor360-ap-009']),'The "Page Title" was wrong', timeout)
			//Header.
			.expect(viewPage.header.innerText).contains(invoiceDetail.document_id_display)
			//Tabs.
		await t
			.expect(await checkLabels(viewPage.tabs, tabs)).ok("Invoice tabs are not correct")
			//Buttons.
			.expect(viewPage.pendIcon.exists).ok("Pend button should be displayed")
			.expect(viewPage.routeIcon.exists).ok("Route button should be displayed")
			.expect(viewPage.ccIcon.exists).ok("CC button should be displayed")
			.expect(viewPage.backIcon.exists).ok("Back button should be displayed")
			//4. Go to Inbox
			.click(viewPage.backIcon);
	}
	else{
		throw new ShortError('There are no Invoices to test');
	}
	if(poRequisition){
		let poDetail = await apiHandler.getCor360ApprovalDocumentDetail('po',poRequisition.document_id);
		await t
			.expect(await inboxPage.viewDocument(poRequisition.document_id_display)).ok('View Details action on PR could not be performed')
			//6. Check PO Requisition Page Elements
			//Title.
			.expect(viewPage.title.innerText).match(insensitive(labels['cor360-ap-068']),'The "Page Title" was wrong', timeout)
			//Header.
				.expect(viewPage.header.innerText).contains(poDetail.document_id_display);
			//Tabs.
		await t
			.expect(await checkLabels(viewPage.tabs, tabs)).ok("PO Requisition tabs are not correct")
			//Buttons.
			.expect(viewPage.pendIcon.exists).ok("Pend button should be displayed")
			.expect(viewPage.routeIcon.exists).ok("Route button should be displayed")
			.expect(viewPage.ccIcon.exists).ok("CC button should be displayed")
			.expect(viewPage.backIcon.exists).ok("Back button should be displayed");
	}
	else{
		throw new ShortError('There are no PO Requisition to test');
	}
});

test(`TC 26077: Work on Documents`, async t => {

	let inboxPage = new InboxPage();
	let workPage = new WorkPage();
	let viewPage = new ViewPage();
	let labels = t.fixtureCtx.labels;

	let tabs = [
		labels["cor360-ap-008"], //Documents
		labels["cor360-ap-013"], //Header
		labels["cor360-ap-014"], //Line Items
		labels["cor360-ap-011"]  //Allocations
	]

	let invoice = await findCor360ApprovalDocument({docType:'I', docTypeID: 1 });
	let poRequisition = await findCor360ApprovalDocument({docType:'PR', docTypeID: 2 });

	if(invoice){
		let invoiceDetail = await apiHandler.getCor360ApprovalDocumentDetail('invoice',invoice.document_id);
	await t
		//2. Click Work button on any Invoice (I)
		.wait(1000)
		.expect(await inboxPage.workOnDocument(invoice.document_id_display)).ok('Work action on Invoice could not be performed')
		//3. Check Page Elements
		//Title.
		.expect(workPage.title.innerText).match(insensitive(labels['cor360-ap-009']),'The "Page Title" was wrong', timeout)
		//Header.
		.expect(viewPage.header.innerText).contains(invoiceDetail.document_id_display)
		//Tabs.
	await t
		.expect(await checkLabels(workPage.tabs, tabs)).ok("Invoice tabs are not correct")
		//Buttons.
		.expect(workPage.approveIcon.exists).ok("Approve button should be displayed")
		.expect(workPage.rejectIcon.exists).ok("Reject button should be displayed")
		.expect(workPage.declineIcon.exists).ok("Decline button should be displayed")
		.expect(workPage.pendIcon.exists).ok("Pend button should be displayed")
		.expect(workPage.routeIcon.exists).ok("Route button should be displayed")
		.expect(workPage.ccIcon.exists).ok("CC button should be displayed")
		.expect(workPage.backIcon.exists).ok("Back button should be displayed")
		//4. Go to Inbox
		.click(workPage.backIcon);
	}else{
		throw new ShortError('There are no Invoices to test');
	}
	if(poRequisition){
	await t
		//5. Click Work button on any PO Requisition (PR)
		.expect(await inboxPage.workOnDocument(poRequisition.document_id_display)).ok('Work action on PR could not be performed')
		//6. Check Page Elements
		//Title.
		.expect(workPage.title.innerText).match(insensitive(labels['cor360-ap-068']),'The "Page Title" was wrong', timeout)
		//Header.
		.expect(viewPage.header.innerText).contains(poRequisition.document_id_display)
		//Tabs.
	await t
		.expect(await checkLabels(workPage.tabs, tabs)).ok("PO Requisition tabs are not correct")
		//Buttons.
		.expect(workPage.approveIcon.exists).ok("Approve button should be displayed")
		.expect(workPage.rejectIcon.exists).ok("Reject button should be displayed")
		.expect(workPage.declineIcon.exists).ok("Decline button should be displayed")
		.expect(workPage.pendIcon.exists).ok("Pend button should be displayed")
		.expect(workPage.routeIcon.exists).ok("Route button should be displayed")
		.expect(workPage.ccIcon.exists).ok("CC button should be displayed")
		.expect(workPage.backIcon.exists).ok("Back button should be displayed");
	}else{
		throw new ShortError('There are no PO Requisitions to test');
	}
});

test(`TC 26233: UI Validation - Invoice View Details Tabs`, async t => {

	let inboxPage = new InboxPage();
	let viewPage = new ViewPage();
	let labels = t.fixtureCtx.labels;
	let documents = await apiHandler.getCor360ApprovalDocuments();

	let invoice = documents['items'].find(element => element.document_type === 1);

	let headerTabFields = [
		labels["cor360-ap-071"], //Invoice Number
		labels["cor360-ap-015"], //Invoice Date
		labels["cor360-ap-004"], //Amount
		labels["cor360-ap-072"], //Tax Amount
		labels["cor360-ap-073"], //Description
		labels["cor360-ap-074"], //PO Number
		labels["cor360-ap-018"]  //Vendor Name
	];

	let numberDocuments = await apiHandler.getDocumentImagesNumber(invoice.document_id,'invoice');

	await t
		.wait(1000)

	//2. Click View Details button on any Invoice (I)
		.expect(await inboxPage.viewDocument(invoice.document_id_display)).ok('View Details action on Invoice could not be performed')
	
	//3. Click 'Documents' Tab and check elements
		.click(viewPage.tabs.find('label').withText(labels["cor360-ap-008"]));
	if(numberDocuments == 0){
		await t
			.expect(viewPage.labelLegend.withText(`${labels["cor360-ap-084"]}`).exists).ok('"No documents available" label is not present')
	}
	else{
		await t
			.expect(viewPage.labelLegend.withText(`${labels["cor360-ap-012"]} (${numberDocuments})`).exists).ok('Documents attached label is not present')
			.expect(viewPage.documentImage.exists).ok('Document image is not present');
	}
		
	//4. Click 'Header' Tab and check elements
	await t
		.click(viewPage.tabs.find('label').withText(labels["cor360-ap-013"]));
	await t
		.expect(await checkLabels(viewPage.labelLegend, headerTabFields)).ok('Invoice Tab fields are not correct')
		
	//5. Click 'Line Items' Tab and check elements
		.click(viewPage.tabs.find('label').withText(labels["cor360-ap-014"]));
		
	let lineItems = (await apiHandler.getLineItems(invoice.document_id)).items;

	for(let i=0, length=lineItems.length; i < length; i++){
		await t.expect(viewPage.lineItemHeader.nth(i).innerText).contains(labels['cor360-ap-075'], 'Line number header field is not correct');
		await t.expect(await checkLabels(viewPage.lineItem.nth(i).find('label.legend'), toTitleCase(lineItems[i].items),"key")).ok('Line Items Tab fields are not correct')
	}

	let allocations = (await apiHandler.getAllocationsItems(invoice.document_id)).items;
	//6. Click 'Allocations' Tab and check elements
	await t.click(viewPage.tabs.find('label').withText(labels["cor360-ap-011"]));
	for(let i = 0, length=allocations.length; i<length; i++){
		await t
			.click(viewPage.allocationItemHeader.nth(i))
			.wait(1500);
		let itemHeader = 'No ID Allocation'; //TODO localize when added.
		if (allocations[i].allocation_id)
			itemHeader = allocations[i].allocation_id;
		await t 
			.expect(viewPage.allocationItemHeader.nth(i).innerText).match(insensitive(itemHeader),'Allocation Item header is not correct')
		await t
			.expect(await checkLabels(viewPage.allocationDescription.nth(i).find('div.row'), toTitleCase(allocations[i].items),"key")).ok('Allocation Items fields are not correct')
	}	
});

test(`TC 26235: UI Validation - PO Requisition View Details Tabs`, async t => {

	let inboxPage = new InboxPage();
	let viewPage = new ViewPage();
	let labels = t.fixtureCtx.labels;
	let poRequisition = await findCor360ApprovalDocument({docType:'PR', docTypeID: 2 });

	let headerTabFields = [
		labels["cor360-ap-016"], //PO Requisition #
		labels["cor360-ap-003"], //Date
		labels["cor360-ap-018"], //Vendor Name
		labels["cor360-ap-070"]  //Requisition Total ($)
	];

	let lineItems = (await apiHandler.getPOLineitems(poRequisition.document_id)).items;
	let allocations = (await apiHandler.getAllocationsItems(poRequisition.document_id)).items;

	let numberDocumentImages = await apiHandler.getDocumentImagesNumber(poRequisition.document_id,'po');

	await t
		.wait(1000);
	
	//2. Click View Details button on any PO Requisition (PR)
	await t.expect(await inboxPage.viewDocument(poRequisition.document_id_display)).ok('View Details action on Invoice could not be performed')
		.wait(1000)
	//3. Click 'Documents' Tab and check elements
	await t	
		.click(viewPage.tabs.find('label').withText(labels["cor360-ap-008"]));

	if(numberDocumentImages == 0){
		await t
			.expect(viewPage.labelLegend.withText(`${labels["cor360-ap-084"]}`).exists).ok('"No documents available" label is not present')
	}
	else{
		await t
			.expect(viewPage.labelLegend.withText(`${labels["cor360-ap-012"]} (${numberDocumentImages})`).exists).ok('Documents attached label is not present')
			.expect(viewPage.documentImage.exists).ok('Document image is not present');
	}
	
	//4. Click 'Header' Tab and check elements
	await t
		.click(viewPage.tabs.find('label').withText(labels["cor360-ap-013"]));
	await t
		.expect(await checkLabels(viewPage.labelLegend, headerTabFields)).ok('Invoice Tab fields are not correct')
		
	//5. Click 'Line Items' Tab and check elements
		.click(viewPage.tabs.find('label').withText(labels["cor360-ap-014"]));

	for(let i=0, length=lineItems.length; i < length; i++){
		await t.expect(viewPage.lineItemHeader.nth(i).innerText).contains(labels['cor360-ap-075'], 'Line number header field is not correct');
		await t.expect(await checkLabels(viewPage.lineItem.nth(i).find('label.legend'), toTitleCase(lineItems[i].items),"key")).ok('Line Items Tab fields are not correct')
	}

	//6. Click 'Allocations' Tab and check elements
	await t.click(viewPage.tabs.find('label').withText(labels["cor360-ap-011"]));
	for(let i = 0, length=allocations.length; i<length; i++){
		await t
			.click(viewPage.allocationItemHeader.nth(i))
			.wait(1500);
		let itemHeader = 'No ID Allocation'; //TODO localize when added.
		if (allocations[i].allocation_id)
			itemHeader = allocations[i].allocation_id;
		await t
			.expect(viewPage.allocationItemHeader.nth(i).innerText).match(insensitive(itemHeader),'Allocation Item header is not correct')
		await t
			.expect(await checkLabels(viewPage.allocationDescription.nth(i).find('div.row'), toTitleCase(allocations[i].items),"key")).ok('Allocation Items fields are not correct')
	}	
});

p_Test(26326, `TC 26326: UI Validation - Work Action buttons`, async t => {
	let inboxPage = new InboxPage();
	let workPage = new WorkPage();
	let labels = t.fixtureCtx.labels;
	let params = t.fixtureCtx.params;
	let document = await findCor360ApprovalDocument({ docType: params["DocType"] });

	await t
		.wait(1000)
	
	//2. Click Work button on first @DocumentType in @State
		.expect(await inboxPage.workOnDocument(document.document_id_display)).ok('Work action on Document could not be performed')
	
	//3. Click Approve button
		.click(workPage.approveIcon)
		.expect(workPage.approveHeaderTitle.innerText).contains(labels['cor360-ap-066'],'Approve Invoice header title is not present')
		.expect(workPage.closeButton.exists).ok('Close (X) button is not present')
		.expect(workPage.approveLabel.innerText).contains(labels['cor360-ap-064'],'Approve Label is not present')
		.expect(workPage.button.withText(insensitive(labels['cor360-ap-065'])).exists).ok('Approve button is not present')
		.expect(workPage.button.withText(insensitive(labels['cor360-ap-051'])).exists).ok('Cancel button is not present')
	
	//4. Click Cancel button
		.click(workPage.closeButton)
		
	//5. Click Reject button
		.click(workPage.rejectIcon)
		.expect(workPage.actionTitle.withText(labels['cor360-ap-043']).exists).ok('Reject title is not present')
		.expect(workPage.label.withText(labels['cor360-ap-044']).exists).ok('User Selection Mode label is not present')
		.expect(workPage.historicalUsersDropdown.exists).ok('Historical Users dropdown is not present')
		.expect(workPage.label.withText(labels['cor360-ap-045']).exists).ok('Activity and User label is not present')
		.expect(workPage.activityUserDropdown.exists).ok('Activity and User dropdown is not present')
		.expect(workPage.label.withText(labels['cor360-ap-048']).exists).ok('Comment label is not present')
		.expect(workPage.rejectComment.exists).ok('Comment text area is not present')
		.expect(workPage.label.withText(labels['cor360-ap-045']).exists).ok('Activity and User label is not present')
		.expect(workPage.button.withText(labels['cor360-ap-052']).exists).ok('Ok button is not present')
		.expect(workPage.button.withText(labels['cor360-ap-051']).exists).ok('Cancel button is not present')
	
	//6. Click Decline button
		.click(workPage.declineIcon)
		.expect(workPage.actionTitle.withText(labels['cor360-ap-049']).exists).ok('Decline title is not present')
		.expect(workPage.label.withText(labels['cor360-ap-048']).exists).ok('Comment label is not present')
		.expect(workPage.declineComment.exists).ok('Comment text area is not present')
		.expect(workPage.label.withText(labels['cor360-ap-050']).exists).ok('Decline Reason label is not present')
		.expect(workPage.invalidChargeDropdown.exists).ok('Invalid Charge dropdown is not present')
		.expect(workPage.button.withText(labels['cor360-ap-052']).exists).ok('Ok button is not present')
		.expect(workPage.button.withText(labels['cor360-ap-051']).exists).ok('Cancel button is not present')
		.click(workPage.declineIcon)

	//7. Click Pend button
		.click(workPage.pendIcon)
		.expect(workPage.actionTitle.withText(labels['cor360-ap-055']).exists).ok('Pend title is not present')
		.expect(workPage.text.withText(labels['cor360-ap-056']).exists &&
				workPage.text.withText(labels['cor360-ap-057']).exists).ok('Pend Item Days label is not present')
		.expect(workPage.label.withText(labels['cor360-ap-048']).exists).ok('Comment label is not present')
		.expect(workPage.pendComment.exists).ok('Comment text area is not present')
		.expect(workPage.label.withText(labels['cor360-ap-058']).exists).ok('Pend Reason label is not present')
		.expect(workPage.pendReasonDropdown.exists).ok('Pend Reason dropdown is not present')
		.expect(workPage.button.withText(labels['cor360-ap-052']).exists).ok('Ok button is not present')
		.expect(workPage.button.withText(labels['cor360-ap-051']).exists).ok('Cancel button is not present')
		
	//8. Click Route button
		.click(workPage.routeIcon)
		.expect(workPage.actionTitle.withText(labels['cor360-ap-059']).exists).ok('Route title is not present')
		.expect(workPage.label.withText(labels['cor360-ap-060']).exists).ok('Route Type label is not present')
		.expect(workPage.routeToUserDropdown.exists).ok('Route To User dropdown is not present')
		.expect(workPage.label.withText(labels['cor360-ap-061']).exists).ok('Route Item To label is not present')
		.expect(workPage.selectUserDropdown.exists).ok('Select User dropdown is not present')
		.expect(workPage.label.withText(labels['cor360-ap-048']).exists).ok('Comment label is not present')
		.expect(workPage.routeComment.exists).ok('Comment text area is not present')
		.expect(workPage.button.withText(labels['cor360-ap-052']).exists).ok('Ok button is not present')
		.expect(workPage.button.withText(labels['cor360-ap-051']).exists).ok('Cancel button is not present')
	
	//9. Click CC button
		.click(workPage.ccIcon)
		.expect(workPage.actionTitle.withText(labels['cor360-ap-067']).exists).ok('CC title is not present')
		.expect(workPage.label.withText(labels['cor360-ap-060']).exists).ok('Route Type label is not present')
		.expect(workPage.copyToUserDropdown.exists).ok('Copy To User dropdown is not present')
		.expect(workPage.label.withText(labels['cor360-ap-062']).exists).ok('Type To Filter label is not present')
		.expect(workPage.filterInput.exists).ok('Type To Filter input is not present')
		.expect(workPage.label.withText(labels['cor360-ap-063']).exists).ok('Copy Item To label is not present')
		.expect(workPage.leftUserList.exists).ok('Left User Options List is not present')
		.expect(workPage.rightUserList.exists).ok('Right User Options List is not present')
		.expect(workPage.leftArrow.exists).ok('Left Arrow is not present')
		.expect(workPage.rightArrow.exists).ok('Right Arrow is not present')
		.expect(workPage.label.withText(labels['ui-cm-011']).exists).ok('Add label is not present')
		.expect(workPage.label.withText(labels['ui-cm-012']).exists).ok('Remove label is not present')
		.expect(workPage.label.withText(labels['cor360-ap-048']).exists).ok('Comment label is not present')
		.expect(workPage.ccComment.exists).ok('Comment text area is not present')
		.expect(workPage.button.withText(labels['cor360-ap-052']).exists).ok('Ok button is not present')
		.expect(workPage.button.withText(labels['cor360-ap-051']).exists).ok('Cancel button is not present')
	
	//10. Click Close button
		.click(workPage.backIcon)
		.expect(inboxPage.title.innerText).match(insensitive(labels['cor360-ap-000']),'Inbox Page was not displayed', timeout);

});

p_Test(26558, `TC 26558: UI Validation - View Details Action buttons`, async t => {
	let inboxPage = new InboxPage();
	let viewPage = new ViewPage();
	let labels = t.fixtureCtx.labels;
	let params = t.fixtureCtx.params;
	let document = await findCor360ApprovalDocument({ docType: params["DocType"] });
	
	await t
		.wait(1000)
	
	//2. Click View Details button on first @DocumentType in @State
		.expect(await inboxPage.viewDocument(document.document_id_display)).ok('View Details action on Document could not be performed')

	//3. Click Pend button
		.click(viewPage.pendIcon)
		.expect(viewPage.actionTitle.withText(labels['cor360-ap-055']).exists).ok('Pend title is not present')
		.expect(viewPage.text.withText(labels['cor360-ap-056']).exists &&
				viewPage.text.withText(labels['cor360-ap-057']).exists).ok('Pend Item Days label is not present')
		.expect(viewPage.label.withText(labels['cor360-ap-048']).exists).ok('Comment label is not present')
		.expect(viewPage.pendComment.exists).ok('Comment text area is not present')
		.expect(viewPage.label.withText(labels['cor360-ap-058']).exists).ok('Pend Reason label is not present')
		.expect(viewPage.pendReasonDropdown.exists).ok('Pend Reason dropdown is not present')
		.expect(viewPage.button.withText(labels['cor360-ap-052']).exists).ok('Ok button is not present')
		.expect(viewPage.button.withText(labels['cor360-ap-051']).exists).ok('Cancel button is not present')
	
	//4. Click Route button
		.click(viewPage.routeIcon)
		.expect(viewPage.actionTitle.withText(labels['cor360-ap-059']).exists).ok('Route title is not present')
		.expect(viewPage.label.withText(labels['cor360-ap-060']).exists).ok('Route Type label is not present')
		.expect(viewPage.routeToUserDropdown.exists).ok('Route To User dropdown is not present')
		.expect(viewPage.label.withText(labels['cor360-ap-061']).exists).ok('Route Item To label is not present')
		.expect(viewPage.selectUserDropdown.exists).ok('Select User dropdown is not present')
		.expect(viewPage.label.withText(labels['cor360-ap-048']).exists).ok('Comment label is not present')
		.expect(viewPage.routeComment.exists).ok('Comment text area is not present')
		.expect(viewPage.button.withText(labels['cor360-ap-052']).exists).ok('Ok button is not present')
		.expect(viewPage.button.withText(labels['cor360-ap-051']).exists).ok('Cancel button is not present')

	//5. Click CC button
		.click(viewPage.ccIcon)
		.expect(viewPage.actionTitle.withText(labels['cor360-ap-067']).exists).ok('CC title is not present')
		.expect(viewPage.label.withText(labels['cor360-ap-060']).exists).ok('Route Type label is not present')
		.expect(viewPage.copyToUserDropdown.exists).ok('Copy To User dropdown is not present')
		.expect(viewPage.label.withText(labels['cor360-ap-062']).exists).ok('Type To Filter label is not present')
		.expect(viewPage.filterInput.exists).ok('Type To Filter input is not present')
		.expect(viewPage.label.withText(labels['cor360-ap-063']).exists).ok('Copy Item To label is not present')
		.expect(viewPage.leftUserList.exists).ok('Left User Options List is not present')
		.expect(viewPage.rightUserList.exists).ok('Right User Options List is not present')
		.expect(viewPage.leftArrow.exists).ok('Left Arrow is not present')
		.expect(viewPage.rightArrow.exists).ok('Right Arrow is not present')
		.expect(viewPage.label.withText(labels['ui-cm-011']).exists).ok('Add label is not present')
		.expect(viewPage.label.withText(labels['ui-cm-012']).exists).ok('Remove label is not present')
		.expect(viewPage.label.withText(labels['cor360-ap-048']).exists).ok('Comment label is not present')
		.expect(viewPage.ccComment.exists).ok('Comment text area is not present')
		.expect(viewPage.button.withText(labels['cor360-ap-052']).exists).ok('Ok button is not present')
		.expect(viewPage.button.withText(labels['cor360-ap-051']).exists).ok('Cancel button is not present')

	//6. Click Close button
		.click(viewPage.backIcon)
		.expect(inboxPage.title.innerText).match(insensitive(labels['cor360-ap-000']),'Inbox Page was not displayed', timeout);
});