import { Selector } from 'testcafe';
import ViewPage from './viewPage';
import { visible } from '../../utils/helperFunctions';

export default class WorkPage extends ViewPage { 
    constructor () {
        super();
        this.approveIcon = Selector('#approve-button');
        this.rejectIcon = Selector('#reject-button');
        this.declineIcon = Selector('#decline-button');
        
        //Approve
        this.approveHeaderTitle = visible(Selector('.modal-title'));
        this.closeButton = visible(Selector('button[aria-label="Close"]'));
        this.approveLabel = visible(Selector('.modal-body'));

        //Reject
        this.historicalUsersDropdown = Selector('#user-mode-dropdown');
        this.activityUserDropdown =  Selector('#activity-user-dropdown');
        this.rejectComment = Selector('#reject-comment-textarea');
        this.rejectOkButton = Selector('#reject-ok-button');

        //Decline
        this.invalidChargeDropdown = Selector('#decline-reasons-dropdown');
        this.declineComment = Selector('#decline-comments-textarea');
        this.declineOkButton = Selector('#decline-ok-button')

    }
}