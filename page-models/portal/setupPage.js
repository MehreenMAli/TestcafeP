import { Selector } from 'testcafe';

export default class SetupPage {
    constructor () {
        this.label = Selector('label.legend');
        this.saveLookup = Selector('#save-lookup-button');
        this.addLookup = Selector('#add-lookup-button');
        this.saveSegment = Selector('#save-segment-button');
        this.addSegment = Selector('#add-segment-button');
        this.reorderSegments = Selector('#reorder-segments-button');
        this.cancelButton = Selector('#cancel-gl');
        this.customersDropdown = Selector('#customers-dropdown input');
        this.setupMenu = Selector('#setup');
        this.dropdownOptions = Selector('.dropdown-option');

        //Concat Segment side.
        this.lookupSegments = Selector('.gl-grid').nth(0);
        this.lookupFieldLabel = this.lookupSegments.find('label.legend');
        this.lookupFieldEditIcon = this.lookupSegments.find('.fa-pencil');
        this.lookupFieldThrashIcon = this.lookupSegments.find('.fa-trash');

        //New Segment side.
        this.segments = Selector('.gl-grid').nth(1);
        this.segmentFieldLabel = this.segments.find('label.legend');
        this.segmentFieldEditIcon = this.segments.find('.fa-pencil');
        this.segmentFieldThrashIcon = this.segments.find('.fa-trash');
        
    }

    async getCustomerName(env,clients){
        if(env == 'prod'){
           let client_id = '9999';
           for(let i=0; i<clients.length;i++){
                if(clients[i].client_id == client_id){
                    return clients[i].client_name;
                }
            }
            return null;
        }else{
            return 'Corcentric';
        }
    }
}