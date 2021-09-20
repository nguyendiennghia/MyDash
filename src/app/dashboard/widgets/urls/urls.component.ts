import { Component, Input, OnInit } from '@angular/core';
import { Widget } from '../widget';

@Component({
  selector: 'app-urls',
  templateUrl: './urls.component.html',
  styleUrls: ['./urls.component.sass']
})
export class UrlsComponent implements OnInit {

  @Input() items: Widget[] = []
  
  constructor() { }

  ngOnInit(): void {
  }

}
