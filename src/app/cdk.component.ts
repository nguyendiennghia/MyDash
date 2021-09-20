import { NgModule } from '@angular/core';
import {OverlayModule} from '@angular/cdk/overlay'
import { HttpClientModule } from '@angular/common/http';
import {DragDropModule} from '@angular/cdk/drag-drop'


@NgModule({
  exports: [
    OverlayModule,
    HttpClientModule,
    DragDropModule
  ]
})
export class CdkComponent {}