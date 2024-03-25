import ConfirmModal from '../page-models/confirmModal';
import { Selector, t, ClientFunction, RequestLogger } from 'testcafe';
import APIHandler from './apiHandler';
import ShortError from '../error-types/shortError';

const apiHandler = new APIHandler();
const spinner = Selector('#fountainTextG > img');

export function getCopyright(branding){
    if (!branding.copyright)
        return `© Copyright ${new Date().getFullYear()} Corcentric LLC. All rights reserved.`;
    return branding.copyright;
};

export const paste = { paste: true };
export const replace = { paste: true, replace: true }
export const timeout = { timeout: 30000 };
export const longTimeout = { timeout: 60000 };
export const logger = RequestLogger({
	logResponseHeaders: true
});

//Helpers for TestCafe functions

export const getPageUrl = ClientFunction(() => window.location.href.toString());

export const getWindowInnerWidth = ClientFunction(() => window.innerWidth);

export const getWindowInnerHeight = ClientFunction(() => window.innerHeight);

export async function refresh(){
    await t.eval(() => location.reload(true));
    await t.eval(() => location.reload(true));
};

export function byID(id){
    if (id)
        return  Selector(`#${id}`);
    else
        throw new Error('ID should not be undefined');
};

export async function checkLabels(selector,labels,property){
    let label;
	for (let i = 0; i<labels.length; i++)
	{
        if (property == null){
            label = labels[i];
        }
        else{
            label = labels[i][property];
        }
        //console.log(label+" |");
        await t.expect(selector.withText(insensitive(label)).exists).ok(`The specified label ${label} was not found`, timeout);
    }
    return true;
};

export async function checkLabelsNotPresent(selector,labels,property){
    let label;
	for (let i = 0; i<labels.length; i++)
	{
        if (property == null){
            label = labels[i];
        }
        else{
            label = labels[i][property];
        }
        //console.log(label+" |");
        await t.expect(visible(selector.withText(insensitive(label))).exists).notOk(`The specified label was not found`, timeout);
    }
    return true;
};

export async function checkIds(selector,ids,property){
    let id;
	for (let i = 0; i<ids.length; i++)
	{
        if (property == null){
            id = ids[i];
        }
        else{
            id = ids[i][property];
        }
        //console.log(label+" |");
        await t.expect(selector.find(`#${id}`).exists).ok(`The specified element with id '${id}' was not found`, timeout);
    }
    return true;
};

export async function checkRequests(requestArray){
	for (let i = 0; i<requestArray.length; i++)
	{
        if (requestArray[i].response) {
            let notValid = (requestArray[i].response.statusCode !== 200 &&
                            requestArray[i].response.statusCode !== 204 &&
                            requestArray[i].response.statusCode !== 304 &&
                            requestArray[i].response.statusCode !== 400 &&
                            requestArray[i].response.statusCode !== 401 &&
                            requestArray[i].response.statusCode !== 403 &&
                            requestArray[i].response.statusCode !== 409);
            if (notValid) 
                throw new Error(`${requestArray[i].request.url} had a ${requestArray[i].response.statusCode} response`);
        }
    }
};

export function visible(selector){
    return selector.filterVisible();
};

export async function clickable(selector){
    await t.expect(visible(spinner).exists).notOk('Element is not clickable',timeout);
    return selector.filterVisible();
};

export function error(selector){
    return selector.sibling('cor-validation-errors').child('div.errors');
};

//Other functions

export function getVariable(url, query) {
    //Returns a variable from a URL
    url = url.replace(/.*?\?/, "");
    url = url.replace(/_&_/, "_%26_");
    var vars = url.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == query) {
            return decodeURIComponent(pair[1]);
        }
    }
};

export function insensitive(string){
    //You need to escape some characters for the regular expression to work
    string = string.replace(/\(/g, "\\(");
    string = string.replace(/\)/g, "\\)");
    string = string.replace(/\$/g, "\\$");
    string = string.replace(/\?/g, "\\?");
    return new RegExp(string.trim(),"i")
};

export function getMenu(submenu,menu_id) { 
	return submenu.find(x => x.menu_id === menu_id);
};

export function getTabs(array){
    //Example of the array that arrives
    //[{"status_id":2,"status_name":"Pending","label_id":"LK_RS_2","total":0}, ...]
    let tabs = [];
    array.forEach(function(element){
        if (element['total']==0)
            return;
        tabs.push(element['status_name']);
    });
    return tabs;
};

