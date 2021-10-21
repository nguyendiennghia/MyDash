import { Time } from '@angular/common';
import { R3ExpressionFactoryMetadata } from '@angular/compiler/src/render3/r3_factory';
import { Guid } from 'guid-typescript'

export enum WidgetType {
    Raw,
    Todo,
    Url,
    Rss,
    Scheduler,
    Graph,
    Rightmove,
    HtmlQuote
}
export class Widget {
    type!: WidgetType
    data!: string
    id!: Guid
}

export class TodoItem {
    name!: string
    details!: string
}
export class TodoWidget extends Widget {
    todo: TodoItem[] = []
    ongoing: TodoItem[] = []
    done: TodoItem[] = []
}

export enum SchedulerReoccuranceType {
    Unset,
    Daily,
    Monthly,
    Quarterly,
    Yearly,
    Customer
}

export class SchedulerWidget extends Widget {
    end!: Date
    desc!: string
    mode: string = 'countdown' // or progress
    display: string = 'datetime' // or datetime
    reoccurance: SchedulerReoccuranceType = SchedulerReoccuranceType.Unset
}

export class RssWidget extends Widget {
    subject: string = ''
    config: RssWidgetConfig = new RssWidgetConfig()
    sources: string[] = []
}

export class RssWidgetConfig {
    mode: string = 'carousel' // or nested, etc.
    colors: string[] = [ '#FF5252', '#7C4DFF', '#03A9F4', '#69F0AE', '#FFEB3B', '#FF6E40', 
        '#E91E63', '#536DFE', '#00BCD4', '#B2FF59', '#FFC107', '#BCAAA4', '#607D8B',
        '#E040FB', '#2196F3', '#64FFDA', '#CDDC39', '#FFAB40', '#9E9E9E'
    ]
}

export class RssItem {
    description!: string
    title!: string
    link!: string
    pubDate!: Date
    header: any
    image!: string
}

export class RightmoveWidget extends Widget {
    loc!: string
    maxPrice: number = 200000
    minPrice: number = 0
    maxDayAdded: number = 7
    minBedrooms = 0
    maxBedrooms = 3
    radius = 5 // miles
    showRecords!: number
}