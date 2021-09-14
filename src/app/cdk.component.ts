import { NgModule } from '@angular/core';
import {OverlayModule} from '@angular/cdk/overlay'
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  exports: [
    OverlayModule,
    HttpClientModule
  ]
})
export class CdkComponent {}