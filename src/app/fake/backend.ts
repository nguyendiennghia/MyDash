import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { delay, finalize, tap, catchError } from 'rxjs/operators'

import { HTTP_URL, COOKIE_KEY } from '../common/backend'
import { User } from '../common/user';
import { Tile } from '../dashboard/widgets/tile';
import { RssWidget, SchedulerWidget, TodoWidget, Widget, WidgetType } from '../dashboard/widgets/widget';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service'

@Injectable()
export class FakeHttpInterceptor implements HttpInterceptor {

    widgetID1: number = WidgetType.Todo;
    widgetID2: number = WidgetType.Scheduler;
    widgetID3: number = WidgetType.Rss

    constructor(
        private cookie: CookieService, 
        @Inject(LOCAL_STORAGE) private storage: StorageService) {}

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

        let defaultTiles = [
            <Tile> { color: 'orange', cols: 1, rows: 1, content: this.widgetID2, name: 'Scheduler' },
            <Tile> { color: '#ddbdf1', cols: 3, rows: 1, content: 5, name: 'Graph' },
            <Tile> { color: 'lightgreen', cols: 1, rows: 2, content: 2, name: 'Url' },
            <Tile> { color: 'lightblue', cols: 3, rows: 2, content: this.widgetID1, name: 'ToDo', desc: 'TODO list items' },
            <Tile> { color: 'lightpink', cols: 1, rows: 1, content: 0, name: 'Raw' },
            
            <Tile> { color: 'yellow', cols: 2, rows: 1, content: this.widgetID3, name: 'RSS - Quotes' },
        ]
        if (req.method === 'GET' && req.url.includes(HTTP_URL.DefaultTiles)) {
            return of(new HttpResponse({ status: 200, body: defaultTiles }))
                .pipe(
                    //delay(300)
                )
        }

        if (req.method === 'GET' && req.url.includes(HTTP_URL.Tiles)) {
            let data = this.storage.get(COOKIE_KEY.Tiles)
            let tiles: Tile[]
            if (!data) {
                this.storage.set(COOKIE_KEY.Tiles, JSON.stringify(tiles = defaultTiles))
            }
            else {
                tiles = <Tile[]> JSON.parse(this.storage.get(COOKIE_KEY.Tiles))
            }

            return of(new HttpResponse({ status: 200, body: tiles }))
                .pipe(
                    //delay(300)
                )
        }

        if (req.method === 'GET' && req.url.includes(HTTP_URL.Widgets)) {
            let widgets: Widget[] = []

            if (req.url.endsWith(`/${this.widgetID1}`)) widgets = this.getWidgets(WidgetType.Todo)
            
            else if (req.url.endsWith(`/${WidgetType.Raw}`)) widgets = this.getWidgets(WidgetType.Raw)

            else if (req.url.endsWith(`/${WidgetType.Url}`)) widgets = this.getWidgets(WidgetType.Url)

            else if (req.url.endsWith(`/${this.widgetID3}`)) { widgets = this.getWidgets(WidgetType.Rss)}

            else if (req.url.endsWith(`/${WidgetType.Scheduler}`)) widgets = this.getWidgets(WidgetType.Scheduler)

            else if (req.url.endsWith(`/${WidgetType.Graph}`)) widgets = this.getWidgets(WidgetType.Graph)

            return of(new HttpResponse({ status: 200, body: widgets }))
                .pipe(
                    delay( Math.floor(Math.random() * 3000) )
                    //finalize(() => this.cookie.set(COOKIE_KEY.User, '{}'))
                )
        }

        if (req.method === 'PUT' && req.url.includes(HTTP_URL.Widgets) && req.url.endsWith(`/${this.widgetID1}`)) {
            let widgets = (<Widget[]> req.body) // Todo
                .concat(this.getWidgets(WidgetType.Raw)).concat(this.getWidgets(WidgetType.Url))
                .concat(this.getWidgets(WidgetType.Rss)).concat(this.getWidgets(WidgetType.Scheduler))
                .concat(this.getWidgets(WidgetType.Graph))
            
            this.storage.set(COOKIE_KEY.Widgets, JSON.stringify(widgets))

            return of(new HttpResponse({ status: 200, body: widgets }))
                 .pipe(
                     delay( Math.floor(Math.random() * 3000) )
                 )
        }

        if (req.method === 'PUT' && req.url.includes(HTTP_URL.Widgets) && req.url.endsWith(`/${this.widgetID2}`)) {
            let widgets = (<Widget[]> req.body) // Scheduler
                .concat(this.getWidgets(WidgetType.Raw)).concat(this.getWidgets(WidgetType.Url))
                .concat(this.getWidgets(WidgetType.Rss)).concat(this.getWidgets(WidgetType.Todo))
                .concat(this.getWidgets(WidgetType.Graph))
            
            this.storage.set(COOKIE_KEY.Widgets, JSON.stringify(widgets))

            return of(new HttpResponse({ status: 200, body: widgets }))
                 .pipe(
                     delay( Math.floor(Math.random() * 3000) )
                 )
        }

        if (req.method === 'PUT' && req.url.endsWith(`${HTTP_URL.Widgets}/reset`)) {
            this.storage.set(COOKIE_KEY.Widgets, JSON.stringify(defaultWidgets))
            return of(new HttpResponse({ status: 200, body: defaultWidgets }))
                 .pipe(
                     delay( Math.floor(Math.random() * 3000) )
                 )
        }

        // TODO: More

        // return of(new HttpResponse({ status: 500 }))
        //     .pipe(
        //         finalize(() => console.log(`Http request not supported: ${req.url}`))
        //     )

