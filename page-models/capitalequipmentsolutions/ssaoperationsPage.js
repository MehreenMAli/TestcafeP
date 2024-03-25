import { Selector } from "testcafe";
import Table from '../table';

export default class SSAOperationsPage {
    constructor() {
        //Iputs
        this.fuelcostpergallonInput = Selector('input[formcontrolname="fuel_cost_per_gallon"]');
        this.milespergallonInput = Selector('input[formcontrolname="miles_per_gallon"]');
        this.annualmpgimprovementInput = Selector('input[formcontrolname="annual_mpg_improvement"]');
        this.fueldegradationmileagestartInput = Selector('input[formcontrolname="fuel_degradation_mileage_start"]');
        this.incrementalmpgdegradationdecreaseInput = Selector('input[formcontrolname="incremental_mpg_degradation_decrease"]');
        this.allocationfortiresInput = Selector('input[formcontrolname="allocation_for_tires"]');
        
        //Labels
        this.label = Selector('label.legend');
        this.titleTable = Selector('h6');
       
        //Table
        this.operationTable = new Table(Selector('table.table.cor360-table'));

        //Buttons
        this.saveButton = Selector('#submit-button');
        
    }
}