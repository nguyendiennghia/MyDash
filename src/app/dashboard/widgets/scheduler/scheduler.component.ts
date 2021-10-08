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
  due: boolean = false

  constructor() { }

  ngOnInit(): void {
    this.subscription = interval(1000)
      .subscribe(x => !this.due ? this.update() : null)
  }

  async update() {
    let now = new Date()
    let ms = new Date(this.scheduler.end).valueOf() - now.valueOf()
    
    let seconds = ms <= 0 ? 0 : Math.floor(ms / 1000)
    let days = Math.floor(seconds / 86400)
    let hours = Math.floor( (seconds - days * 86400) / 3600 )
    let mins = Math.floor( (seconds - days * 86400 - hours * 3600) / 60 )
    let sds = seconds - days * 86400 - hours * 3600 - mins * 60

    // TODO: mode
    if (this.scheduler.display == 'datetime')
      this.display = `${days} days, ${this.format(hours)}:${this.format(mins)}:${this.format(sds)}`
    else
      this.display = `${this.format(hours)}:${this.format(mins)}:${this.format(sds)}`

    this.due = days + hours + mins + sds == 0
    if (this.due) await this.notify()
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

  private async notify(): Promise<void> {
    let title = this.scheduler.desc
    let msg = `Just dued after ${this.scheduler.end.toLocaleString()}`
    if(! ('Notification' in window) ){
      alert(msg)
      return
    }  
    Notification.requestPermission(function(permission){
      let notification = new Notification(title,
      {
        body: msg,
        icon: 'data:image/jpeg;base64,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ocYuy5sTu3LTm2kpYZCyTCgxzbWaRHmHG54fhdV8YTR/eTPgyfNYOFUh34kw+2KU/wBVGefqv3F1gcHF2Snl4Wqb/XVYm6va2icXv6Nu917l2UXJ/wA/aqjiVcZnXDWsA0bEwdUAnc0cST+JUo/DaQnM7Ege08zK5x/E6rew1kTXD6DBLUz+bUTs6kf7zGDS/e5Vk5S0bX12HRRjQwyz04Sbt+bMkv8AdKyXdr1JM8hhUrfo+HAjNOWSzMAu5moyh54Wbc2XYYYcjWsbuaA0ewCyr2yWzRps087+cqJNXPJzZb7wDx7z/QK0rso08q1PluU8Wq8lFO6V7va8nu+zZL1JBfJHavpFseYRlTg0Ejo3OibeN2dtgB1u023rekiBBaQCDoQRpb2L1RRZFnKTSTexGdA03q0XganQNN6tF4GqTRRkjwL8/V9J+JGdA03q0XganQNN6tF4GqTRMseA5+r6T8SM6BpvVovA1Ogab1aLwNUmiZY8Bz9X0n4kZ0DTerReBqdA03q0XgapNEyR4Dn6vpPxIzoGm9Wi8DU6BpvVovhtUmiZI8Bz9X0n4kZ0DTerReBqdA03q0XgapNEyR4Dn6vpPxIzoGm9Wi8DU6BpvVovA1SaJkjwHP1fSfiRnQNN6tF4Gp0DTerReBqk0TJHgOfq+k/EjOgab1aPwBOgab1aLwNUmiZY8Bz9X0n4kV5P017/AEeP2ZG29q+ugab1aLwNUmiZY8Bz9X0n4sjBgdMN1NF8Nq3YadrBZjQ0djQAvZFKSWxWVSc/xNsIiKSgREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQH//Z',
        dir:'auto'
      })
      // setTimeout(function(){
      //     notification.close();
      // },3000);
    });
  }
}
