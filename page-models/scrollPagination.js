
export default class ScrollPagination{
	constructor(table){
		this.table = table;
		this.totalRows = 0;
	}

	async hasNext(){
		if(this.totalRows < await this.table.rows.count){
			this.totalRows = await this.table.rows.count;
			return true;
		}
		return false
	}

	async getLast(){
		return await this.table.rows.nth(-1);
	}

}