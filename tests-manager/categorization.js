import { registerFixture } from "../hooks";
import clients from '../clients';
import APIHandler from "../utils/apiHandler";

let apiHandler = new APIHandler();

//async version of isLicensed
/* 
async function isLicensed(user,category){
    let apps = await apiHandler.getApps();
    let app = apps.find(element => element.application_id === category.id);

    if(app){
        if(!clients[user.client].categories.includes(category.id))
            console.log(`Warning: Test configuration file of User "${user.username}" does not include ${category.name} application.`);
        return true;
    }

    console.log(`User "${user.username}" is not licensed to ${category.name} application.`);
    if(clients[user.client].categories.includes(category.id))
        console.log(`Warning: Test configuration file of User "${user.username}" includes ${category.name} application.`);
    
    return false;
}
*/

function isLicensed(user,category){

    if(clients[user.client].categories.includes(category.id))
        return true;

    console.log(`User "${user.username}" is not licensed to ${category.name} application.`);
    return false;
}

export const loadFixture = async function(user,category,fixtureFn){
    //async version
    //let userLicensed = await isLicensed(user,category);
    let userLicensed = isLicensed(user,category);

    if(!userLicensed){
        fixtureFn.skip;
    }
    else{
        registerFixture();
    }
}