import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { delay, finalize, tap, catchError } from 'rxjs/operators'

import { HTTP_URL, COOKIE_KEY } from '../common/backend'
import { User } from '../common/user';
import { Tile } from '../dashboard/widgets/tile';
import { RightmoveWidget, RssWidget, SchedulerWidget, TodoWidget, Widget, WidgetType } from '../dashboard/widgets/widget';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service'

const widgetID1: number = WidgetType.Todo
const widgetID2: number = WidgetType.Scheduler
const widgetID3: number = WidgetType.Rss
 // Rightmove
const widgetID4 = Guid.parse('f005ef4d-8491-4822-a931-adece6b63453')
const widgetID5 = Guid.parse('27fecccc-b5db-4496-9e31-769bb641f9b5')
const widgetID6 = Guid.parse('398bee17-7fa6-4fdd-8314-2ddb1fdc9547')

@Injectable()
export class FakeHttpInterceptor implements HttpInterceptor {
    
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
            <Tile> { color: '#cd8282', secondaryColor: '#fff', cols: 2, rows: 1, content: widgetID2, name: 'Scheduler' },
            <Tile> { color: '#82a8cd', secondaryColor: '#fff', cols: 3, rows: 1, content: 5, name: 'Graph' },
            <Tile> { color: '#82cda8', cols: 1, rows: 2, content: 2, name: 'Url' },
            <Tile> { color: '#ffbf00', cols: 3, rows: 2, content: widgetID1, name: 'ToDo', desc: 'TODO list items' },
            <Tile> { color: '#82cdcd', cols: 1, rows: 1, content: 0, name: 'Raw' },
            <Tile> { color: '#ff9912', secondaryColor: '#fff', cols: 1, rows: 1, content: 0, name: 'Mail' },
            <Tile> { color: '#eedd82', cols: 3, rows: 1, content: widgetID3, name: 'Rss' },

            <Tile> { color: '#00bfff', secondaryColor: '#fff', cols: 3, rows: 1, content: widgetID4.toString(), name: 'Rightmove - Nuneaton' },
            <Tile> { color: '#66cdaa', cols: 3, rows: 2, content: widgetID5.toString(), name: 'Rightmove - Tamworth' },
            <Tile> { color: '#cfead9', cols: 3, rows: 1, content: widgetID6.toString(), name: 'Rightmove - Cannock' },
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

            if (req.url.endsWith(`/${widgetID1}`)) widgets = this.getWidgetsOf(WidgetType.Todo)
            
            else if (req.url.endsWith(`/${WidgetType.Raw}`)) widgets = this.getWidgetsOf(WidgetType.Raw)

            else if (req.url.endsWith(`/${WidgetType.Url}`)) widgets = this.getWidgetsOf(WidgetType.Url)

            else if (req.url.endsWith(`/${widgetID3}`)) { widgets = this.getWidgetsOf(WidgetType.Rss)}

            else if (req.url.endsWith(`/${WidgetType.Scheduler}`)) widgets = this.getWidgetsOf(WidgetType.Scheduler)

            else if (req.url.endsWith(`/${WidgetType.Graph}`)) widgets = this.getWidgetsOf(WidgetType.Graph)

            //else if ([widgetID6, widgetID5, widgetID4].some(rm => req.url.endsWith(`/${rm}`))) {
            else if ( new RegExp('\/([a-z0-9-]+)$').test(req.url) ) {
                let guid = Guid.parse(req.url.match( /([a-z0-9-]+)$/g )![0])
                widgets = this.getWidgets(guid)
            }

