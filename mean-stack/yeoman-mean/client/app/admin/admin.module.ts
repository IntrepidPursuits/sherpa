import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../components/auth/auth-guard.service';
import { AdminComponent } from './admin.component';


const adminRoutes: Routes = [{
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
}];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forChild(adminRoutes),

    ],
    declarations: [
        AdminComponent,
    ],
    exports: [
        AdminComponent,
    ],
})
export class AdminModule {}
