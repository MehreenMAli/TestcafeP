import { Selector } from 'testcafe';
import Table from '../../table';

export default class DefineGL{
    constructor(){
        this.defineGLTable = new Table(Selector('#table-define-gl'));
        
    }
}