import { Component, Input, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { DashboardService } from '../../dashboard.service';
import { TodoWidget, Widget, WidgetType } from '../widget';

@Component({
  selector: 'app-widget-container',
  templateUrl: './widget-container.component.html',
  styleUrls: ['./widget-container.component.sass']
})
export class WidgetContainerComponent implements OnInit {

  @Input() color = ''
  @Input() name = ''
  @Input() desc = ''
  @Input() groupId: number | string = -1
  widgets!: Widget[]
  widgetTypes = WidgetType;

  constructor(private service: DashboardService) { }

  ngOnInit(): void {
    (async () => await this.service.getWidgets(this.groupId)
      .then(widgets => this.widgets = widgets)
    )()
  }

  async handleWidget(widget: Widget) {
    //await this.service.save(this.groupId, this.widgets.splice(index, 1, widget))
    //console.log(JSON.stringify(widget))
    await this.service.save(this.groupId, this.widgets)
  }
}
