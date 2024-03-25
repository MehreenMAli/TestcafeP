import { parseArguments } from './parseArguments';
import users from '../users';
import config from '../config';
import RequestHandler from './requestHandler';

let instance = null;
let requestHandler = new RequestHandler();

export default class APIHandler{
    constructor() {
        if(!instance)
        {
            instance = this;
            let args = parseArguments();
            
            try {
                this.username = users[args.user].username;
                this.password = users[args.user].password;
                this.culture = args.culture;
                this.apiURL = config[args.env].apiURL;
            }
            catch (err){
                console.log('One of the parameters is not valid: \n');
                console.log(err);
            }
        }
        return instance;
    }

    async getApps(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/menu/apps?culture=${this.culture}`);
    }

    async getMenues(app){
        await requestHandler.getToken();
        let options = {
            headers: { 
                'Authorization': `Bearer ${requestHandler.token}`,
                method: 'options',
            }
        };
        return requestHandler.request(`${this.apiURL}/1.0/menu/${app}?culture=${this.culture}`,options);
    }

    async getUserDropdown(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/menu/user?culture=${this.culture}`);
    }

    async getUserDropdown(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/menu/user?culture=${this.culture}`);
    }

    async getTEMUserDropdown(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/menu/tem/user?culture=${this.culture}`);
    }
   
    async getMyProfile(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/myprofile`);
    }


    async getAppProfile(app){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/myprofile?app=${app}`);
    }

    async getBranding(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/branding?culture=${this.culture}`);
    }
    async getBrand(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/branding?app=tem&culture=${this.culture}`);
    }
    async getUserPicture(){
        await requestHandler.getToken();
        let profile = await this.getMyProfile();
        return requestHandler.request(`${this.apiURL}/1.0/config/userpicture?user_id=${profile.user_id}&token=`+requestHandler.token,{ method: 'get'}, undefined, false);
    }

    async getPendingBatchStatus(){
        await requestHandler.getToken();
        return requestHandler.request(`https:${requestHandler.url_epay}/api/1.0/paymentstatus/pending?culture=${this.culture}`);
    }

    async getProcessedBatchStatus(){
        await requestHandler.getToken();
        return requestHandler.request(`https:${requestHandler.url_epay}/api/1.0/paymentstatus/processed?culture=${this.culture}`);
    }

    async getProcessedPaymentStatus(){
        await requestHandler.getToken();
        return requestHandler.request(`https:${requestHandler.url_epay}/api/1.0/paymentstatus/achchecking?culture=${this.culture}`);
    }

    async getComplianceMenu(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/compliance?culture=${this.culture}`);
    }

    async getStatusMenu(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/status?culture=${this.culture}`);
    }

    async getMobileCounts(page){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/${page}?culture=${this.culture}`);
    }

    async getApprovalProfileChainTypes(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/lookup/approvalprofiles/chaintypes?culture=${this.culture}`);
    }
    
    async getReportCount(){
        return this.getMobileCounts('reportcount');
    }

    async getApprovalCount(){
        return this.getMobileCounts('reportapprovalcounts');
    }

    async getCurrencies(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/currencies?culture=${this.culture}`);
    }

    async getCor360ApprovalDocuments(page = 1, status = ""){
        await requestHandler.getToken();

        if (status)
            status = `/${status}`;

        return requestHandler.request(`https:${requestHandler.url_cor360approval}/api/1.0/approval/inbox${status}?page=${page}&per_page=10&sort=document_id&direction=asc&culture=${this.culture}`);
    }

    async getCor360ApprovalDocumentDetail(type,id){
        await requestHandler.getToken();
        return requestHandler.request(`https:${requestHandler.url_cor360approval}/api/1.0/approval/${type}/${id}?culture=${this.culture}`);
    }

    async getCor360RouteTypes(){
        await requestHandler.getToken();
        return requestHandler.request(`https:${requestHandler.url_cor360approval}/api/1.0/approval/routeType/assignment?culture=${this.culture}`);
    }

    async getCor36CCRouteTypes(){
        await requestHandler.getToken();
        return requestHandler.request(`https:${requestHandler.url_cor360approval}/api/1.0/approval/routeType/copy?culture=${this.culture}`);
    }

    async getPOLineitems(poId){
        await requestHandler.getToken();
        return requestHandler.request(`https:${requestHandler.url_cor360approval}/api/1.0/approval/po/${poId}/lineItems?culture=${this.culture}`);
    }

    async getDocumentImagesNumber(id,docType){
        await requestHandler.getToken();
        let options = {
            method: 'GET',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        const pdf = await requestHandler.request(`https:${requestHandler.url_cor360approval}/api/1.0/approval/${docType}/${id}/pdf?culture=${this.culture}`,options,{},false);
        if(!pdf)
            return 0;
        const images = await requestHandler.request(`https:${requestHandler.url_cor360approval}/api/1.0/approval/${docType}/${id}/image?culture=${this.culture}`);
        const count = images.image_ids.length;
        return count;
    }

    async getLineItems(id){
        await requestHandler.getToken();
        return requestHandler.request(`https:${requestHandler.url_cor360approval}/api/1.0/approval/invoice/${id}/lineItems?culture=${this.culture}`);
    }

    async getAllocationsItems(id){
        await requestHandler.getToken();
        return requestHandler.request(`https:${requestHandler.url_cor360approval}/api/1.0/approval/invoice/${id}/allocations?culture=${this.culture}`);
    }

    async getDivisionItems(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/division?typeahead=&culture=${this.culture}`);
    }

    async getCategoryItems(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/categories_v2?typeahead=&culture=${this.culture}`);
    }

    async getTEMRoles(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/applicationroles/62000?culture=${this.culture}`);
    }

    async addRole(roleName){
        await requestHandler.getToken();

        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            is_default: false,
            role_id: 0,
            role_name: roleName
        }
        
        return requestHandler.request(`${this.apiURL}/1.0/config/applicationroles/62000`,options,body);
    }

    async deleteRole(roleId){
        await requestHandler.getToken();
        let options = {
            method: 'delete',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        
        return requestHandler.request(`${this.apiURL}/1.0/config/applicationroles/62000/${roleId}`,options);
    }

    async getCategoriesByRole(roleId){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/menupermission/tem/${roleId}?culture=${this.culture}`)
    }

    async getAllProjectCodes(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/projectcode?${this.culture}`)                 
    }
    async addProjectCode(projectCodeName,projectCodeCode){
        await requestHandler.getToken();

        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            effective_date: "2018-09-21T14:12:19.772Z",
            project_code: projectCodeCode,
            project_name: projectCodeName
        }

        return requestHandler.request(`${this.apiURL}/1.0/config/projectcode`,options,body);
    }

    async deleteProjectCode(projectCodeId){
        await requestHandler.getToken();

        let options = {
            method: 'DELETE',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        return requestHandler.request(`${this.apiURL}/1.0/config/projectcode/${projectCodeId}`,options,{},false);
    }

    async addPolicySetup(policyName){
        await requestHandler.getToken();

        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            policy_check_type_id: 1,
            policy_name: policyName
        }

        return requestHandler.request(`${this.apiURL}/1.0/reportcompliance/policy`,options,body);
    }

    async deletePolicy(policyId){
        await requestHandler.getToken();

        let options = {
            method: 'DELETE',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
      
        return requestHandler.request(`${this.apiURL}/1.0/reportcompliance/policy/${policyId}`,options,{},false);
    }

    async addUser(cust1, cust2, middleName, phoneNumber, userName,userFirsName,userEmail,userLastName){
        await requestHandler.getToken();
        let usuario = await this.getUsers(userFirsName, userLastName);
        if(await (usuario.total == 0)){
            let pass_exp = new Date('9/21/2020').toLocaleDateString("en-US");
            let options = {
                method: 'post',
                form: true,
                headers: {
                    'Authorization': `Bearer ${requestHandler.token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            let body = {
                custom1: cust1,
                custom2: cust2,
                email: userEmail,
                first_name: userFirsName,
                last_name: userLastName,
                middle_name: middleName,
                password_expiration_date: pass_exp,
                phone: phoneNumber,
                user_name: userName,
                status_id: 3
            }
            
            return requestHandler.request(`${this.apiURL}/1.0/config/users_v4?app=tem`,options,body);
        }else{
            return await usuario;
        }
    }

    async deleteUser(clientId){
        await requestHandler.getToken();

        let options = {
            method: 'DELETE',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
      
        return requestHandler.request(`${this.apiURL}/1.0/config/users/${clientId}`,options,{},false);
    }

    async getUsers(firstName, lastName){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/users_v2?app=tem&page=1&per_page=10&lk:first_name=${firstName}&lk:last_name=${lastName}&culture=${this.culture}`);
    }

    async getClientDateFormat(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/clientdateformat`);
    }

    async getAllExpenses(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/expense?sort=expense_date&direction=desc&culture=${this.culture}`);
    }

    /* Possible status = {
        0 = Unclaimed
        1 = Not Submitted
        2 = Submitted
    } */
    async getAllExpensesByStatus(status){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/expense?report_status=${status}&culture=${this.culture}`);
    }

    async deleteExpense(expenseId){
        await requestHandler.getToken();
        let options = {
            method: 'DELETE',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/json'
            }
        };
        return requestHandler.request(`${this.apiURL}/1.0/expense/${expenseId}`,options);

    }

    async getTEMExpenses(page=1){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/expense?page=${page}&per_page=10&sort=expense_date&direction=desc&culture=${this.culture}`);
    }

    async getTEMApprovals(page=1){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/reports/approvals?page=${page}&per_page=10&sort=submitted_date&direction=DESC&culture=${this.culture}`);
    }

    async addDistanceRate(unitId,unit,rate,currencyID,currency,per){
        await requestHandler.getToken();
        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            can_delete: true,
            currency_id: currencyID,
            currency_name: currency,
            effective_date: "2018-09-28T00:00:00+00:00",
            is_active: false,
            per: per,
            rate: rate,
            unit_id: unitId,
            unit_name: unit
        }
        return requestHandler.request(`${this.apiURL}/1.0/config/distancerate`,options,body);
        
    }

    async getAllDistanceRates(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/distancerate?culture=${this.culture}`);
    }

    async deleteDistanceRate(distanceId){
        await requestHandler.getToken();

        let options = {
            method: 'DELETE',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
      
        return requestHandler.request(`${this.apiURL}/1.0/config/distancerate/${distanceId}`,options,{},false);
    }

    async addExpenseCategories(expenseCategoryName){
        await requestHandler.getToken();
        let pass_exp = new Date();
        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            category_name: expenseCategoryName,
            effective_date: pass_exp,
            icon_image: "",
            is_active: true,
            personal_vehicle_use: false,
            sort_order: 0
        }
        return requestHandler.request(`${this.apiURL}/1.0/config/category`,options,body);
        
    }

    async getAllExpenseCategories(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/category?culture=${this.culture}`);
    }

    async deleteExpenseCategory(categoryId){
        await requestHandler.getToken();

        let options = {
            method: 'DELETE',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        return requestHandler.request(`${this.apiURL}/1.0/config/category/${categoryId}`,options,{},false);
    }

    async getRuleLibrary(page=1){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/reportcompliance/rulelibrary?page=${page}&per_page=10&culture=${this.culture}`);
    }

    async getAllRulesLibrary(){
        await requestHandler.getToken();
        return request(`${this.apiURL}/1.0/reportcompliance/rulelibrary?culture=${this.culture}`);
    }

    async deleteRule(ruleID){
        await requestHandler.getToken();

        let options = {
            method: 'DELETE',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/json'
            }
        };
        return requestHandler.request(`${this.apiURL}/1.0/reportcompliance/rulelibrary/${ruleID}`, options);
    }

    async getRuleActivity(page=1){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/reportcompliance/rulelibrary/activity?page=${page}&per_page=10&sort=activity_date&direction=desc&culture=${this.culture}`);
    }

    //Cor360 Payments
    async getAllBankAccount(){
        await requestHandler.getToken();
        return requestHandler.request(`https:${requestHandler.url_epay}/api/1.0/corbankaccount?sort=bank_name&direction=asc&culture=${this.culture}`);
    }
    
    async deleteBankAccount(bankAccount){
        await requestHandler.getToken();

        let options = {
            method: 'DELETE',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
      
        return requestHandler.request(`https:${requestHandler.url_epay}/api/1.0/corbankaccount/${bankAccount}`,options,{},false);
    }

    async addBankAccount(accountNumber,accountName,bankName){
        await requestHandler.getToken();
        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            account_number: accountNumber,
            active: false,
            bank_account_id: 227,
            bank_account_name: accountName,
            bank_name: bankName,
            currency_id: 1,
            currency_label_id: "LK_CUR_1" ,  
            currency_name: "US Dollar",
            description: null,
            effective_date: "2018-10-03T00:00:00-04:00",
            gp_checkbook_id: "100",
            routing_number: "testingqa"
        }
        return requestHandler.request(`https:${requestHandler.url_epay}/api/1.0/corbankaccount`,options,body);
        
    }

    async getClients(page){
        await requestHandler.getToken();
        if(!page){
            return requestHandler.request(`https:${requestHandler.url_epay}/api/1.0/customer?sort=customer_name&direction=asc&culture=${this.culture}`);
        }else{
            return requestHandler.request(`https:${requestHandler.url_epay}/api/1.0/customer?page=${page}&per_page=10&sort=customer_name&direction=asc&culture=${this.culture}`);
        }
        
    }

    async addClient(dataString,emailClient){
        await requestHandler.getToken();
        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            account_name: dataString,
            bank_account: null,
            check_string: 'test',
            client_notify_email: emailClient,
            cor_bank_account_id: null,
            currency_id: "1",
            customer_code: "1111",
            customer_name: dataString,
            enable_auto_release: false,
            gp_vendor_id: "1",
            payment_account_filename: dataString,
            payment_account_id: 2,
            routing: null,
            suppress_nacha: false,
            test_mode: false,
            url: "www.google.com"
        }
        return requestHandler.request(`https:${requestHandler.url_epay}/api/1.0/customer`,options,body);
    }

    async deleteClient(clientId){
        await requestHandler.getToken();

        let options = {
            method: 'DELETE',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        return requestHandler.request(`https:${requestHandler.url_epay}/api/1.0/customer/${clientId}`,options,{},false);
    }

    async addPaymentAccount(accountName,inputDirectory,outputDirectory,prenoteDirectory){
        await requestHandler.getToken();
        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            payment_account_input_directory: inputDirectory,
            payment_account_name: accountName,
            payment_account_output_directory: outputDirectory,
            payment_account_prenote_directory: prenoteDirectory,
            payment_account_type_id: 1
        }
        return requestHandler.request(`https:${requestHandler.url_epay}/api/1.0/paymentaccount`,options,body);
    }

    async deletePaymentAccount(paymentAccountId){
        await requestHandler.getToken();

        let options = {
            method: 'DELETE',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        return requestHandler.request(`https:${requestHandler.url_epay}/api/1.0/paymentaccount/${paymentAccountId}`,options,{},false);
    }
    

    async getGLAllocationSegments(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/gl/allocation/segments?culture=${this.culture}`);
    }

    async getGLAllocationLookups(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/gl/allocation/lookups?culture=${this.culture}`);
    }

    async getNotificationTypes(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/usernotification/lookup/notification_types?culture=${this.culture}`);
    }

    async getDeliveryTypes(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/usernotification/lookup/delivery_types?culture=${this.culture}`);
    }

    async getPreferredLanguages(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/languages?culture=${this.culture}`);
    }

    async addPolicy(policyName,checkType = 1){
        await requestHandler.getToken();

        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            policy_check_type_id: checkType,
            policy_name: policyName
        };

        return requestHandler.request(`${this.apiURL}/1.0/reportcompliance/policy`,options,body);
    }

    async deletePolicy(policyId){
        await requestHandler.getToken();

        let options = {
            method: 'delete',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        return requestHandler.request(`${this.apiURL}/1.0/reportcompliance/policy/${policyId}`,options);
    }

    async getAllPolicies(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/reportcompliance/policy?culture=${this.culture}`);
    }

    async getGroupPolicies(groupId){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/reportcompliance/group/${groupId}/policy?culture=${this.culture}`);
    }

    async getAllCustomers(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/platform/clients_v2?culture=${this.culture}`);
    }

    async getTablesComposition(customerId) {
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/platform/client/${customerId}/gl/schema/tableComposition`);
    }

    async deleteTable(table,customerId) {
        const url = `${this.apiURL}/1.0/platform/client/${customerId}/gl/schema/tableComposition`;
        await requestHandler.getToken();
        let body = JSON.stringify({
            "tables": [
                {
                    "table_name": table.table_name,
                    "table_id": table.table_id,
                    "action": 'delete'
                }
            ]
        });
        
         let options = {
            method: 'post',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length,
                'Authorization': 'Bearer ' + requestHandler.token
                }
        }; 
        requestHandler.requestJsonBody(url,options,body);
    }

    async getCustomerTables(customerId,page){
        await requestHandler.getToken();
        let pagination = "";
        if(page){
            pagination = `page=${page}&per_page=10&`
        }
        return requestHandler.request(`${this.apiURL}/1.0/platform/client/${customerId}/gl/schema/tables?${pagination}culture=${this.culture}`);
    }

    async getTemHomeMenues(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/menu/tem?page=tem-home&culture=${this.culture}`)
    }

    async getTableColumns(customerId,tableId){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/platform/client/${customerId}/gl/schema/table/${tableId}/columns?culture=${this.culture}`);
    }

    async getCustomersLookupSegments(customerId){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/platform/client/${customerId}/gl/segment/lookup?culture=${this.culture}`);
    }

    async getCustomersSegments(customerId){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/platform/client/${customerId}/gl/segment/simple?culture=${this.culture}`);
    }

    async getAllReceipts(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/receiptlib?culture=${this.culture}`);
    }

    async deleteReceipt(receiptID){
        await requestHandler.getToken();
        let options = {
            method: 'delete',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        return requestHandler.request(`${this.apiURL}/1.0/receipt/${receiptID}`, options);
    }

    async getTEMReports(page=1){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/reports?page=${page}&per_page=10&sort=end_date&direction=desc&culture=${this.culture}`);
    }
    
    async getAllTEMReports() {
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/reports?sort=end_date&direction=desc&culture=${this.culture}`)
    }

    async deleteReport(reportId) {
        await requestHandler.getToken();
        let options = {
            method: 'DELETE',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/json'
            }
        };
        return requestHandler.request(`${this.apiURL}/1.0/report/${reportId}`, options)
    }

    async getEmailsTemplate(page='1',perPage='10'){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/emaillookupvalues/emailtemplates?app_name=tem&page=${page}&per_page=${perPage}&sort=email_template_id&direction=asc&culture=${this.culture}`);
    }

    async getAllEmailsTemplate(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/emaillookupvalues/emailtemplates?app_name=tem&culture=${this.culture}`);
    }

    async deleteEmailTemplate(templateId){
        await requestHandler.getToken();
        let options = {
            method: 'DELETE',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/json'
            }
        };
        return requestHandler.request(`${this.apiURL}/1.0/config/emailtemplate/${templateId}`, options);
    }

    //Platform Admin

    async getAllOfferings(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/offering?culture=${this.culture}`);
    }

    async getOffering(page=1){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/offering?page=${page}&per_page=10&culture=${this.culture}`);
    }

    async addOffering(shortName,longName){
        await requestHandler.getToken();
        let options = {
            method: 'POST',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            offering_long_name: longName,
            offering_short_name: shortName
        }
        return requestHandler.request(`${this.apiURL}/1.0/config/offering`,options,body);
    }

    async deleteOffering(offeringID){
        await requestHandler.getToken();

        let options = {
            method: 'delete',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        return requestHandler.request(`${this.apiURL}/1.0/config/offering/${offeringID}`,options);
    }
    async getAllClients(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/platform/clients?culture=${this.culture}`)
    }
    async getAllUsers(clienteId=20){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/platform/users?client_id=${clienteId}&culture=${this.culture}`);
    }

    async deleteUserPA(userIdPlatformAdmin){
        await requestHandler.getToken();

        let options = {
            method: 'delete',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        return requestHandler.request(`${this.apiURL}/1.0/platform/users/${userIdPlatformAdmin}`,options);
    }

    async temLogout(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/logout?application_id=62000`);
    }

    async getIndexingInboxItems(page='1',perPage='10'){
        await requestHandler.getToken();
        return requestHandler.request(`https:${requestHandler.url_cor360approval}/api/1.0/indexing/inbox?page=${page}&per_page=${perPage}&culture=${this.culture}`);
    }

    //GroupsReport
    async getGroupsReportByType(typeId){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/reportcompliance/grouptype/${typeId}/group?culture=${this.culture}`);
    }

    //GL Allocation Settings
    async getGLAllocationSettingsExpense(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/gl/allocation/category/methodTypes?culture==${this.culture}`);
    }

    async getGLAllocationEntryTypes(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/gl/allocation/category/entryTypes?culture==${this.culture}`);
    }

    async getGLAllocationGridExpense(id_expense='0'){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/expense/${id_expense}/gl/allocation?culture=${this.culture}`);
    }

    async getGLAllocationConfiguration(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/expense/gl/allocation/grid?culture=${this.culture}`);
    }

    async getAllCodes(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/accounts?culture=${this.culture}`);
    }

    async getProjectCodeConfig(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/projectcode/settings`);
    }

    //Capital Equiment
    
    async getCapitalEquimetContact(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/config/GetLocalizedUI?ids=ui-ssacontact-*,&culture=${this.culture}`);
    }

    async getAnalysis(page=1,perPage=10){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/ssa/analysis/summary?page=${page}&per_page=${perPage}&culture=${this.culture}`);
    }

    async getAllAnalysis(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/ssa/analysis/summary?culture=${this.culture}`);
    }

    async getFinancialAnalysis(analysisID){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/ssa/analysis/${analysisID}/financials?culture=${this.culture}`)
    }

    async addNewAnalysis(paramsObject){
        
        await requestHandler.getToken();
        let body = JSON.stringify({
            avg_return_on_equity: paramsObject.avgReturnOnEquity,
            bonus: paramsObject.bonus,
            company_name: paramsObject.companyName,
            debt_equity_ratio: paramsObject.debtEquityRatio,
            description: paramsObject.description,
            macrs_id: paramsObject.macrsId,
            ssa_analysis_id: 0,
            ssa_financial_id: 0,
            tax_bracket: paramsObject.taxBracket,
            wacc_override: paramsObject.waccOverride,
            weighted_avg_cost_of_debt: paramsObject.weightedCostOfDebt
        });
        let options = {
            method: 'POST',
            form: true,
            port: 443,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Length': body.length,
                'Content-Type': 'application/json'
            }
        };
        return requestHandler.requestJsonBody(`https://62000-cwsdev.corcentric.com/api/1.0/ssa/financials`, options, body);
    }

    async deleteAnalysis(analysisId){
        await requestHandler.getToken();
        let options = {
            method: 'delete',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        return requestHandler.request(`${this.apiURL}/1.0/ssa/analysis/${analysisId}`, options);
    }

    async addProcurement(data){
        await requestHandler.getToken();
        let body = JSON.stringify({
            asset_type_id: data.asset_type_id,
            equipment_type: data.equipment_type,
            estimated_resale_value: data.estimated_resale_value,
            inflation_rate: data.inflation_rate,
            model: data.model,
            oec: data.oec,
            oem: data.oem,
            procurement_id: data.procurement_id,
            ssa_analysis_id: data.ssa_analysis_id,
            year: data.year
        });
        let options = {
            method: 'POST',
            form: true,
            port: 443,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Length': body.length,
                'Content-Type': 'application/json'
            }
        };
        return requestHandler.requestJsonBody(`${this.apiURL}/1.0/ssa/procurement`, options, body);
    }

    async getMacrs(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/ssa/lookup/macrs?culture${this.culture}`);
    }

    async getAssetType(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/1.0/ssa/lookup/assettype?culture${this.culture}`);
    }

    //API version 2.0
    
    async getGroupTypes(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/groupType?page=1&per_page=10&culture=${this.culture}`);
    }

    async getGroupsByType(typeId, numberPage=1){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/groupType/${typeId}/group?page=${numberPage}&per_page=10&culture=${this.culture}`);
    }

    async getAllGroups(typeId){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/groupType/${typeId}/group?culture=${this.culture}`);
    }

    async getRoles(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/role?culture=${this.culture}`);
    }

    async addMembership(groupId,roleId,groupTypeId){
        await requestHandler.getToken();
        const myProfile = await this.getMyProfile();

        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            group_id: groupId,
            role_id: roleId
        }

        return requestHandler.request(`${this.apiURL}/2.0/config/groupType/${groupTypeId}/user/${myProfile.user_id}/membership`,options,body);
    }

    async deleteMembership(groupId,roleId,groupTypeId){
        await requestHandler.getToken();
        const myProfile = await this.getMyProfile();
        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            group_id: groupId,
            role_id: roleId
        }

        return requestHandler.request(`${this.apiURL}/2.0/config/groupType/${groupTypeId}/user/${myProfile.user_id}/membership/delete`,options,body,false);
    }

    async addGroup(groupName,groupTypeId){
        await requestHandler.getToken();

        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            active: true,
            group_id: null,
            group_name: groupName,
            parent_group_id: null
        }

        return requestHandler.request(`${this.apiURL}/2.0/config/groupType/${groupTypeId}/group`,options,body);
    }

    async deleteGroup(groupId,groupTypeId){
        await requestHandler.getToken();

        let options = {
            method: 'delete',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        return requestHandler.request(`${this.apiURL}/2.0/config/groupType/${groupTypeId}/group/${groupId}`,options,{},false);
    }

    async getGroup(groupTypeId){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/groupType/${groupTypeId}/group?culture=${this.culture}`);
    }

    async getGroupUsers(groupId,groupTypeId){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/groupType/${groupTypeId}/group/${groupId}/AssignedUsers?app=tem&culture=${this.culture}`);
    }

    async getApprovalLimitGroups(groupTypeId,groupId = 0){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/groupType/${groupTypeId}/group/${groupId}/approvalLimit?culture=${this.culture}`);
    }

    async getSegments(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/gl/segments?culture=${this.culture}`);
    }

    async getImportMaps(page=10){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/gl/default/users/importMaps?page=1&per_page=${page}&culture=${this.culture}`);
    }

    async getAllImportMaps(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/gl/default/users/importMaps?culture=${this.culture}`);
    }

    async deleteUserDefaultImportMap(mapId){
        await requestHandler.getToken();
        let options = {
            method: 'delete',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/json'
            }
        };
        return requestHandler.request(`${this.apiURL}/2.0/config/gl/default/users/importMap/${mapId}`, options);
    }

    async getAllGLUserDafultMaps(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/gl/default/users?culture=${this.culture}`);
    }

    async deleteUserGlDefaultMap(mapId){
        await requestHandler.getToken();
        let options = {
            method: 'delete',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/json'
            }
        };
        return requestHandler.request(`${this.apiURL}/2.0/config/gl/default/user/${mapId}`, options);
    }

    async deleteSegment(segmentID){
        await requestHandler.getToken();
        let options = {
            method: 'delete',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/json'
            }
        };
        return requestHandler.request(`${this.apiURL}/2.0/config/gl/value/${segmentID}`, options)
    }

    async addAllocationSegmenteRow(segments, segmentsName){
        await requestHandler.getToken();

        let body = JSON.stringify({
            "row_id": 0,
            "value": {
                [segments[0]]: segmentsName[0],
                [segments[1]]: segmentsName[1],
                [segments[2]]: segmentsName[2],
                [segments[3]]: segmentsName[3],
                [segments[4]]: segmentsName[4]
            }
        });
        let options = {
            method: 'post',
            form: true,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': body.length,
                'Authorization': 'Bearer ' + requestHandler.token
            }
        };
        
        requestHandler.requestJsonBody(`${this.apiURL}/2.0/config/gl/value`, options, body);
    }

    async getAllValuesManagGL(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/gl/values?culture=${this.culture}`);
    }

    async getmanageGLMapping(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/gl/values/importMaps?culture=${this.culture}&per_page=10`);
    }

    async deleteGLMapping(mapId){
        await requestHandler.getToken();
        let options = {
            method: 'delete',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/json'
            }
        };
        return requestHandler.request(`${this.apiURL}/2.0/config/gl/values/importMap/${mapId}`, options);
    }

    async getuserGLDefault(){
        await requestHandler.getToken();
        return requestHandler.request(`${this.apiURL}/2.0/config/gl/default/users?culture=${this.culture}&per_page=10`);
    }

    async deleteUserInGroup(groupId,groupTypeId,userId){
        await requestHandler.getToken();

        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {
            ids: [ userId ]
        }

        return requestHandler.request(`${this.apiURL}/2.0/config/groupType/${groupTypeId}/group/${groupId}/removeUser/bulk`,options,body,false);
    }


    async changeLanguage(language){
        await requestHandler.getToken();
        const myProfile = await this.getMyProfile();

        if (myProfile.language_code===language)
            return;

        let options = {
            method: 'post',
            form: true,
            headers: {
                'Authorization': `Bearer ${requestHandler.token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let body = {    
            language_code: language
        };

        await requestHandler.request(`${this.apiURL}/1.0/config/usersettings/${myProfile.user_id}`,options,body)
            .catch(error => {
                console.log('There was an error while trying to change the language:');
                console.log(error);
            });
    }
}