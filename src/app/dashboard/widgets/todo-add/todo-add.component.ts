import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodoItem, Widget } from '../widget';

@Component({
  selector: 'app-todo-add',
  templateUrl: './todo-add.component.html',
  styleUrls: ['./todo-add.component.sass']
})
export class TodoAddComponent implements OnInit {

  todoName: string = ''
  editing: boolean = false;
  @Input() addText: string = 'Add description'
  @Output() addEvent: EventEmitter<TodoItem> = new EventEmitter<TodoItem>()

  constructor() { }

  ngOnInit(): void {
  }

  toggle(): void {
    this.editing = !this.editing
    if (!this.editing) this.todoName = ''
  }

  add(): void {
    this.addEvent.emit(<TodoItem> { name: this.todoName })
    this.editing = false
    this.todoName = ''
  }
}
