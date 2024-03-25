import { checkRequests, logger } from '../../utils/helperFunctions';
import { parseArguments } from '../../utils/parseArguments';
import { before, after, registerFixture } from './../../hooks';
import UserDropdown from '../../page-models/userDropdown';
import APIHandler from '../../utils/apiHandler';
import users from '../../users';
import config from '../../config';
import Page from '../../page-models/page.js'

const apiHandler = new APIHandler();
const userDropdown = new UserDropdown();
const page = new Page();
const args = parseArguments();

registerFixture();
fixture `Login - Running on "${args.env.toUpperCase()}"`
    .page(config[args.env].baseUrl)
    .requestHooks(logger)
    .before(async ctx  => {
        await before();
        
	})
	.after( async () => {
		await after();
	})
	.afterEach( async () => {
        await checkRequests(logger.requests);
    });
    
    test(`TC 26003: Login`, async t => {

        let currentUser = users[args.user];

        let profile = await apiHandler.getMyProfile();
        let name = `${profile.first_name} ${profile.middle_name} ${profile.last_name}`;

        await page.login(currentUser.username, 
            currentUser.password,
            currentUser.landingPage);

        await t.expect(userDropdown.userName.innerText).contains(name);

        await page.logout();
    });