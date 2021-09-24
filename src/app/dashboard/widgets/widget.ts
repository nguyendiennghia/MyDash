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
}

class TodoItem {
    name!: string;
    details!: string;
}
export class TodoWidget extends Widget {
    todo?: TodoItem[];
    ongoing?: TodoItem[];
    done?: TodoItem[];
}


