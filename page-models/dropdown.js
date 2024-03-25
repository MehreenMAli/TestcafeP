import { t } from 'testcafe';
import LoadMorePagination from './loadMorePagination';

export default class Dropdown {
    constructor(selector){
        this.rows = selector.find('p.dropdown-option');
        this.pagination = new LoadMorePagination();
        this.exists = () => selector.exists;
        this.find = (cssSelector) => selector.find(cssSelector);
    }

    setPagination(pagination){
        this.pagination = pagination;
    } 

    async findOption(criteria) {
        if (await this.elementInDropdown(criteria))
            return true;
        else
        {
            while(await this.pagination.hasNext()){
                await t.click(this.pagination.next).wait(1000);
                if (await this.elementInDropdown(criteria))
                    return true;
            }
            return false;
        }
    }

    async elementInDropdown(criteria) {
        for (let i = 0; i < await this.rows.count; i++){
            let currentRow = await this.rows.nth(i);
            if (await criteria.meets(currentRow)){
                if (criteria.action !== undefined)
                    await criteria.action(currentRow);
                return true;
            }
        }
        return false;
    }

    async hasData(){
        let rowsCount = await this.rows.count;
        return rowsCount>1;
    }

    async getRow(rowNumber) {
        if (await this.hasData()) {
            let row = await this.rows.nth(rowNumber);
            let rowData = await row.innerText;
            return rowData.trim();
        }
        return;
    }
}