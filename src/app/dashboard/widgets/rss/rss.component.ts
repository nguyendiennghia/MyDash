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


    // const headers = new HttpHeaders()
    //   .append('Accept', 'application/xml')
    //   .append('Content-Type', 'application/x-www-form-urlencoded')
    //   .append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS') 
    //   .append('Access-Control-Allow-Origin', '*')
    //   .append('Access-Control-Allow-Headers', "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    // const requestOptions: object = { responseType: 'text/xml', headers: headers }
    // this.rss = (await this.service.cast<RssWidget>(this.widget))
    // this.rss.forEach(set => {
    //   set.sources.forEach(src => {
    //     this.http.get<NewsRss>(src, requestOptions)
    //       .subscribe(data => {
    //         debugger;
    //         // xml2js.parseString(data, (err, result: NewsRss) => {
    //         //   result.rss.channel.forEach(channel => 
    //         //     this.items.concat(channel.item.map(i => <RssItem> {
    //         //       desc: i.description,
    //         //       title: i.title,
    //         //       link: i.link
    //         //     }))
    //         //   )
    //         // })
    //       })

    //   })
    // })
    

    this.rss = (await this.service.cast<RssWidget>(this.widget))
    this.rss.forEach(set => {
      set.sources.forEach(async src => {
        //console.log(`accessing RSS: ${src}`)

        const requestOptions: Object = {
          observe: "body",
          responseType: "text"
        }
        this.http
          .get<any>(src, requestOptions)
          .subscribe(data => {
            let parseString = xml2js.parseString;
            parseString(data, (err, result: NewsRss) => {
              console.log( JSON.stringify(result) )
               //this.items.push(result.rss.channel.item)
            });
          })


        // await //fetch('https://vnexpress.net/rss/tin-moi-nhat.rss', { 
        //   fetch('https://gadgets.ndtv.com/rss/feeds', { 
        //   method: 'GET',
        //   mode: 'no-cors'})
        //   .then(r => { debugger; 
        //     let json = r.text(); 
        //     console.log(json)
        //     return json })
        //   .then(str => {
        //     debugger; 
        //     return new DOMParser().parseFromString(str, "text/xml")
        //   })
        //   .then(data => {
        //     debugger;
        //     console.log(JSON.stringify(data))

        //     //this.items.concat(data.querySelectorAll('item').map())

        //     const items = data.querySelectorAll('item').forEach(i => {
        //       this.items.push(<RssItem> {
        //         desc: i.querySelector('description')?.innerHTML,
        //         title: i.querySelector('title')?.innerHTML,
        //         link: i.querySelector('link')?.innerHTML
        //       })
        //     })
        //   })
        //   .catch(err => {
        //     debugger;
        //     console.log(JSON.stringify(err))
        //   })

        // this.http.request<any>('GET', src, { 
        //   headers: new HttpHeaders().append('Access-Control-Allow-Origin', '*') 
        // })
        //   .subscribe(resp => {
        //     debugger;

        //   })
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
  channel: IRssChannel;
}

export interface IRssChannel {
  title: string
  description: string
  link: string
  image: IRssImage
  //language: string

  item: IRssItem[];
}

export interface IRssImage {
  link: string
  title: string
  url: string
}

export interface IRssItem {
  //category: Array<string>;
  //description: Array<string>;
  description: string
  link: string
  title: string
  //guid: any;
  //link: Array<string>;
  //pubDate: Date;
  //title: Array<string>;
}