            return of(new HttpResponse({ status: 200, body: widgets }))
                .pipe(
                    delay( Math.floor(Math.random() * 3000) )
                    //finalize(() => this.cookie.set(COOKIE_KEY.User, '{}'))
                )
        }

        if (req.method === 'PUT' && req.url.includes(HTTP_URL.Widgets) && req.url.endsWith(`/${widgetID1}`)) {
            let widgets = (<Widget[]> req.body) // Todo
                .concat(this.getWidgetsExcept(WidgetType.Todo))
            this.storage.set(COOKIE_KEY.Widgets, JSON.stringify(widgets))
            return of(new HttpResponse({ status: 200, body: widgets }))
                 .pipe(
                     delay( Math.floor(Math.random() * 3000) )
                 )
        }

        if (req.method === 'PUT' && req.url.includes(HTTP_URL.Widgets) && req.url.endsWith(`/${widgetID2}`)) {
            let widgets = (<Widget[]> req.body) // Scheduler
                .concat(this.getWidgetsExcept(WidgetType.Scheduler))
            this.storage.set(COOKIE_KEY.Widgets, JSON.stringify(widgets))
            return of(new HttpResponse({ status: 200, body: widgets }))
                 .pipe(
                     delay( Math.floor(Math.random() * 3000) )
                 )
        }

        if (req.method === 'PUT' && req.url.includes(HTTP_URL.Widgets) && req.url.endsWith(`/${widgetID3}`)) {
            let widgets = (<Widget[]> req.body) // Rss
                .concat(this.getWidgetsExcept(WidgetType.Rss))
            this.storage.set(COOKIE_KEY.Widgets, JSON.stringify(widgets))
            return of(new HttpResponse({ status: 200, body: widgets }))
                 .pipe(
                     delay( Math.floor(Math.random() * 3000) )
                 )
        }

        if (req.method === 'PUT' && req.url.endsWith(`${HTTP_URL.Widgets}/reset`)) {
            this.storage.set(COOKIE_KEY.Tiles, JSON.stringify(defaultTiles))
            this.storage.set(COOKIE_KEY.Widgets, JSON.stringify(defaultWidgets))
            return of(new HttpResponse({ status: 200, body: defaultWidgets }))
                 .pipe(
                     delay( Math.floor(Math.random() * 3000) )
                 )
        }

        return next.handle(req)
    }

    getAllWidgets(): Widget[] {
        let data = this.storage.get(COOKIE_KEY.Widgets)
        if (!data) {
            this.storage.set(COOKIE_KEY.Widgets, JSON.stringify(defaultWidgets))
            return defaultWidgets
        }
        else return <Widget[]> JSON.parse(data)
    } 

    getWidgetsOf(type?: WidgetType): Widget[] {
        let widgets = this.getAllWidgets()
        if (type == undefined) return widgets
        return widgets.filter(w => w.type == type)
    }

    getWidgetsExcept(type: WidgetType) : Widget[] {
        let widgets: Widget[] = []
        for (let [ key, value ] of Object.entries(WidgetType)) {
            let val = Number(key)
            if (isNaN(val) || val == type) continue;
            widgets = widgets.concat(this.getWidgetsOf(val))
        }
        return widgets
    }

    getWidgets(id: Guid): Widget[] {
        let widgets = this.getAllWidgets()

        return widgets.filter(w => w.id && w.id == id.toString())
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
                    //'https://gadgets.ndtv.com/rss/feeds',
                    //'https://stackoverflow.com/feeds/',
                    //'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
                    //'https://www.brainyquote.com/link/quotebr.rss',
                    // 'https://www.brainyquote.com/feeds/quotear.rss',
                    // 'https://www.brainyquote.com/link/quotefu.rss',
                    // 'https://www.brainyquote.com/link/quotelo.rss',
                    // 'https://www.brainyquote.com/link/quotena.rss',
                    'https://vnexpress.net/rss/tin-moi-nhat.rss',
                    //'https://thanhnien.vn/rss/home.rss',
                    //'https://tuoitre.vn/rss/tin-moi-nhat.rss',
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
                end: new Date(2022, 7, 14, 8, 30),
                desc: 'D-Day',
                mode: 'progress',
                display: 'datetime'
            },
            <SchedulerWidget> {
                end: new Date(2021, 9, 30),
                desc: 'October Trip',
                mode: 'countdown',
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

const defaultRightmoveWidgets: Widget[] = [
    <Widget> {
        id: widgetID6.toString(),
        type: WidgetType.Rightmove,
        data: JSON.stringify( [
            <RightmoveWidget> {
                loc: '277' // Cannock
            }
        ] )
    },
    <Widget> {
        id: widgetID5.toString(),
        type: WidgetType.Rightmove,
        data: JSON.stringify( [
            <RightmoveWidget> {
                loc: '1314' // Tamworth
            }
        ] )
    },
    <Widget> {
        id: widgetID4.toString(),
        type: WidgetType.Rightmove,
        data: JSON.stringify( [
            <RightmoveWidget> {
                loc: '1020' // Nuneaton
            }
        ] )
    }
]

const defaultWidgets: Widget[] = defaultTodoWidgets
    .concat(defaultRawWidgets).concat(defaultUrlWidgets).concat(defaultRssWidgets)
    .concat(defaultSchedulerWidgets).concat(defaultGraphWidgets)
    .concat(defaultRightmoveWidgets)