        //req.headers.append('Access-Control-Allow-Origin', '*')
        
// intercept OPTIONS method
//if (req.method == 'OPTIONS' || req.method == 'GET') {
    //res.send(200);
    
  //}

    next.handle(req)
  

        return next.handle(req)
            //.pipe(
                // tap(event => {
                //     debugger
                //     if (event instanceof HttpResponse) {
                    
                // }
                // catchError((err, caught) => {

                // })
            //}
            //)
        //)
    }

    getWidgets(type?: WidgetType): Widget[] {

        let data = this.storage.get(COOKIE_KEY.Widgets)
        let widgets: Widget[]
        if (!data) {
            this.storage.set(COOKIE_KEY.Widgets, JSON.stringify(defaultWidgets))
            widgets = defaultWidgets
        }
        else widgets = <Widget[]> JSON.parse(data)
        if (type == undefined) return widgets
        return widgets.filter(w => w.type == type)
        //return type == undefined ? widgets : widgets.filter(w => w.type == type)
    }

    resetToDefault(): Widget[] {
        this.storage.set(COOKIE_KEY.Widgets, JSON.stringify(defaultWidgets))
        return defaultWidgets
    }
}



const defaultTodoWidgets: Widget[] = [
    <Widget> { 
        type: WidgetType.Todo, 
        // t: type, td: todo, og: ongoing, d: done, n: name, dt: details
        data: JSON.stringify([
            <TodoWidget>{
                todo: [
                    { name: "Review PR #1", details: "" },
                    { name: "Review PR #2", details: "" }
                ],
                ongoing: [
                    { name: "Update API", details: "" },
                    { name: "Send grooming invitation", details: "" }
                ],
                done: [
                    { name: "Update mockup", details: "" },
                    { name: "Demo feature", details: "" }
                ]
            }
        ]) 
    }
] 

const defaultRawWidgets: Widget[] = [
    <Widget> { type: WidgetType.Raw, data: '<h3>Past:</h3><a href="http://xyz.com">XYZ</a>' },
    <Widget> { type: WidgetType.Raw, data: '<h2>Current:</h2><a href="http://abc.xyz">ABC</a>' },
    <Widget> { type: WidgetType.Raw, data: '<h1>Future</h1>:<a href="https://hub.pot">Hub</a>'}
]

const defaultUrlWidgets: Widget[] = [
    <Widget> { type: WidgetType.Url, data: '<a href="http://xyz.com">XYZ</a>' },
    <Widget> { type: WidgetType.Url, data: '<a href="http://abc.xyz">ABC</a>' },
    <Widget> { type: WidgetType.Url, data: '<a href="https://hub.pot">Hub</a>'}
]

const defaultRssWidgets: Widget[] = [
    <Widget> { 
        type: WidgetType.Rss, 
        data: JSON.stringify([
            <RssWidget> {
                subject: 'Motivational Quotes',
                sources: [
                    'https://gadgets.ndtv.com/rss/feeds',
                    //'https://vnexpress.net/rss/tin-moi-nhat.rss',
                    //'https://www.w3schools.com/xml/note.xml'
                    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
                    //'https://www.brainyquote.com/link/quotebr.rss',
                    // 'https://www.brainyquote.com/feeds/quotear.rss',
                    // 'https://www.brainyquote.com/link/quotefu.rss',
                    // 'https://www.brainyquote.com/link/quotelo.rss',
                    // 'https://www.brainyquote.com/link/quotena.rss',
                    'https://thanhnien.vn/rss/home.rss'
                ]
            }
        ])
        
    }
    // <Widget> { 
    //     type: WidgetType.Rss, 
    //     data: '<section>BuzzFeed<article>BuzzFeed 1</article><article>BuzzFeed 2</article></section>' 
    // }
]

const defaultSchedulerWidgets: Widget[] = [
    <Widget> { 
        type: WidgetType.Scheduler, 
        data: JSON.stringify( [
            <SchedulerWidget> {
                end: new Date(2021, 10, 30, 12, 30),
                desc: 'Morning meeting',
                mode: 'countdown',
                display: 'time'
            },
            <SchedulerWidget> {
                end: new Date(2021, 9, 30),
                desc: 'Application!',
                mode: 'countdown',
                display: 'datetime'
            },
            <SchedulerWidget> {
                end: new Date(2021, 9, 30),
                desc: 'October Trip',
                mode: 'progress',
                display: 'datetime'
            }
        ]
    ) }
]

const defaultGraphWidgets: Widget[] = [
    <Widget> { type: WidgetType.Graph, data: `
        <svg width="500" height="350">
            <rect x="100" y="100" width="300" height="150" fill="yellow" stroke="black" stroke-width="5" />
        </svg>` },
    <Widget> { type: WidgetType.Graph, data: `
        <svg viewBox="0 0 200 200" width="400"  height="400">
            <circle cx="100" cy="100" fill="yellow" r="78" stroke="black" stroke-width="3" />
            <g>
                <circle cx="65" cy="82" r="12" />
                <circle cx="130" cy="82" r="12" />
            </g>
            <path d="M65 115 a1,0.8 0 0,0 65,0" fill="none" stroke="black" stroke-width="3" />
        </svg>` }
]

const defaultWidgets: Widget[] = defaultTodoWidgets
    .concat(defaultRawWidgets).concat(defaultUrlWidgets).concat(defaultRssWidgets)
    .concat(defaultSchedulerWidgets).concat(defaultGraphWidgets)
