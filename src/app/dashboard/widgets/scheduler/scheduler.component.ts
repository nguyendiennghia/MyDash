import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { SchedulerWidget } from '../widget';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.sass']
})
export class SchedulerComponent implements OnInit {

  @Input() scheduler!: SchedulerWidget
  @Output() deleteEvent: EventEmitter<SchedulerWidget> = new EventEmitter<SchedulerWidget>()
  private subscription!: Subscription
  display: string = ''

  constructor() { }

  ngOnInit(): void {
    this.subscription = interval(1000)
      .subscribe(x => this.update())
  }

  update(): void {
    let now = new Date()
    let ms = new Date(this.scheduler.end).valueOf() - now.valueOf()
    let seconds = Math.floor(ms / 1000)

    let days = Math.floor(seconds / 86400)
    let hours = Math.floor( (seconds - days * 86400) / 3600 )
    let mins = Math.floor( (seconds - days * 86400 - hours * 3600) / 60 )
    let sds = seconds - days * 86400 - hours * 3600 - mins * 60

    // TODO: mode
    if (this.scheduler.display == 'datetime')
      this.display = `${days} days, ${this.format(hours)}:${this.format(mins)}:${this.format(sds)}`
    else
      this.display = `${this.format(hours)}:${this.format(mins)}:${this.format(sds)}`
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  delete() {
    this.deleteEvent.emit(this.scheduler)
  }

  private format(num: number) {
    return num.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
  }
}
