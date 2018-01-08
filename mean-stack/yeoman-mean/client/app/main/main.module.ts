import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';


import { RouterModule, Routes } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap';

import { MainComponent } from './main.component';
import { SocketService } from '../../components/socket/socket.service';

export const ROUTES: Routes = [
    { path: 'home', component: MainComponent },
];


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forChild(ROUTES),


        TooltipModule.forRoot(),
    ],
    declarations: [
        MainComponent,
    ],
    providers: [
        SocketService,
    ],
    exports: [
        MainComponent,
    ],
})
export class MainModule {}
