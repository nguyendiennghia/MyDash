import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from '../spinner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // TODO: Portal url from configuration service
  private static readonly AUTH_URL: string = ''
  
  constructor(private spinner: SpinnerService, private http: HttpClient) { }

  async authenticate(): Promise<Number> {
    this.spinner.spin$.next(true)

    console.log('authenticating...')
    // TODO
    return this.http.get<Number>('').toPromise()
  }
}
