import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {MatButtonModule} from '@angular/material/button'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactComponent } from './contact/contact.component';
import { ConfigComponent } from './config/config.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component'

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DashboardComponent,
    ContactComponent,
    ConfigComponent,
    AuthComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,MatToolbarModule, MatInputModule,MatFormFieldModule,MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
