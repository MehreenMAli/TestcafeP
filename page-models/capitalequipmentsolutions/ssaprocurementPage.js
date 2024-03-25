import { Selector } from "testcafe";
import Modal from "../modal";

export default class SSAProcurementPage {
    constructor() {
        this.label = Selector('label.legend');

        this.elementDropdown = Selector('div.dropdown-arrow');
        this.assetType = this.elementDropdown.nth(0);
        this.dropDownOptions = Selector('p.dropdown-option');
        this.modelYear = this.elementDropdown.nth(1);
        this.equipmentTypeInput = Selector('input[formcontrolname="equipment_type"]');
        this.oemInput = Selector('input[formcontrolname="oem"]');
        this.modelInput = Selector('input[formcontrolname="model"]');
        this.oecInput = Selector('input[formcontrolname="oec"]');
        this.estimatedResaleValueInput = Selector('input[formcontrolname="estimated_resale_value"]');
        this.inflationRateInput = Selector('input[formcontrolname="inflation_rate"]');
        this.saveButton = Selector('#submit-button');
        this.confirmationModal = new Modal()
    }
}