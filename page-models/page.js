import { Selector, t } from 'testcafe';
import UserDropdown from './userDropdown';
import { paste, longTimeout, getPageUrl, refresh } from '../utils/helperFunctions';


export default class Page {
    constructor () {
        this.userDropdown = new UserDropdown();
        this.loginInput = Selector('input').withAttribute('placeholder','Username');
        this.passwordInput = Selector('input').withAttribute('placeholder','Password');
        this.signInButton = Selector('.btn-login-primary');
        this.title = Selector('#breadcrumb-title');
    }
    
    async login (username,password,landingPage) {
        await t
            .maximizeWindow()
            .expect(this.loginInput.exists).ok('Login could not be found',longTimeout)
            .expect(this.passwordInput.exists).ok('Password input could not be found',longTimeout)
            .typeText(this.loginInput, username, paste)
            .typeText(this.passwordInput, password, paste)
            .click(this.signInButton)
            .expect(getPageUrl()).contains(landingPage, "The Login page took too long", longTimeout);

        await this.navigateToApplication();
    }

    async logout () {
        await t.navigateTo('about:blank');
        refresh();
    }

    async navigateToApplication () {
        if(t.fixtureCtx.apps){
            let appsCount = t.fixtureCtx.apps.length;
            
            if(appsCount > 1){
                let dashboardTitles = Selector('div[class=title]');
                await t
                    .click(dashboardTitles.withText(t.fixtureCtx.app))
            }
        }
    }

    async setTestSpeed(value) {
        await t.setTestSpeed(0.2);
    }

}