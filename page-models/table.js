import { t, Selector } from 'testcafe';
import Pagination from './pagination';
import { checkIds } from '../utils/helperFunctions';

export default class Table {
    constructor(selector){
        this.rows = selector.find('tr');
        this.filters = selector.find('tr.customsFiltersForDataTable');
        this.cells = selector.find('td');
        this.headers = selector.find('th');
        this.pagination = new Pagination();
        this.ellipsisIcon = Selector('.fa-ellipsis-v');
        this.displayColumnOptions = Selector('.dropdown-cor-columns label');
        this.exists = () => selector.exists;
        this.find = (cssSelector) => selector.find(cssSelector);
    }

    setPagination(pagination){
        this.pagination = pagination;
    } 

    async findElement(criteria) {
        if (await this.elementInTable(criteria))
            return true;
        else
        {
            while(await this.pagination.hasNext()){
                await t.click(this.pagination.next).wait(1000);
                if (await this.elementInTable(criteria))
                    return true;
            }
            return false;
        }
    }

    async findElementNoPagination(criteria) {
        if (await this.elementInTable(criteria))
            return true;
        return false;
    }

    async checkFilters(ids) {
        return await checkIds(this.filters,ids);
    }

    async getElement(criteria) {
        let element = await this.getElementInTable(criteria);

        if (element)
            return element;
            while(await this.pagination.hasNext()){
                await t.click(this.pagination.next).wait(1000);
                element = await this.getElementInTable(criteria);
                if (element)
                    return element;
            }
        return;
    }

    async getElementInTable(criteria) {
        for (let i = 0; i < await this.rows.count; i++){
            let currentRow = await this.rows.nth(i);
            let element = await criteria.meets(currentRow);
            if (element){
                if (criteria.action !== undefined)
                    await criteria.action(currentRow);
                return element;
            }
        }
        return;
    }

    async elementInTable(criteria) {
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
            let cells = await row.find('td');
            let cellsArray = [];
            for (let i=0;i<await cells.count;i++){
                let cellText = await cells.nth(i).innerText;
                cellsArray.push(cellText.trim());
            }
            return cellsArray;
        }
        return;
    }
}