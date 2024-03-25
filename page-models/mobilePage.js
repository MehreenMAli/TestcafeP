import { getPageUrl, timeout, paste, longTimeout } from '../utils/helperFunctions';
import { t } from 'testcafe';
import Page from './page';

export default class MobilePage extends Page {
	async login (username,password,landingPage) {
        await t
            .resizeWindowToFitDevice('iphone 6', {
                portraitOrientation: true
            })
            .expect(this.loginInput.exists).ok('Login could not be found',longTimeout)
            .expect(this.passwordInput.exists).ok('Password input could not be found',longTimeout)
            .typeText(this.loginInput, username, paste)
            .typeText(this.passwordInput, password, paste)
            .click(this.signInButton)
			.expect(getPageUrl()).contains(landingPage, timeout);
    }

    async changeResizeiPad(){
        await t.resizeWindowToFitDevice('iPad', {
			portraitOrientation: true
		})
    }

    async changeResizeIphone(){
        await t.resizeWindowToFitDevice('iphone 6', {
            portraitOrientation: true
        })
    }

    
}

