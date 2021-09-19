import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'MyDash';

  constructor(private auth: AuthService, private router: Router) { }

  isAuthenticated(): boolean {
    return this.auth.authenticated
  }

  logout(): void {
    this.auth.logout()
      .then(vl => this.router.navigate(['/login']))
  }
}
