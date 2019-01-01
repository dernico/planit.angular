import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ILogin } from 'src/app/services/auth/ilogin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginData: ILogin = {username: '', password: ''};

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  login(){
    this.auth.login(this.loginData);
  }

}
