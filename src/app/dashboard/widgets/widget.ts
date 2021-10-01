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
    name!: string;
    details!: string;
}
export class TodoWidget extends Widget {
    todo: TodoItem[] = [];
    ongoing: TodoItem[] = [];
    done: TodoItem[] = [];
}


