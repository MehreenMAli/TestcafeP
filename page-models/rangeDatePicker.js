import { Selector, t } from 'testcafe';

export default class RangeDatePicker{
    constructor(selector){
        this.calendarRoot = Selector(selector);
        this.comboBoxFromToggler = this.calendarRoot.find("[class='datepicker__calendar__nav__header']").nth(0);
        this.comboBoxToToggler = this.calendarRoot.find("[class='datepicker__calendar__nav__header']").nth(1);
        this.comboMonthFrom = this.calendarRoot.find("[class='rang-daterange-picker'] select[class='months_width']").nth(0);
        this.comboMonthTo = this.calendarRoot.find("[class='rang-daterange-picker'] select[class='months_width']").nth(1);
        this.comboYearFrom = this.calendarRoot.find("[class='rang-daterange-picker'] select").nth(1);
        this.comboYearTo = this.calendarRoot.find("[class='rang-daterange-picker'] select").nth(3);
        this.calendarFrom = this.calendarRoot.find("[class='datepicker__calendar__month']").nth(0);
        this.calendarTo = this.calendarRoot.find("[class='datepicker__calendar__month']").nth(1);
        this.daysFrom = this.calendarFrom.find('span');
        this.daysTo = this.calendarTo.find('span');
        this.buttonClear = Selector('#cancel-range-dp');
        this.buttonApply = Selector('#apply-range-dp');
        this.comboFromMonthOptions = this.comboMonthFrom.find('option');
        this.comboFromYearOptions = this.comboYearFrom.find('option');
        this.comboToMonthOptions = this.comboMonthTo.find('option');
        this.comboToYearOptions = this.comboYearTo.find('option');
    }

    async selectDate(dateFrom, dateTo) {
        await t
        .click(Selector('.range-calendar-label i.fa.fa-calendar'))
        .doubleClick(this.comboBoxFromToggler)
        .click(this.comboFromMonthOptions.filter(`[value="${dateFrom.month}"]`))
        .doubleClick(this.comboBoxToToggler)
        .click(this.comboToMonthOptions.filter(`[value="${dateTo.month}"]`))
        .click(this.comboBoxFromToggler)
        .click(this.comboYearFrom)
        .click(this.comboFromYearOptions.withText(dateFrom.year))
        .click(this.comboBoxToToggler)
        .click(this.comboYearTo)
        .click(this.comboToYearOptions.withText(dateTo.year))
        .click(this.daysFrom.withText(dateFrom.day))
        .click(this.daysTo.withText(dateTo.day));
        return true;
     }

}