import { Selector } from 'testcafe';

export default class Pagination{
	constructor(){
		this.previous = Selector('ul[class="ngx-pagination"]').find('li.pagination-previous');
		this.next = Selector('ul[class="ngx-pagination"]').find('li.pagination-next');
		this.current = Selector('ul[class="ngx-pagination"]').find('li.current');
		this.elements = Selector('ul[class="ngx-pagination"]').find('li');
	}
	async hasNext(){
		if (await this.next.exists){
			return !(await this.next.hasClass('disabled'));
		}
		return false;
	}

	async hasPrevious(){
		if (await this.previous.exists){
			return !(await this.previous.hasClass('disabled'));
		}
		return false;
	}
}