import { insensitive, timeout, checkRequests, logger } from '../../utils/helperFunctions';
import { parseArguments } from './../../utils/parseArguments';
import { before, after, registerFixture } from '../../hooks';
import users from '../../users';
import config from '../../config';
import Page from '../../page-models/page';
import UserDropdown from '../../page-models/userDropdown';
import MyAccountPage from '../../page-models/myAccountPage';
import InfoModal from '../../page-models/infoModal';
import ConfirmModal from '../../page-models/confirmModal';
import HeaderPage from '../../page-models/headerPage';
import APIHandler from '../../utils/apiHandler';
import Localizator from'../../utils/localizator';

const localizator = new Localizator();
const page = new Page();
const userDropdown = new UserDropdown();
const myAccountPage = new MyAccountPage();
const args = parseArguments();
const apiHandler = new APIHandler();

registerFixture();
fixture `Level 1 - General - UI Changes - Running on "${args.env.toUpperCase()}"`
    .page(config[args.env].baseUrl)
    .requestHooks(logger)
    .before(async ctx  => {
        await before();
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

test(`TC 25602: Profile Picture Changes`, async t => {
    let originalImage = await apiHandler.getUserPicture();
    let confirmModal = new ConfirmModal();
    await t
        //2. Click on the User profile picture
        .click(userDropdown.toggle)
        //3. Select the "My Account" option
        .click(userDropdown.myAccount)
        //5. Click the "Upload" button - 6. Select a new profile picture
        .setFilesToUpload(myAccountPage.uploadFileInput, '../../mock-files/newpicture.png');
        await t
        //6. Click "Save" and accept the info modal
        .click(myAccountPage.saveButton)
        .click(confirmModal.closeButton);
        //7. Check the new profile picture
    let newImage = await apiHandler.getUserPicture();
        //8. Restore the profile picture 
    await t
        .expect(originalImage).notEql(newImage,'The new image should be different to the original one')
        .clearUpload(myAccountPage.uploadFileInput)
        .setFilesToUpload(myAccountPage.uploadFileInput, '../../mock-files/originalpicture.png')
        .click(myAccountPage.saveButton)
        .click(confirmModal.closeButton);
    newImage = await apiHandler.getUserPicture();
    await t.expect(originalImage).eql(newImage,'The original image should be restored');
});

test(`TC 25628: Language Changes`, async t => {
    let languageToChange = 'es-AR';
    let currentLanguage = apiHandler.culture;
    let infoModal = new InfoModal();
    let headerPage = new HeaderPage();

    await t
        //2. Click on the User profile picture
        .click(userDropdown.toggle)
        //3. Select the "My Account" option
        .click(userDropdown.myAccount)
        //4. Click on the "Language" tab
        .click(myAccountPage.profileLanguageTab)
        //5. Depending on the current language, select another one
        .click(myAccountPage.languageDropdown);
    if (currentLanguage==='es-AR'){
        languageToChange = 'en-US';
        await t.click(myAccountPage.languageDropdownEnglish);
    }
    else
        await t.click(myAccountPage.languageDropdownSpanish);
    
    let welcomeMessage = await localizator.getLabels('ui-cm-005',languageToChange);
    
    await t
        //6. Click the "Save" button
        .click(myAccountPage.saveButton)
        //7. Close the modal
        .click(infoModal.closeButton)
        //8. Go to the Apps dashboard to check if the language has changed
        .click(headerPage.logoIcon)
        .expect(page.title.innerText).match(insensitive(welcomeMessage[0].Label),'The Language was not changed properly',timeout)
        //9. Go back to "My Account" and restore the language
        .click(userDropdown.toggle)
        .click(userDropdown.myAccount)
        .click(myAccountPage.profileLanguageTab)
        .click(myAccountPage.languageDropdown);
        if (currentLanguage==='es-AR')
            await t.click(myAccountPage.languageDropdownSpanish);
        else
            await t.click(myAccountPage.languageDropdownEnglish);
        welcomeMessage = await localizator.getLabels('ui-cm-005',currentLanguage);

    await t
        //10. Go to the Apps dashboard and check if the language was successfully restored
        .click(myAccountPage.saveButton)
        .click(infoModal.closeButton)
        .click(headerPage.logoIcon)
        .expect(page.title.innerText).match(insensitive(welcomeMessage[0].Label),'The Language was not changed properly',timeout);
});