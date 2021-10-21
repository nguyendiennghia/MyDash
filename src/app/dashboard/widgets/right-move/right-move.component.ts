import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { RightmoveWidget, Widget } from '../widget';
import * as xml2js from 'xml2js'

@Component({
  selector: 'app-right-move',
  templateUrl: './right-move.component.html',
  styleUrls: ['./right-move.component.sass']
})
export class RightMoveComponent implements OnInit, OnChanges {

  @Input() widget!: Widget
  private items: RightmoveWidget[] = [];
  properties: IRightMoveProp[] = []
  constructor(private service: DashboardService, private http: HttpClient) { }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    this.items = (await this.service.cast<RightmoveWidget>(this.widget))

    const requestOptions: Object = {
      observe: "body",
      responseType: "text",
      'Cache-Control':  'no-cache, no-store, must-revalidate, post- check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
    const salt = (new Date()).getTime()

    this.items.forEach(item => {
      let src = `https://api.rightmove.co.uk/api/sale/find?&apiApplication=IPAD&retirement=false&displayPropertyType=houses&newHome=false&partBuyPartRent=false&sortType=6&locationIdentifier=REGION%5E${item.loc}&maxPrice=${item.maxPrice}&minPrice=${item.minPrice}&maxDaysSinceAdded=${item.maxDayAdded}&minBedrooms=${item.minBedrooms}&maxBedrooms=${item.maxBedrooms}&radius=${item.radius}&numberOfPropertiesRequested=${item.showRecords ? item.showRecords: 0}`
      if (item.showRecords)
      console.log(src)
      let url = `https://api.allorigins.win/get?&salt=${salt}&url=${encodeURIComponent(src)}`
      this.http.get<any>(url, requestOptions)
      .subscribe(data => {
        let resp: IRightMoveResp = JSON.parse(JSON.parse(data).contents)
        this.properties = this.properties.concat(resp.properties)
      })
    })

  }

  ngOnInit(): void {
  }

}

interface IRightMoveResp {
  searchableLocation: IRightMoveLoc
  properties: IRightMoveProp[]
}
interface IRightMoveLoc {
  name: string
  centreLatitude: Number
  centreLongitude: Number
}
interface IRightMoveProp {
  identifier: number
  summary: string
  price: Number
  address: string
  displayPrices: IRightMovePrice[]
  photoThumbnailUrl: string
  photoLargeThumbnailUrl: string
  thumbnailPhotos: IRightMovePhoto[]
}
interface IRightMovePhoto {
  url: string
}
interface IRightMovePrice {
  displayPrice: string
  displayPriceQualifier: string
}

