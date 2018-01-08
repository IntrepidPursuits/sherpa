import { Component } from '@angular/core';
import { UserService } from '../../components/auth/user.service';

@Component({
    selector: 'admin',
    template: require('./admin.html'),
    styles: [require('./admin.scss')],
})
export class AdminComponent {
    users: Object[];

    static parameters = [UserService];
    constructor(private userService: UserService) {
        this.userService = userService;
        // Use the user service to fetch all users
        this.userService.query().subscribe(users => {
            this.users = users;
        });
    }

    delete(user) {
        this.userService.remove(user).subscribe(deletedUser => {
            this.users.splice(this.users.indexOf(deletedUser), 1);
        });
    }
}
