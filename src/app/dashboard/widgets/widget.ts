import { Time } from '@angular/common';
import { Guid } from 'guid-typescript'

export enum WidgetType {
    Raw,
    Todo,
    Url,
    Rss,
    Scheduler,
    Graph
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
    display: string = 'time' // or datetime
    reoccurance: SchedulerReoccuranceType = SchedulerReoccuranceType.Unset
}


