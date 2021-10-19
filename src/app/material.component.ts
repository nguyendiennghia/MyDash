import { NgModule } from '@angular/core';

import {MatIconModule} from '@angular/material/icon'
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatButtonModule} from '@angular/material/button'
import {MatInputModule} from '@angular/material/input'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatCardModule} from '@angular/material/card'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatGridListModule} from '@angular/material/grid-list'
import {MatTooltipModule} from '@angular/material/tooltip'
import {MatNativeDateModule} from '@angular/material/core'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatDialogModule} from '@angular/material/dialog'
import {MatExpansionModule} from '@angular/material/expansion'
import {MatProgressBarModule} from '@angular/material/progress-bar'


import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker'
import { CarouselModule } from 'ngx-owl-carousel-o'

@NgModule({
  exports: [
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatExpansionModule,
    MatProgressBarModule,

    NgxMaterialTimepickerModule,
    CarouselModule
  ]
})
export class MaterialComponent  {}
