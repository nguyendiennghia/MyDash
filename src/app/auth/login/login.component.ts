import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/spinner.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  async logIn(): Promise<void> {
    // spinner
    this.auth.authenticate()
    
  }

}
