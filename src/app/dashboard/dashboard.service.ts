import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tile } from './widgets/tile';
import { HTTP_URL } from '../common/backend'
import { AuthService } from '../auth/auth.service';

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
}
