import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../../components/auth/auth.service';

// @flow
interface User {
    name: string;
    email: string;
    password: string;
}

@Component({
    selector: 'login',
    template: require('./login.html'),
})
export class LoginComponent {
    user: User = {
        name: '',
        email: '',
        password: '',
    };
    errors = {login: undefined};
    submitted = false;
    AuthService;
    Router;


    static parameters = [AuthService, Router];
    constructor(_AuthService_: AuthService, router: Router) {
        this.AuthService = _AuthService_;
        this.Router = router;

    }

    login() {
        this.submitted = true;

        return this.AuthService.login({
            email: this.user.email,
            password: this.user.password
        })
            .then(() => {
                // Logged in, redirect to home
                this.Router.navigateByUrl('/home');

            })
            .catch(err => {
                this.errors.login = err.message;
            });
    }
}
