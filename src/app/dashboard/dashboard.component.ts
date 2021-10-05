import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../spinner.service';
import { DashboardService } from './dashboard.service';
import { Tile } from './widgets/tile';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  tiles: Tile[] = [];
  constructor(private service: DashboardService, private spinner: SpinnerService) { }

  ngOnInit(): void {
    (async() => {
      this.tiles = await this.getTiles()
    })();
  }

  private async getTiles(): Promise<Tile[]> {
    return this.service.getTiles()
  }

  async getTile(tile: Tile): Promise<any> {

  }

  async resetWidgets(): Promise<void> {
    this.spinner.spin$.next(true)
    await this.service.resetWidgets()
    this.tiles = await this.getTiles().then(val => {
      this.spinner.spin$.next(false)
      return val
    })
  }
}
