import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

import { SpinnerService } from '../spinner.service';
import {HTTP_URL, COOKIE_KEY} from '../common/backend'
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // TODO: Portal url from configuration service
  //private static readonly LOGIN_URL: string = '/url/api/auth/login'
  //private static readonly LOGOUT_URL: string = '/url/api/auth/logout'
  
  constructor(private spinner: SpinnerService, private http: HttpClient, private cookie: CookieService) { }

  async login(user: string, pwd: string): Promise<any> {
    this.spinner.spin$.next(true)

    console.log('authenticating...')
    return this.http.get<any>(`${HTTP_URL.Login}?u=${user}&p=${pwd}`)
       .pipe(
          //map(val => new Number(1)),
          catchError((err, caught) => {
            debugger; 
            return throwError(err) 
          }),
          finalize(() => this.spinner.spin$.next(false))
       )
       .toPromise()
  }

  async logout(): Promise<void> {
    this.http.get<Number>(HTTP_URL.Logout).toPromise()
  }

  get authenticated(): boolean {
    return !!+this.cookie.get(COOKIE_KEY.Authenticated);
  }
}
