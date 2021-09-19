import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators'

import { HTTP_URL, COOKIE_KEY } from '../common/backend'
import { User } from '../common/user';

@Injectable()
export class FakeHttpInterceptor implements HttpInterceptor {

    constructor(private cookie: CookieService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if (req.method === 'GET' && req.url.includes(HTTP_URL.Login)) {
            return of(new HttpResponse({ status: 200, body: { authenticated: true } }))
                .pipe(
                    delay(1000),
                    finalize(() => {
                        this.cookie.set(COOKIE_KEY.User, JSON.stringify(<User>{
                            tiles:                             [
                                { color: 'lightblue', cols: 3, rows: 1, content: 1 },
                                { color: 'lightgreen', cols: 1, rows: 2, content: 2 },
                                { color: 'lightpink', cols: 1, rows: 1, content: 3 },
                                { color: '#ddbdf1', cols: 2, rows: 1, content: 4 }
                            ]
                        }))
                    })
                )
        }

        if (req.method === 'GET' && req.url === HTTP_URL.Logout) {
            return of(new HttpResponse({ status: 200, body: { authenticated: false } }))
                .pipe(
                    delay(1000),
                    finalize(() => {
                        this.cookie.delete(COOKIE_KEY.User)
                    })
                )
        }

        if (req.method === 'GET' && req.url.includes(HTTP_URL.Tiles)) {
            return of(new HttpResponse({ status: 200, 
                body: [
                    { color: 'lightblue', cols: 3, rows: 1, content: 1 },
                    { color: 'lightgreen', cols: 1, rows: 2, content: 2 },
                    { color: 'lightpink', cols: 1, rows: 1, content: 3 },
                    { color: '#ddbdf1', cols: 2, rows: 1, content: 4 }
                ] }))
                .pipe(
                    //delay(300)
                    //finalize(() => this.cookie.set(COOKIE_KEY.User, '{}'))
                )
        }
        // TODO: More

        return of(new HttpResponse({ status: 500 }))
            .pipe(
                finalize(() => console.log(`Http request not supported: ${req.url}`))
            )
    }
}
