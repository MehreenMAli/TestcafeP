import { Selector } from "testcafe";

export default class SSAHomePage {
    constructor() {
        this.imgHome = Selector('img.img-fluid');
        this.titleHome = Selector('h4.primary-color');
        this.textHome = Selector('p');
        this.newAnalysisButtonMenuDesktop = Selector('#btnAddAnalysis');
        this.analysisListButtonMenuDesktop = Selector('#btnSSAAnalysisList');
        
        //Ipad Selectors

        this.floatingMenuButton = Selector('i.fa.fa-ellipsis-v.fa-2x');
        this.newAnalysisButtonMenu = Selector('#btnAddAnalysisMobile');
        this.homeButtonMenu = Selector('#btnSSAHomeMobile');
        this.analysisListButtonMenu = Selector('#btnSSAAnalysisListMobile');
        this.contactButtonMenu = Selector('#btnSSAContactMobile');
        

    }
}