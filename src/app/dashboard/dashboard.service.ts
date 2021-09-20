import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tile } from './widgets/tile';
import { HTTP_URL } from '../common/backend'
import { AuthService } from '../auth/auth.service';
import { Widget } from './widgets/widget';

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
    return this.http.get<Widget[]>(`${HTTP_URL.Widget}/${groupId}`)
      .toPromise()
  }
}
