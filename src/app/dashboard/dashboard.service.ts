import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tile } from './widgets/tile';
import { HTTP_URL } from '../common/backend'
import { AuthService } from '../auth/auth.service';
import { TodoWidget, Widget, WidgetType } from './widgets/widget';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  async getTiles(): Promise<Tile[]> {
    let user = this.auth.user
    return this.http.get<Tile[]>(`${HTTP_URL.Tiles}?u=${user.ref}`)
      .toPromise()
  }

  // TODO
  async getWidgets(groupId: Number | String): Promise<Widget[]> {
    return this.http.get<Widget[]>(`${HTTP_URL.Widgets}/${groupId}`)
      .toPromise()
  }

  async cast<TWidget extends Widget>(widget: Widget): Promise<TWidget[]> {
    
    if (widget.type == WidgetType.Todo) {
      return of(<TWidget[]> JSON.parse(widget.data.replace('\n', '').replace('\r', '')))
      .toPromise()
    }

    throw new Error('Not supported')
     
  }

  async edit<TWidget extends Widget>(widget: Widget, items: TWidget[]): Promise<Widget> {
    widget.data = JSON.stringify(items)
    return of(widget).toPromise()
  }


  async save(groupId: number | string, widgets: Widget[]): Promise<void> {
    
      this.http.put<void>(`${HTTP_URL.Widgets}/${groupId}`, widgets)
        .pipe(
          // TEST
          //tap(val => console.log(JSON.stringify(val)))
        )
      .toPromise()
  }
}

export type getTodos = (widget: Widget) => Observable<TodoWidget[]>;
