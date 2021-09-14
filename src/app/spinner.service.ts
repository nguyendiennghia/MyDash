import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatSpinner } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { map, scan } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinnerRef: OverlayRef = this.createSpinner();
  spin$: Subject<boolean> = new Subject();

  constructor(private overlay: Overlay) { 
    this.spin$
      .asObservable()
      .pipe(
        map(val => val ? 1 : -1),
        scan((acc, cur) => acc + cur > 0 ? acc + cur : 0, 0)
      )
      .subscribe(val => {
        if (val == 1) this.showSpinner()
        else if (val == 0) this.spinnerRef.hasAttached() ? this.hideSpinner() : null
      })
  }

  private createSpinner(): OverlayRef {
    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dark-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    })
  }

  private showSpinner(): void {
    console.log('Start spinning...')
    this.spinnerRef.attach(new ComponentPortal(MatSpinner))
  }

  private hideSpinner() : void {
    console.log('Stop spinning...')
    this.spinnerRef.detach()
  }
}