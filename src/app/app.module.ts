import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContactComponent } from './contact/contact.component';
import { ConfigComponent } from './config/config.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { MaterialComponent } from './material.component'
import { FlexLayoutModule } from '@angular/flex-layout';
import { CdkComponent } from './cdk.component'
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FakeHttpInterceptor } from './fake/backend';
import { CookieService } from 'ngx-cookie-service';
import { TodosComponent } from './dashboard/widgets/todos/todos.component';
import { UrlsComponent } from './dashboard/widgets/urls/urls.component';
import { RssComponent } from './dashboard/widgets/rss/rss.component';
import { SchedulersComponent } from './dashboard/widgets/schedulers/schedulers.component';
import { GraphsComponent } from './dashboard/widgets/graphs/graphs.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DashboardComponent,
    ContactComponent,
    ConfigComponent,
    AuthComponent,
    LoginComponent,
    TodosComponent,
    UrlsComponent,
    RssComponent,
    SchedulersComponent,
    GraphsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,

    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialComponent,
    CdkComponent,
    FlexLayoutModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeHttpInterceptor,
      multi: true
    },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
