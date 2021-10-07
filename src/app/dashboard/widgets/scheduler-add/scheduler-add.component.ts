import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { SchedulerWidget } from '../widget';

@Component({
  selector: 'app-scheduler-add',
  templateUrl: './scheduler-add.component.html',
  styleUrls: ['./scheduler-add.component.sass']
})
export class SchedulerAddComponent implements OnInit {

  editing: boolean = false
  desc: string = ''
  date!: Date
  @Input() scheduler!: SchedulerWidget
  @Output() addEvent: EventEmitter<SchedulerWidget> = new EventEmitter<SchedulerWidget>()

  constructor() { }

  ngOnInit(): void {
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (this.scheduler) this.toggle()
  }

  toggle(): void {
    this.editing = !this.editing
    if (!this.editing) this.desc = ''
  }

  async add() {
    let withDate = new Date(this.date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)
    this.addEvent.emit(<SchedulerWidget> { 
      desc: this.desc, 
      end: this.date, 
      display: withDate ? "datetime" : "time"
    })
    this.editing = false
    this.desc = ''
  }
}
