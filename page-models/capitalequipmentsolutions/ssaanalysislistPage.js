import { Selector } from "testcafe";
import Table from '../table';
import { Criteria, textInCell, deleteElement, clickElement, editElement} from "../../utils/helperFunctions";

export default class SSAAnalysisListPage {
    constructor() {
        this.searchInput = Selector('#analysis_list_search');
        this.analysisTable = new Table(Selector('#table-analysis_list'));

        //Filter
        this.companyFilter = Selector('#company');
        this.assetTypeFilter = Selector('#asset_type_id');
        this.yearFilter = Selector('#year');
        this.makeFilter = Selector('#make');
        this.userNameFilter = Selector('#user_name');
        this.resetButton = Selector('#reset-button-analysis_list');

        this.financialsTitle = Selector('#breadcrumb-title');
        this.noRecordsTableLabel = Selector('p.legend');
        //Buttons on table
        this.copyButton = Selector('i.fa.fa-copy');
        this.editButton = Selector('i.fa.fa-edit');

        this.optionsFilter = Selector('div.dropdown-options');
    }

    async getAnalysis(analysisCompany) {
        let criteria = new Criteria(analysisCompany, textInCell);
        return this.analysisTable.findElement(criteria);
    }
    //click on the row
    async editAnalysis(analysisCompany){
        let criteria = new Criteria(analysisCompany, textInCell, editElement);
        return this.analysisTable.findElement(criteria);
    }

    async deleteAnalysis(analysisCompany){
        let criteria = new Criteria(analysisCompany, textInCell, deleteElement);
        return this.analysisTable.findElement(criteria);
    }

    async selectAnalysis(analysisCompany){
        let criteria = new Criteria(analysisCompany, textInCell, clickElement);
        return this.analysisTable.findElement(criteria);
    }

}