import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http'
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { DashboardService } from '../../dashboard.service'
import { RssItem, RssWidget, Widget } from '../widget'
import * as xml2js from 'xml2js'
import {from} from 'rxjs'

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.sass']
})
export class RssComponent implements OnInit {

  @Input() widget!: Widget
  rss: RssWidget[] = []
  items: RssItem[] = []

  constructor(private service: DashboardService, private http: HttpClient) { }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {   
    const requestOptions: Object = {
      observe: "body",
      responseType: "text"
    }
    this.rss = (await this.service.cast<RssWidget>(this.widget))
    this.rss.forEach(set => {
      set.sources.forEach(async src => {
        this.http
          .get<any>(src, requestOptions)
          .subscribe(data => {
            let parseString = xml2js.parseString;
            parseString(data, (err, result: NewsRss) => {
              result.rss.channel[0].item.forEach(i => {
                i.header = { 
                  logo: result.rss.channel[0].image[0] ? result.rss.channel[0].image[0].url : '',
                  section: result.rss.channel[0].title
                }
                this.items.push(i)
              })
            })
          })
      })
    })
  }

  ngOnInit(): void {
  }

}

export interface NewsRss {
  rss: IRssObject;
}

export interface IRssObject {
  // $: any;
  channel: IRssChannel[];
}

export interface IRssChannel {
  title: string
  description: string
  link: string
  image: IRssImage[]
  //language: string

  item: RssItem[];
}

export interface IRssImage {
  link: string
  title: string
  url: string
}

// export interface IRssItem {
//   //category: Array<string>;
//   //description: Array<string>;
//   description: string
//   link: string
//   title: string
//   //guid: any;
//   //link: Array<string>;
//   pubDate: Date
//   //title: Array<string>;
//   section: string
// }
