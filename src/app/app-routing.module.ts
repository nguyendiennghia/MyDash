import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {LoginComponent} from './auth/login/login.component'
import {PageNotFoundComponent} from './page-not-found/page-not-found.component'
import {DashboardComponent} from './dashboard/dashboard.component'
import {ConfigComponent} from './config/config.component'
import {ContactComponent} from './contact/contact.component'

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
