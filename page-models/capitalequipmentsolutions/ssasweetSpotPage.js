import { Selector } from "testcafe";
import Table from '../table';

export default class SSASweetSpotPage {
    constructor() {
        this.label = Selector('label.legend');
        this.graphCanvas = Selector('canvas.chartjs-render-monitor');
        //Tabs
        this.summaryTab = Selector('#ssa_summary');
        this.maintenanceRepairTab = Selector('#ssa_maint_repair');
        this.fuelTab = Selector('#ssa_fuel');
        this.tiresTab = Selector('#ssa_tires');
        this.fixedTab = Selector('#ssa_fixed');

        //Summary
        this.yearlySummaryTable = new Table(Selector('#table-yearly_summary'));
        this.totalSummaryTable = new Table(Selector('#table-total_summary'));
        this.totalNetLabel = Selector('h6.total-net-savings.primary-color');

        //Maintenance & Repair
        this.yearlyMaintRepairTable = new Table(Selector('#table-yearly_maint_repair'));
        this.totalMaintRepairTable = new Table(Selector('#table-total_maint_repair'));
        
        //Fuel
         this.yearlyFuelTable = new Table(Selector('#table-yearly_fuel'));
         this.totalFuelTable = new Table(Selector('#table-total_fuel'));

         //Tires
         this.yearlyTiresTable = new Table(Selector('#table-yearly_tires'));
         this.totalTiresTable = new Table(Selector('#table-total_tires'));
        
         //Fixed
         this.yearlyFixedTable = new Table(Selector('#table-yearly_fixed'));
         this.totalFixedTable = new Table(Selector('#table-total_fixed'));
    }
}