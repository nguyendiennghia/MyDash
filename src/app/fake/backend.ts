import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators'

import { HTTP_URL, COOKIE_KEY } from '../common/backend'
import { User } from '../common/user';
import { Widget, WidgetType } from '../dashboard/widgets/widget';

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
                    { color: 'lightblue', cols: 3, rows: 1, content: 2, name: 'Widget 1', desc: 'TODO list items' },
                    { color: 'lightgreen', cols: 1, rows: 2, content: 1, name: 'Widget 2' },
                    { color: 'lightpink', cols: 1, rows: 1, content: 3, name: 'Widget 3' },
                    { color: '#ddbdf1', cols: 2, rows: 1, content: 4, name: 'Widget 4' }
                ] }))
                .pipe(
                    //delay(300)
                    //finalize(() => this.cookie.set(COOKIE_KEY.User, '{}'))
                )
        }
        if (req.method === 'GET' && req.url.includes(HTTP_URL.DefaultTiles)) {
            return of(new HttpResponse({ status: 200, 
                body: [
                    { color: 'lightblue', cols: 3, rows: 1, content: 1, name: 'Widget 1' },
                    { color: 'lightgreen', cols: 1, rows: 2, content: 2, name: 'Widget 2' },
                    { color: 'lightpink', cols: 1, rows: 1, content: 3, name: 'Widget 3' },
                    { color: '#ddbdf1', cols: 2, rows: 1, content: 4, name: 'Widget 4' }
                ] }))
                .pipe(
                    //delay(300)
                    //finalize(() => this.cookie.set(COOKIE_KEY.User, '{}'))
                )
        }

        if (req.method === 'GET' && req.url.includes(HTTP_URL.Widget)) {
            let widgets: Widget[] = []
            if (req.url.endsWith(`/${WidgetType.Todo}`)) widgets = [
                <Widget> { type: WidgetType.Todo, html: '<strike>TODO 1<strike>' },
                // <Widget> { type: WidgetType.Todo, html: '<b>TODO 2<b>' },
                // <Widget> { type: WidgetType.Todo, html: '<i>TODO 3<i>' }
            ]

            if (req.url.endsWith(`/${WidgetType.Url}`)) widgets = [
                <Widget> { type: WidgetType.Url, html: '<a href="http://xyz.com">XYZ</a>' },
                <Widget> { type: WidgetType.Url, html: '<a href="http://abc.xyz">ABC</a>' },
                <Widget> { type: WidgetType.Url, html: '<a href="https://hub.pot">Hub</a>'}
            ]

            if (req.url.endsWith(`/${WidgetType.Rss}`)) widgets = [
                <Widget> { type: WidgetType.Rss, html: '<section>BBC<article>BBC 1</article><article>BBC 2</article></section>' },
                <Widget> { type: WidgetType.Rss, html: '<section>BuzzFeed<article>BuzzFeed 1</article><article>BuzzFeed 2</article></section>' }
            ]

            if (req.url.endsWith(`/${WidgetType.Scheduler}`)) widgets = [
                <Widget> { type: WidgetType.Scheduler, html: '<time>8:30</time>' },
                <Widget> { type: WidgetType.Scheduler, html: '<time>11:30</time>' },
                <Widget> { type: WidgetType.Scheduler, html: '<time datetime="2021-11-30 12:00">30 Nov</time>' }
            ]

            if (req.url.endsWith(`/${WidgetType.Graph}`)) widgets = [
                <Widget> { type: WidgetType.Graph, html: `
                    <svg width="500" height="350">
                        <rect x="100" y="100" width="300" height="150" fill="yellow" stroke="black" stroke-width="5" />
                    </svg>` },
                <Widget> { type: WidgetType.Graph, html: `
                    <svg viewBox="0 0 200 200" width="400"  height="400">
                        <circle cx="100" cy="100" fill="yellow" r="78" stroke="black" stroke-width="3" />
                        <g>
                            <circle cx="65" cy="82" r="12" />
                            <circle cx="130" cy="82" r="12" />
                        </g>
                        <path d="M65 115 a1,0.8 0 0,0 65,0" fill="none" stroke="black" stroke-width="3" />
                    </svg>` }
            ]


            return of(new HttpResponse({ status: 200, body: widgets }))
                .pipe(
                    delay( Math.floor(Math.random() * 3000) )
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
