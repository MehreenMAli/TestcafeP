import { Selector } from "testcafe";
import Table from "../table";

export default class IndexingInboxPage {
    constructor() {
        this.onlineIndexingButton = Selector(''); //TODO wait for development
        this.table = new Table(Selector('#table-inbox_all'));
        this.viewIcon = Selector('.fa-eye');
        this.workIcon = Selector('.fa-play-circle');
    }
}