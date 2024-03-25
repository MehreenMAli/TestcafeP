import { Selector } from 'testcafe';
import Table from '../../table';
import { Criteria, textInCell, deleteElement, editElement } from '../../../utils/helperFunctions';


export default class ManageGLMapping{
    constructor(){
        
        this.titlePage = Selector('#breadcrumb-title');
        this.addButton = Selector('#add-new');
        this.manageGLMappingTable = new Table(Selector('#table-mappingList'));

        this.editButton = Selector('i.fa.fa-pencil');
        //Manage GL Mapping
        this.label = Selector('label.legend');
        this.mappingNameInput = Selector('#mapping-name-textbox');
        this.fileTypeDropdown = Selector('#file-type-dropdown');
        this.hasHeaderCheckbox = Selector('#has-header-checkbox');
        this.fileUpLoadInput = Selector('#file-upload');
        
        //after selecting a file on the uploader
        this.fileTableMapped = Selector('table.table.cor360-table');
        this.secondaryTableRow = Selector('#secundary_fields_row')
        this.primaryTableRow = Selector('#primary_fields_row')
            //0 index is hidden on the primary and secondary row inputs, don't use it, starts with 1 index.
        this.secondaryRowDropdowns = Selector('#secundary_fields_row cor-dropdown');
        this.primaryRowDropdowns = Selector('#primary_fields_row cor-dropdown');


        this.textarea = Selector('#tests');
        //Buttons
        this.closeButton = Selector('i.fa.fa-times');
        this.uploadButton = Selector('#upload-file-button');
        this.testButton = Selector('#usr-map-test-button');
        this.mapClearButton = Selector('#usr-map-clear-button');
        this.usrSaveButton = Selector('#usr-map-save-button');
        this.usrImportButton = Selector('#usr-map-import-button');
    }


    async deleteMapping(mappingName){
        let criteria = new Criteria(mappingName, textInCell, deleteElement);
        return await this.manageGLMappingTable.findElement(criteria);
    }

    async existMap(allMaps, mapName){
        for (let i = 0; i < allMaps.total; i++) {
            if (allMaps.items[i].mapping_name == mapName) {
                return true;
            } 
        }
    }

    async editMapping(mappingName){
        let criteria = new Criteria(mappingName, textInCell, editElement);
        return await this.manageGLMappingTable.findElement(criteria);
    }
}