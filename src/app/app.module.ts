import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent, DashboardConfigComponent } from './dashboard/dashboard.component';
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
import { WidgetContainerComponent } from './dashboard/widgets/widget-container/widget-container.component';
import { TodoAddComponent } from './dashboard/widgets/todo-add/todo-add.component';
import { SchedulerComponent } from './dashboard/widgets/scheduler/scheduler.component';
import { SchedulerAddComponent } from './dashboard/widgets/scheduler-add/scheduler-add.component';
import { StorageServiceModule } from 'ngx-webstorage-service'
import { RouterModule, ROUTES } from '@angular/router';
import { RssConfigComponent } from './dashboard/widgets/rss-config/rss-config.component';
import { RightMoveComponent } from './dashboard/widgets/right-move/right-move.component';

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
    GraphsComponent,
    WidgetContainerComponent,
    TodoAddComponent,
    SchedulerComponent,
    SchedulerAddComponent,
    DashboardConfigComponent,
    RssConfigComponent,
    RightMoveComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,

    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialComponent,
    CdkComponent,
    FlexLayoutModule,
    StorageServiceModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FakeHttpInterceptor,
      multi: true
    },
    CookieService
  ],
  bootstrap: [AppComponent],
  entryComponents: [DashboardConfigComponent]
})
export class AppModule { }
