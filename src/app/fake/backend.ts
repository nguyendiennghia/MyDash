import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators'

import { HTTP_URL, COOKIE_KEY } from '../common/backend'

@Injectable()
export class FakeHttpInterceptor implements HttpInterceptor {

    constructor(private cookie: CookieService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if (req.method === 'GET' && req.url.includes(HTTP_URL.Login)) {
            return of(new HttpResponse({ status: 200, body: { authenticated: true } }))
                .pipe(
                    delay(1000),
                    finalize(() => this.cookie.set(COOKIE_KEY.Authenticated, 'true'))
                )
        }

        if (req.method === 'GET' && req.url === HTTP_URL.Logout) {
            return of(new HttpResponse({ status: 200, body: { authenticated: false } }))
                .pipe(
                    finalize(() => this.cookie.delete(COOKIE_KEY.Authenticated))
                )
        }

        // TODO: More

        return of(new HttpResponse({ status: 500 }))
            .pipe(
                finalize(() => console.log(`Http request not supported: ${req.url}`))
            )
    }
}
