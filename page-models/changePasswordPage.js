import { Selector } from 'testcafe';
import { error } from './..//utils/helperFunctions';

export default class ChangePasswordPage{
    constructor(){
        this.oldPasswordInput = Selector('input[formcontrolname="old_password"]');
        this.oldPasswordInput.error = error(this.oldPasswordInput);
        this.newPasswordInput = Selector('input[formcontrolname="new_password"]');
        this.newPasswordInput.error = error(this.newPasswordInput);
        this.repeatNewPasswordInput = Selector('input[formcontrolname="repeat_new_password"]');
        this.repeatNewPasswordInput.error = error(this.repeatNewPasswordInput);
        this.recaptcha = Selector('re-captcha');
        this.cancelButton = Selector('#cancel-pass');
        this.saveButton = Selector('#save-pass');
        this.legends = Selector('label[class="legend"]');
    }
}