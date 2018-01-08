// @flow
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../../../components/auth/auth.service';


interface User {
    name: string;
    email: string;
    password: string;
}

@Component({
    selector: 'signup',
    template: require('./signup.html')
})
export class SignupComponent {
    user: User = {
        name: '',
        email: '',
        password: ''
    };
    errors = {};
    submitted = false;
    AuthService;
    Router;


    static parameters = [AuthService, Router];
    constructor(_AuthService_: AuthService, router: Router) {
        this.AuthService = _AuthService_;
        this.Router = router;    }

    register(form) {
        if(form.invalid) return;

        this.submitted = true;

        return this.AuthService.createUser({
            name: this.user.name,
            email: this.user.email,
            password: this.user.password
        })
            .then(() => {
                // Account created, redirect to home
                this.Router.navigateByUrl('/home');                            })
            .catch(err => {
                err = err.data;
                this.errors = {};
                // Update validity of form fields that match the mongoose errors
                err.errors.forEach((error, field) => {
                    this.errors[field] = error.message;
                });
            });
    }
}
