import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RssWidget, TodoItem } from '../widget';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-rss-config',
  templateUrl: './rss-config.component.html',
  styleUrls: ['./rss-config.component.sass']
})
export class RssConfigComponent implements OnInit, OnChanges {

  @Input() rss!: RssWidget
  @Output() configEvt: EventEmitter<boolean> = new EventEmitter<boolean>()
  sources: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.init()
  }

  private init() {
    this.sources = []
    this.rss.sources.forEach(src => this.sources.push(src))
  }

  close(evt: any) {
    this.init()
    this.configEvt.emit(false)
  }

  apply(evt: any) {
    this.rss.sources = this.sources
    this.configEvt.emit(true)
  }

  addSource(item: TodoItem) {
    this.sources.push(item.name)
  }

  async drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  applicable(): boolean {
    return this.sources.length != this.rss.sources.length ||
      this.sources.some((v, i) => v != this.rss.sources[i])
  }

  async delete(src: string) {
    let index = this.sources.indexOf(src)
    this.sources.splice(index, 1)
  }
}
