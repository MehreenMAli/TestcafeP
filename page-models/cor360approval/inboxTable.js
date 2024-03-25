import Table from '../table';
import { t } from 'testcafe';
import ScrollPagination from '../scrollPagination';

export default class InboxMobileTable extends Table {
    constructor(selector){
        super(selector);
        this.pagination = new ScrollPagination(this);
    }

    async checkElementInTable(criteria,i) {
        let firstRow = await this.rows.nth(i*3);
        let dateRow = await this.rows.nth(i*3+1);
        let amountRow = await this.rows.nth(i*3+2);
        if (await criteria.meets(firstRow,dateRow,amountRow))
            return true;
        return false;
    }

    async checkElement(criteria,i) {
        if (await this.checkElementInTable(criteria,i))
            return true;
        return false;
    }

    async findElement(criteria) {
        if (await this.elementInTable(criteria))
            return true;
        else
        {
            while(await this.pagination.hasNext()){
                await t.hover(await this.pagination.getLast()).wait(1000);
                if (await this.elementInTable(criteria))
                    return true;
            }
            return false;
        }
    }
}