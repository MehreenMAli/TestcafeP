import Pagination from "./pagination";
import { Selector } from "testcafe";

export default class LoadMorePagination extends Pagination{
	constructor(){
		super();
		this.next = Selector('.load-more-option');
	}

}