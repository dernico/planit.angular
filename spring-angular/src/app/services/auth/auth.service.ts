import { Injectable } from '@angular/core';
import { ILogin } from './ilogin';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IAuthResponse } from './iauth-response';
import { SessionService } from '../session/session.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient, 
    private session: SessionService,
    private router: Router
    ) { }

  login(login: ILogin){
    let params = new HttpParams();
    params = params.append('username', login.username);
    params = params.append('password', login.password);
    params = params.append('grant_type','password');
    params = params.append('client_id','testjwtclientid');

    let headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded; charset=utf-8', 
      'Authorization': 'Basic '+btoa("testjwtclientid:XY7kmzoNzl100")
    });

    this.http.post("http://localhost:8080/oauth/token",params.toString(), { headers: headers})
      .subscribe((resp: IAuthResponse) => {
        console.log('authservice - login: ', resp.access_token);
        this.session.setAccessToken(resp.access_token);
        this.router.navigate(['']);

      }, error => {});
  }
}
