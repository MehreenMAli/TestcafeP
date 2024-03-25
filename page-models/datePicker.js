import { Selector, t } from 'testcafe';

export default class DatePicker{
    constructor(selector){
        this.toggle = selector.find('div.input-group');
        this.day = Selector('div.btn-secondary').filter('div:not(.text-muted)');
        this.root = Selector('ngb-datepicker-navigation-select');
        this.monthsDropdown = this.root.find('select').nth(0);
        this.monthsDropdownOptions = this.monthsDropdown.find('option');
        this.yearsDropdown = this.root.find('select').nth(1);
        this.yearsDropdownOptions = this.yearsDropdown.find('option');
        this.innerText = () => this.toggle.find('input').innerText;
        this.exists = () => this.toggle.exists;
    }

    async selectDate(day,month,year){
        await t
            .click(this.toggle)
            .click(this.monthsDropdown)
            .click(this.monthsDropdownOptions.filter(`[value="${month}"]`))
            .click(this.yearsDropdown)
            .click(this.yearsDropdownOptions.filter(`[value="${year}"]`))
            .click(this.day.withText(day));
        return true;
    }

    async selectLastDay(){
        await t.click(this.toggle);
        for (let date=31;date>27;date--)
        {
            let day = date.toString();
            if (await this.day.withText(day).exists)
            {
                await t.click(this.day.withText(day));
                return day;
            }
        }
        return true;
    }
}