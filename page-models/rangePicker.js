import { Selector } from 'testcafe';

export default class RangePicker{
    constructor(){
        this.rootElement = Selector('daterange-picker');
        this.fromCalendar = this.rootElement.find('div[class="datepicker__calendar__content"]').nth(0);
        this.fromCalendarDays = this.fromCalendar.find('span');
        this.toCalendar = this.rootElement.find('div[class="datepicker__calendar__content"]').nth(1);
        this.toCalendarDays = this.toCalendar.find('span');
        this.fromLeftArrow = this.fromCalendar.find('div[class="datepicker__calendar__nav__arrow"]').nth(0);
        this.fromRightArrow = this.fromCalendar.find('div[class="datepicker__calendar__nav__arrow"]').nth(1);
        this.tolefttArrow = this.toCalendar.find('div[class="datepicker__calendar__nav__arrow"]').nth(0);
        this.toRightArrow = this.toCalendar.find('div[class="datepicker__calendar__nav__arrow"]').nth(1);
        this.cancelButton = this.rootElement.find('button.btn.btn-secondary');
        this.saveButton = this.rootElement.find('button.btn.btn-primary');
    }
}