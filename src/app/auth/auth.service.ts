import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { SpinnerService } from '../spinner.service';
import {HTTP_URL, COOKIE_KEY} from '../common/backend'
import { CookieService } from 'ngx-cookie-service';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private spinner: SpinnerService, private http: HttpClient, private cookie: CookieService) { }

  async login(user: string, pwd: string): Promise<any> {
    this.spinner.spin$.next(true)

    console.log('authenticating...')
    return this.http.get<any>(`${HTTP_URL.Login}?u=${user}&p=${pwd}`)
       .pipe(
          //map(val => new Number(1)),
          catchError((err, caught) => {
            return throwError(err) 
          }),
          finalize(() => this.spinner.spin$.next(false))
       )
       .toPromise()
  }

  async logout(): Promise<any> {
    this.spinner.spin$.next(true)

    console.log('logging out...')
    return this.http.get(HTTP_URL.Logout)
      .pipe(
        finalize(() => this.spinner.spin$.next(false))
      )
      .toPromise()
  }

  get authenticated(): boolean {
    // let userStr = this.cookie.get(COOKIE_KEY.User)
    // if (!userStr) return false

    // let user = <User>JSON.parse(userStr)
    // return user != null
    return this.user != null
  }

  get user(): any {
    let userStr = this.cookie.get(COOKIE_KEY.User)
    if (!userStr) return null

    return <User>JSON.parse(userStr)
  }
}
