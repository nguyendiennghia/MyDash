import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http'
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core'
import { DashboardService } from '../../dashboard.service'
import { RssItem, RssWidget, Widget } from '../widget'
import * as xml2js from 'xml2js'
import {from, interval, Observable} from 'rxjs'
import { OwlOptions } from 'ngx-owl-carousel-o'

@Component({
  selector: 'app-rss',
  templateUrl: './rss.component.html',
  styleUrls: ['./rss.component.sass']
})
export class RssComponent implements OnInit {

  customOptions: OwlOptions = {
    autoHeight: true,
    loop: true,
    items: 4,
    margin: 15,
     slideBy: 'page',
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
		autoplaySpeed: 1500,
    autoplayMouseleaveTimeout: 1100,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
  }

  @Input() widget!: Widget
  @Input() configEvt!: EventEmitter<void>
  @Output() widgetEvent: EventEmitter<Widget> = new EventEmitter<Widget>()
  editting: boolean = false
  rss: RssWidget[] = []
  items: RssItem[] = []

  constructor(private service: DashboardService, private http: HttpClient) { }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {   
    this.rss = (await this.service.cast<RssWidget>(this.widget))
    await this.pullRss()
  }

  private async pullRss() {
    this.items = []
    const requestOptions: Object = {
      observe: "body",
      responseType: "text",
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
    this.rss.forEach(set => {
      set.sources.forEach(async src => {
        const salt = (new Date()).getTime()
        let url = `https://api.allorigins.win/get?&salt=${salt}&url=${encodeURIComponent(src)}`
        this.http
          .get<any>(url, requestOptions)
          .subscribe(data => {
            let parseString = xml2js.parseString
            let xml = JSON.parse(data).contents.match(/(<rss(.|\r|\n)*)/g)[0]
            
            parseString(xml, (err, result: NewsRss) => {
              let items: RssItem[] = []
              result.rss.channel[0].item.forEach(i => {
                i.header = { 
                  logo: result.rss.channel[0].image && result.rss.channel[0].image[0] ? result.rss.channel[0].image[0].url : '',
                  section: result.rss.channel[0].title
                }
                items.push(i)
              })
              items.sort((a, b) => a.pubDate >= b.pubDate ? 1 : 0).forEach(i => this.items.push(i))
            })
          })
      })
    })
  }

  ngOnInit(): void {

    interval(120000)
      .subscribe(x => {
        this.pullRss() 
      })

    if (this.configEvt) {
      this.configEvt.subscribe(() => this.editting = true)
    }
  }

  async configure(ok: boolean) {
    this.editting = false
    // TODO
    //console.log(`Should be reloaded: ${ok}`)
    if (ok) {
      this.widget = await this.service.edit(this.widget, this.rss)
      this.widgetEvent.emit(this.widget)
      await this.pullRss()
    }
  }
}

export interface NewsRss {
  rss: IRssObject;
}

export interface IRssObject {
  channel: IRssChannel[];
}

export interface IRssChannel {
  title: string
  description: string
  link: string
  image: IRssImage[]
  item: RssItem[];
}

export interface IRssImage {
  link: string
  title: string
  url: string
}
