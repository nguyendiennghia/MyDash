import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../widget';

@Component({
  selector: 'app-schedulers',
  templateUrl: './schedulers.component.html',
  styleUrls: ['./schedulers.component.sass']
})
export class SchedulersComponent implements OnInit {

  @Input() items: Widget[] = []
  
  constructor() { }

  ngOnInit(): void {
  }

}
