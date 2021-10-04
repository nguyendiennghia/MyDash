import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TodoItem, TodoWidget, Widget } from '../widget';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { DashboardService, getTodos } from '../../dashboard.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.sass']
})
export class TodosComponent implements OnInit, OnChanges {

  @Input() widget!: Widget
  @Output() widgetEvent: EventEmitter<Widget> = new EventEmitter<Widget>()
  items: TodoWidget[] = [];

  constructor(private service: DashboardService) { }

  ngOnInit(): void {
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.items = (await this.service.cast<TodoWidget>(this.widget))
    // TODO: Support many

  }

  async drop(event: CdkDragDrop<TodoItem[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    // TODO: Save down updates
    let widget = await this.service.edit(this.widget, this.items)
    this.widgetEvent.emit(widget)
  }

  async addTodo(item: TodoItem) {
    this.items[0].todo.push(item)
    debugger;
    this.widgetEvent.emit(this.items[0])

  }
  async addOngoing(item: TodoItem) {
    this.items[0].ongoing.push(item)
    this.widgetEvent.emit(this.items[0])
    //let index = this.widgets.findIndex(w => w.id == widget.id)
    //await this.service.save(this.groupId, this.widgets.splice(index, 1, widget))
    //await this.service.save(this.groupId, this.widgets)
  }
  async addDone(item: TodoItem) {
    this.items[0].done.push(item)
    this.widgetEvent.emit(this.items[0])
    //let index = this.widgets.findIndex(w => w.id == widget.id)
    //await this.service.save(this.groupId, this.widgets.splice(index, 1, widget))
    //await this.service.save(this.groupId, this.widgets)
  }

  async delete(items: TodoItem[], item: TodoItem) {
    let index = items.indexOf(item)
    items.splice(index, 1)
  }

  async edit(item: TodoItem) {
    
  }
}
