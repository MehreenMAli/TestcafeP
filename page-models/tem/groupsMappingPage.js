import { Selector, t } from 'testcafe';
import Table from '../table';

export default class GroupsMappingPage{
    constructor(){
        this.newButton = Selector('#new');
        this.table = new Table(Selector('#table-groupMappingList'));
    }
}