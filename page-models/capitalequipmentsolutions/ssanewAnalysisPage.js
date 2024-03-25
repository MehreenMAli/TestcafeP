import { Selector } from "testcafe";

import Modal from "../modal";
export default class SSANewAnalysisPage {
    constructor() {
        //Element menu
        this.leftMenu = Selector('li.nav-item');
        this.companyNameInput = Selector('input[formcontrolname="company_name"]');
        this.descriptionInput = Selector('input[formcontrolname="description"]')
        this.saveButton = Selector('#submit-button');
        this.dropdownsElement = Selector('div.dropdown-arrow');
        this.macrsDropdown = this.dropdownsElement.nth(0);
        this.bonusDropdown = this.dropdownsElement.nth(1);

        this.macrsDropdown = Selector('div.dropdown-arrow');
        this.dropDownOptions = Selector('div[class="dropdown-options"]');

        this.bonusInput = Selector('input[formcontrolname="bonus"]');
        this.taxBraketInput = Selector('input[formcontrolname="tax_bracket"]');
        this.weightedAvgCostDebtInput = Selector('input[formcontrolname="weighted_avg_cost_of_debt"]');
        this.avgReturnEquityInput = Selector('input[formcontrolname="avg_return_on_equity"]');
        this.debtEquityRatioInput = Selector('input[formcontrolname="debt_equity_ratio"]');
        this.waccOverrideInput = Selector('input[formcontrolname="wacc_override"]');
        this.label = Selector('label.legend');
        this.calculationtable = Selector('table.wacc');
        this.labelError = Selector('div.errors');
        this.calculationTitle = Selector('h6');

        this.percentIcon = Selector('i.fa.fa-percent.input-group-addon.active');

        this.macrsOptions = Selector('div.dropdown-options');
        this.bonusOptions = Selector('div.dropdown-options');

        //Menu
        this.procurementMenu = Selector('#procurement');
        this.currentLifecycleMenu = Selector('#current-lifecycle');
        this.operationsMenu = Selector('#operations');
        this.newLifecycleMenu = Selector('#new-lifecycle');
        this.ssaMenu = Selector('#ssa');
        this.leasebuyMenu = Selector('#lease-vs-buy');

        this.confirmationModal = new Modal()
    }
}