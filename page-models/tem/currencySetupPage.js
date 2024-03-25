import { Selector,t } from 'testcafe';

export default class CurrencySetupPage{
    constructor() {
        this.baseCurrencyDropdown = Selector('div.dropdown-arrow');
        this.baseCurrencyDropdownOptions = this.baseCurrencyDropdown.find('p');
        this.table = Selector('table[class="conversion-table"]');
        this.tableHeaders = this.table.find('th');
        this.tableRows = this.table.find('tr');
        this.tableCells = this.tableRows.find('td');
        this.conversionFor = Selector('h4');
        this.selectedCurrency = this.conversionFor.find('span');
        this.saveButton = Selector('#save');
    }
}