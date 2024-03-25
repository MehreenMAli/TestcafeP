import { parseArguments } from './parseArguments';
import config from '../config';
import users from '../users';

const url = require('url');
const querystring = require('querystring');

let instance = null;

export default class RequestHandler {
    constructor() {
        if (!instance) {
            instance = this;
            let args = parseArguments();
            this.token = '';
            this.tokenTTL = 0;
            this.timestamp = (new Date()).getTime() / 1000 | 0;

            try {
                this.username = users[args.user].username;
                this.password = users[args.user].password;
                this.culture = args.culture;
                this.env = args.env;
                this.apiURL = config[args.env].apiURL;
                this.tokenURL = config[args.env].tokenURL;
                this.url_cor360 = config[args.env].url_cor360;
                this.url_epay = config[args.env].url_epay;
                this.url_tem = config[args.env].url_tem;
                this.url_cor360approval = config[args.env].url_cor360approval;
            }
            catch (err) {
                console.log('One of the parameters is not valid: \n');
                console.log(err);
            }
        }
        return instance;

    }

    tokenExpired() {
        let now = (new Date()).getTime() / 1000 | 0;
        let timePassed = now - this.timestamp;
        if (timePassed >= this.tokenTTL)
            return true;
        return false;
    }

    async getToken() {
        if (!this.token || this.tokenExpired()) {
            let options = {
                form: true,
                method: 'post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            };
            let body = {
                username: this.username,
                password: this.password
            };
            const response = await this.request(this.tokenURL, options, body)
                .then(response => {
                    this.token = response.access_token;
                    this.refreshToken = response.refresh_token;
                    this.timestamp = (new Date()).getTime() / 1000 | 0;
                    this.tokenTTL = parseInt(response.expires_in);
                })
                .catch(error => {
                    console.log(error)
                    console.log('Could not obtain access token.');
                });
        }
        return this.token;
    }

    async request(address, options = { method: 'get', headers: { 'Authorization': `Bearer ${this.token}` } }, body, isJson = true) {
        return new Promise((resolve, reject) => {
            options = this.addURLtoOptions(address, options, body);
            const lib = address.startsWith('https') ? require('https') : require('http');
            const request = lib.request(options, (response) => {
                if (response.statusCode < 200 || response.statusCode > 299) {
                    console.log('get token call and its params')
                    console.log(address, options, body)
                    reject(new Error(`Request ${address} failed, status code: ` + response.statusCode));
                }

                response.setEncoding('utf8');
                const responseBody = [];
                response.on('data', (chunk) => responseBody.push(chunk));
                response.on('end', () => {
                    let joinedData;
                    try {
                        if (typeof responseBody != undefined && responseBody != '' && responseBody != null) {
                            joinedData = responseBody.join('');
                            if (isJson)
                                resolve(JSON.parse(joinedData));
                            else
                                resolve(joinedData);
                        } else {
                            resolve('');
                        }

                    }
                    catch (err) {
                        reject(`Could not parse the Json data:
                        Response: ${joinedData}
                        Error: ${err}`);
                    }
                });
            });
            request.on('error', (err) => reject(err));
            if (body) {
                request.write(querystring.stringify(body));
            }
            request.end();
        });
    }

    addURLtoOptions(address, options) {
        const myURL = url.parse(address);
        options['hostname'] = myURL.hostname;
        options['path'] = myURL.path;
        return options;
    }
    //This request must be used to make post request using Content-Type JSON
    async requestJsonBody(url, options, body) {
        return new Promise((resolve, reject) => {
            const https = require('https');
            let postData = body;
            options = this.addURLtoOptions(url, options)

            let req = https.request(options, (res) => {
                const responseBody = [];
                res.on('data', (d) => { responseBody.push(d) });
                res.on('end', () => {
                    let data = responseBody.join('');
                    resolve(JSON.parse(data));
                })
            });
            req.on('error', (err) => reject(err));
            req.write(postData);
            req.end();
        });
    }
}