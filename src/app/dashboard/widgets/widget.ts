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
    html!: string
}
