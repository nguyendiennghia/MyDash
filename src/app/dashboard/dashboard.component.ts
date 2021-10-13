import { ComponentPortal } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { delay, finalize, tap } from 'rxjs/operators';
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
  constructor(private service: DashboardService, private spinner: SpinnerService, public modal: MatDialog) { }

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

  configWidgets() {
    let modalRef = this.modal.open(DashboardConfigComponent, {
      data: {}
    })
    modalRef.afterClosed()
      // .pipe(
      //   delay(2000)
      //   finalize(n => ))
      // )
      .subscribe(r => {
        console.log('modal closed')
      })
  }
}

@Component({
  selector: 'app-dashboard-config',
  templateUrl: 'dashboard-config.component.html',
  
})
export class DashboardConfigComponent {
  panelOpenState: boolean = false
  constructor(private service: DashboardService, private spinner: SpinnerService) {}
}
