import RequestHandler from './requestHandler';
import APIHandler from './apiHandler';

let instance = null;
let requestHandler = new RequestHandler();
let apiHandler = new APIHandler();

export default class Localizator {
    constructor() {
        if(!instance)
        {
            instance = this;
            this.culture = apiHandler.culture;
        }
        return instance;
    }
    
    async getLabels(ids,culture){
        await requestHandler.getToken();
        let language = '';
        if (culture)
            language = culture;
        else
            language = this.culture;
        return requestHandler.request(`${requestHandler.apiURL}/1.0/config/GetLocalizedUI?ids=${ids},&culture=${language}`);
    }

    async getLabelsAsJson(ids,culture){
        await requestHandler.getToken();
        ids = ids.toLowerCase();
        let parsedResponse = await this.getLabels(ids,culture);
        let jsonResponse = {};
        for (var i = 0; i < parsedResponse.length; i++) {
            jsonResponse[parsedResponse[i].Id] = parsedResponse[i].Label.replace('<br/>', '\n');
        }
        return jsonResponse;
    }

}