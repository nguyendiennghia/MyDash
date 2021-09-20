import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../widget';

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.sass']
})
export class RssComponent implements OnInit {

  @Input() items: Widget[] = []
  
  constructor() { }

  ngOnInit(): void {
  }

}
