import { Selector, t } from 'testcafe';

export default class BrandingModulePage{
    constructor() {
        this.uploadInput = Selector('#file-upload');
        this.deleteLogoButton = Selector('#delete-logo');
        this.copyrightInput = Selector('input[id="copyright"]');
        this.paletteCheckboxes = Selector('input[name="paletteColor"]');
        this.addCustomButton = Selector('#add-palette');
        this.applyButton = Selector('#apply');
        this.colors = Selector('div[class="branding-module-color-picked"]');
    }
    
    async getSelectedColors(){
        await t.wait(1000);
        let columns = Selector('div.color-palette');
        let columnsCount = await columns.count;
        
        for (let i=0;i<columnsCount;i++)
        {
            let checkbox = await columns.nth(i).find('input');
            if (await checkbox.checked){
                let array = [];
                let colors = columns.nth(i).find('div.branding-module-color-picked');
                let colorsCount = await colors.count;
                for (let j=0;j<colorsCount;j++){
                    let color = await colors.nth(j);
                    let style = await color.style;
                    array.push(style['background-color']);
                }
                return array;
            }
        }
        return;
    }
}