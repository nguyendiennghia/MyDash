import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http'
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { DashboardService } from '../../dashboard.service'
import { RssItem, RssWidget, Widget } from '../widget'
import * as xml2js from 'xml2js'
import {from} from 'rxjs'
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
    items: 2,
    margin: 15,
     slideBy: 'page',
    // merge: true,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
		autoplaySpeed: 1500,
    //dotsSpeed: 500,
    autoplayMouseleaveTimeout: 1100,

    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,

    dots: false,
  }

  @Input() widget!: Widget
  rss: RssWidget[] = []
  items: RssItem[] = []

  testContent: any[] = [
    {text: 'ABC', img: 'https://image.thanhnien.vn/460x306/Uploaded/2021/churovh/2021_10_14/covid-19-nga-612.jpeg'},
    {text: 'DEF', img: 'https://image.thanhnien.vn/460x306/Uploaded/2021/apluwaj/2021_10_14/base64-163421571516565381097-1315.jpeg'},
    {text: '123', img: 'https://image.thanhnien.vn/460x306/Uploaded/2021/vocgmvub/2021_10_14/base64-1634189929805751298124-6298.jpeg'},
    {text: '456', img: 'https://image.thanhnien.vn/460x306/Uploaded/2021/jutmty/2021_10_14/du-lich-cu-chi-1310.jpeg'}
  ]

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
