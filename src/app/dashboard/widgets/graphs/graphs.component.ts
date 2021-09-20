import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../widget';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.sass']
})
export class GraphsComponent implements OnInit {

  @Input() items: Widget[] = []
  
  constructor() { }

  ngOnInit(): void {
  }

}
