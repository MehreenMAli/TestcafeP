import { Selector } from "testcafe";

export default class SSAHeaderPage {
    constructor() {
        this.header = Selector('header.navbar');
        this.corsLogo = Selector('#navbar-brand');
        this.titleApp = Selector('span.app-selected'); 
        this.newAnalysisButton = Selector('#btnAddAnalysis');
        this.ssaHomeButton = Selector('#btnSSAHome');
        this.ssaAnalysisListButton = Selector('#btnSSAAnalysisList');
        this.ssaContacButton = Selector('#btnSSAContact');
        this.userProfile = Selector('li.nav-item.profile.dropdown');

        this.ssaMobileContacButton = Selector('#btnSSAContactMobile');
        this.ssaMobileAnalysisList = Selector('#btnSSAAnalysisListMobile');
        
    }
}