import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TodoWidget, Widget } from '../widget';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { DashboardService, getTodos } from '../../dashboard.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.sass']
})
export class TodosComponent implements OnInit, OnChanges {

  // todo = [
  //   'Get to work',
  //   'Pick up groceries'
  // ]

  // inProgress = [
  //   'Go home',
  //   'Get up'
  // ]

  // done = [
  //   'Brush teeth',
  //   'Check e-mail'
  // ]

  @Input() widget!: Widget
  items: TodoWidget[] = [];

  constructor(private service: DashboardService) { }

  ngOnInit(): void {
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.items = await this.service.cast<TodoWidget>(this.widget)
    // TODO: Support many
    
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    // TODO: Save down updates
  }
}
