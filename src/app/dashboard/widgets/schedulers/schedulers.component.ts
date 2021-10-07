import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { SchedulerAddComponent } from '../scheduler-add/scheduler-add.component';
import { SchedulerWidget, Widget } from '../widget';

@Component({
  selector: 'app-schedulers',
  templateUrl: './schedulers.component.html',
  styleUrls: ['./schedulers.component.sass']
})
export class SchedulersComponent implements OnInit, OnChanges {

  //@Input() items: Widget[] = []
  @Input() widget!: Widget
  @Output() widgetEvent: EventEmitter<Widget> = new EventEmitter<Widget>()
  @ViewChild(SchedulerAddComponent, {static:false}) editComponent!: SchedulerAddComponent
  schedulers: SchedulerWidget[] = []

  constructor(private service: DashboardService) { }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.schedulers = (await this.service.cast<SchedulerWidget>(this.widget))
  }

  ngOnInit(): void {

  }

  async delete(scheduler: SchedulerWidget) {
    let index = this.schedulers.indexOf(scheduler)
    this.schedulers.splice(index, 1)
    this.widget = await this.service.edit(this.widget, this.schedulers)
    this.widgetEvent.emit(this.widget)
  }

  async add(scheduler: SchedulerWidget) {
    this.schedulers.push(scheduler)
    this.widget = await this.service.edit(this.widget, this.schedulers)
    this.widgetEvent.emit(this.widget)
  }

  edit(selected: SchedulerWidget) {
    this.editComponent.scheduler = selected
  }
}
