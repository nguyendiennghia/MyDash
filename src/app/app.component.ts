import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'MyDash';
  private authenticated: boolean = true;

  constructor() { }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  logout(): void {
    this.authenticated = !this.authenticated;
  }
}
