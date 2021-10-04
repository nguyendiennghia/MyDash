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
    //let widget = await this.service.edit(this.widget, this.items)
    //this.widgetEvent.emit(widget)
    await this.submit(this.items)
  }

  async addTodo(item: TodoItem) {
    this.items[0].todo.push(item)
    //this.widget = await this.service.edit(this.widget, [ this.items[0] ])
    //this.widgetEvent.emit(this.widget)
    await this.submit([ this.items[0] ])
  }
  async addOngoing(item: TodoItem) {
    this.items[0].ongoing.push(item)
    await this.submit([ this.items[0] ])
  }
  async addDone(item: TodoItem) {
    this.items[0].done.push(item)
    await this.submit([ this.items[0] ])
  }

  async delete(items: TodoItem[], item: TodoItem) {
    let index = items.indexOf(item)
    items.splice(index, 1)
    
  }

  private async submit(todos: TodoWidget[]) {
    this.widget = await this.service.edit(this.widget, todos)
    this.widgetEvent.emit(this.widget)
  }

  async edit(item: TodoItem) {
    
  }
}
