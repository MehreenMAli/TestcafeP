import { Selector } from 'testcafe';

export default class ProjectModal{
    constructor () {
        this.root = Selector('tem-project-edit');
        this.projectNameInput = this.root.find('input[formcontrolname="project_name"]');
        this.projectCodeInput = this.root.find('input[formcontrolname="project_code"]');
        this.datePicker = this.root.find('input[name="dp1"]');
        this.saveButton = this.root.find('button.btn.btn-primary').nth(0);
        this.closeButton = this.root.find('button.btn.btn-primary').nth(1);
        this.labels = this.root.find('label.legend');
    }
}