function rgbaToHex(color){
    color = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (color && color.length === 4) ? "#" +
        ("0" + parseInt(color[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(color[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(color[3],10).toString(16)).slice(-2) : '';
}

function rgbToHex(color){
    let a = color.split("(")[1].split(")")[0];
    a = a.split(",");
    var b = a.map(function(x){
        x = parseInt(x).toString(16);
    return (x.length==1) ? "0"+x : x;
    })
    b = "#"+b.join("");
    return b;
}

export function convertToHex(color){
    if (color !== undefined){
        if (color.startsWith('rgba'))
            color = rgbaToHex(color);
        if (color.startsWith('rgb'))
            color = rgbToHex(color)
        else
            color = expandHex(color);
        return color.toLowerCase();
    }
    return '';
};

function expandHex(color){
    if (color.length===4){
        let expanded = '#'+color[1].repeat(2)+color[2].repeat(2)+color[3].repeat(2);
        return expanded;
    }
    return color;
}

//Table functions

export const textInCell = async function(row){
    let cells = visible(await row.find('td'));
    let textFound = '';
    let cellsCount = await cells.count;
    
    if (cellsCount>0) {
        for (let i = 0; i<cellsCount; i++) {
            textFound = await cells.nth(i).innerText;
            if (textFound.includes(this.element))
                return true;
        }
    }
    return false;
};

export const exactTextInRow = async function(row){
    let cells = await row.find('td');
    let textFound = '';
    let cellsCount = await cells.count;
    
    if (cellsCount>0) {
        for (let i = 0; i<cellsCount; i++) {
            textFound = await cells.nth(i).innerText;
            if (textFound.trim() === this.element)
                return true;
        }
    }
    return false;
};

export const textInCellChecked = async function(row){
    let cells = await row.find('td');
    let textFound = '';
    let checkboxValue = false;
    let cellsCount = await cells.count;
    
    if (cellsCount>0) {
        for (let i = 0; i<cellsCount; i++) {
            textFound = await cells.nth(i).innerText;
            if (textFound.includes(this.element)){
                checkboxValue = await cells.find('input[type="radio"]').checked;
                if (checkboxValue)
                    return true;
            } 
        }
    }
    return false;
};

export function Criteria(element, meets, action = undefined) {
    this.element = element;
    this.meets = meets;
    this.action = action;
}

export const deleteElement = async function(row){
    let confirmModal = new ConfirmModal();
    let deleteButton = row.find('i[class="fa fa-trash"]');
    await t
        .click(deleteButton)
        .click(confirmModal.acceptButton);
};

export const editElement = async function(row){
    let editButton = row.find('i[class="fa fa-edit"]');
    if (!await editButton.exists)
        editButton = row.find('i[class="fa fa-pencil"]');
    await t.click(await clickable(editButton));
}

export const holdElement = async function(row){
    let holdButton = row.find('i[class="fa fa-ban"]');
    await t.click(holdButton);
}

export const unHoldElement = async function(row){
    let unHoldButton = row.find('i[class="fa fa-ban btn-red"]');
    await t.click(unHoldButton);
}

export const selectElement = async function(row){
    let checkbox = await row.find('input[type="checkbox"]');
    if (!await checkbox.exists)
        checkbox = await row.find('input[type="radio"]');
    await t.click(checkbox);
}

export const clickToggle = async function(row){
    let toggle = await row.find('input[type="checkbox"]').sibling(0);
    if (!await toggle.exists)
        toggle = await row.find('input[type="radio"]').sibling(0);
    await t.click(toggle);
}

export const clickElement = async function(row){
    let element = row.find('td');
    await t.click(element);
}

//Dropdown

export const clickOption = async function(row){
    await t.click(row);
}

export const textInOption = async function(row){
    let textFound = await row.innerText;
    
    if (textFound.trim() === this.element)
        return true;

    return false;
};

export const getByKey = async function(data,field,value){
    let json = {};
    for(var i=0; i<data.length; i++){
        if(data[i][field] === value){
            json = data[i];
        }
    }
    return json;
}

export const findCor360ApprovalDocument = async function({ docType="", docTypeID="", docStatus="" }){

    let document = {};
    let documents = await apiHandler.getCor360ApprovalDocuments(1,docStatus);

    document = await documents['items'].find(element => (element.document_type_name === docType)
                                                                || element.document_type === docTypeID);
    let total = Math.ceil(documents.total/10);
    
    if(!document){
        for(let i=2; i<=total; i++){
            if(!document)
                documents = await apiHandler.getCor360ApprovalDocuments(i,docStatus);
            else
                break;
            
            document = await documents['items'].find(element => (element.document_type_name === docType)
                || element.document_type === docTypeID);
        }
    }

    if(!document){
		throw new ShortError(`No document of Type '${docType}', ID ${docTypeID} with Status '${docStatus}' was found`);
    }
    return document;
}

export const toTitleCase = function(item) {
    let itemsArray = [];
    for (const key in item) {
        let cleanKey = formatKeys( key );
        itemsArray.push({ 'key': cleanKey, 'value': item[key] });
    }
    return itemsArray;
}

function formatKeys(originalKey) {
    let arrayOfStrings = originalKey.split('_');
    let uppercaseStrings = [];
    arrayOfStrings.forEach(string => {
    let cleanString = string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
    uppercaseStrings.push(cleanString);
    });
    return uppercaseStrings.join(' ');
  }

export const toDateString = function(stringDate){

    if(stringDate){
        let date = new Date(stringDate);

        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        
        if (day < 10) {
          day = '0' + day;
        }
        if (month < 10) {
          month = '0' + month;
        }
        
        let culture = apiHandler.culture;
        let formattedDate = `${month}/${day}/${year}`
        if(culture === 'es-AR')
            formattedDate = `${day}/${month}/${year}`;
        
        return formattedDate;
    }
    return stringDate;
}