import { Component } from '@angular/core';
import { AuthService } from '../../../components/auth/auth.service';

// @flow
interface User {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

@Component({
    selector: 'settings',
    template: require('./settings.html'),
})
export class SettingsComponent {
    user: User = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
    errors = {other: undefined};
    message = '';
    submitted = false;
    AuthService;

    static parameters = [AuthService];
    constructor(_AuthService_: AuthService) {
        this.AuthService = _AuthService_;
    }

    changePassword(form) {
        if(form.invalid) return;

        this.submitted = true;

        return this.AuthService.changePassword(this.user.oldPassword, this.user.newPassword)
            .then(() => {
                this.message = 'Password successfully changed.';
            })
            .catch(() => {
                // form.password.$setValidity('mongoose', false);
                this.errors.other = 'Incorrect password';
                this.message = '';
            });
    }
}
