import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SchedulerReoccuranceType, SchedulerWidget } from '../widget';

@Component({
  selector: 'app-scheduler-add',
  templateUrl: './scheduler-add.component.html',
  styleUrls: ['./scheduler-add.component.sass']
})
export class SchedulerAddComponent implements OnInit {

  editing: boolean = false
  desc: string = ''
  date!: string
  time!: string
  occurance: boolean = false

  private _scheduler!: SchedulerWidget
  @Input()
  set scheduler(value: SchedulerWidget) {
    this._scheduler = value;
    this.editing = true
    this.desc = value.desc
    let date = new Date(value.end)
    if (value.reoccurance == SchedulerReoccuranceType.Unset)
      this.date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
    else {
      this.time = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}`
      this.occurance = true
    }
  }
  get scheduler() { return this._scheduler }

  @Output() addEvent: EventEmitter<SchedulerWidget> = new EventEmitter<SchedulerWidget>()

  constructor() { }

  ngOnInit(): void {
  }

  toggle(): void {
    this.editing = !this.editing
    if (!this.editing) {
      this._scheduler = null!
      this.date = ''
      this.time = ''
    }
  }

  async add() {
    this.modify(false)
  }

  async edit() {
    this.modify()
  }

  private modify(updating: boolean = true) {
    let date: Date
    let withDate: boolean = false
    let reoccuranceMode = SchedulerReoccuranceType.Unset
    if (this.occurance) {
      date = new Date()
      //let locale = date.toLocaleString() // "09/10/2021, 10:30:09"
      let time = this.time.match(/([\d]{2})/g)!  // e.g 11:30
      let hour = +time[0], min = +time[1]
      date.setHours(hour, min, 0)
      reoccuranceMode = SchedulerReoccuranceType.Daily
    }
    else {
      date = new Date(this.date)
      withDate = new Date(this.date).setHours(0,0,0,0) > new Date().setHours(0,0,0,0)
    }
    if (updating) {
      this.scheduler.desc = this.desc
      this.scheduler.end = date
      this.scheduler.display = withDate ? "datetime" : "time"
      this.scheduler.reoccurance = reoccuranceMode
      this.addEvent.emit(this.scheduler)
    }
    else {
      this.addEvent.emit(<SchedulerWidget> { 
        desc: this.desc, 
        end: date, 
        display: withDate ? "datetime" : "time",
        reoccurance: reoccuranceMode
      })
    }
    this.editing = false
    this.desc = ''
  }

  setDate(evt: any) {
    this.date = evt.target.value.slice(0, 16)
  }
}
