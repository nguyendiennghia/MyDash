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
  date!: string

  private _scheduler!: SchedulerWidget
  @Input() 
  set scheduler(value: SchedulerWidget) {
    this._scheduler = value;
    this.editing = true
    this.desc = value.desc
    this.date = new Date(new Date(value.end).getTime() - (new Date(value.end).getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
  }
  get scheduler() { return this._scheduler }

  @Output() addEvent: EventEmitter<SchedulerWidget> = new EventEmitter<SchedulerWidget>()

  constructor() { }

  ngOnInit(): void {
  }

  // async ngOnChanges(changes: SimpleChanges): Promise<void> {
  //   if (this.scheduler) this.toggle()
  // }

  toggle(): void {
    this.editing = !this.editing
    if (!this.editing) {
      this._scheduler = null!
      this.date = ''
    }
  }

  async add() {
    this.modify(false)
  }

  async edit() {
    this.modify()
  }

  private modify(updating: boolean = true) {
    let date = new Date(this.date) 
    let withDate = new Date(this.date).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)
    if (updating) {
      this.scheduler.desc = this.desc
      this.scheduler.end = date
      this.scheduler.display = withDate ? "datetime" : "time"
      this.addEvent.emit(this.scheduler)
    }
    else {
      this.addEvent.emit(<SchedulerWidget> { 
        desc: this.desc, 
        end: date, 
        display: withDate ? "datetime" : "time"
      })
    }
    this.editing = false
    this.desc = ''
  }

  setDate(evt: any) {
    this.date = evt.target.value.slice(0, 16)
  }
}
