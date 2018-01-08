import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollapseModule } from 'ngx-bootstrap';


import { RouterModule } from '@angular/router';

import { AuthModule } from './auth/auth.module';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { OauthButtonsComponent } from './oauth-buttons/oauth-buttons.component';

@NgModule({
    imports: [
        CommonModule,
        CollapseModule,
        AuthModule,

        RouterModule,
    ],
    declarations: [
        NavbarComponent,
        FooterComponent,
        OauthButtonsComponent,
    ],
    exports: [
        NavbarComponent,
        FooterComponent,
        OauthButtonsComponent,
    ]
})
export class DirectivesModule {}
