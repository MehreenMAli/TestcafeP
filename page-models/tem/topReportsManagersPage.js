import { Selector } from 'testcafe';

export default class TopReportsManagersPage{
    constructor(){
        this.canvas = Selector('canvas');
        this.table = Selector('#table-top-ten');
    }
}