import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  form: FormGroup = this.createFormGroup()

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private loc: ActivatedRoute ) { }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    let user: string = this.form.get('user')?.value
    let pwd: string = this.form.get('pwd')?.value

    let result = await this.auth.login(user, pwd)
    if (result.authenticated) {
      
      this.loc.queryParams
        .subscribe(params => {
          let returnUrl = params.returnUrl || '/'
          this.router.navigate([returnUrl])
        })
      
    }
  }

  private createFormGroup(): FormGroup {
    return this.fb.group({
      user: ['', Validators.email],
      pwd: ['', Validators.required]
    })
  }

}
