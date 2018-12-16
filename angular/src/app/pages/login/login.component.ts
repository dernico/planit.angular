import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Configs } from '../../configs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
  
  public googleAuth = Configs.googleAuth;
  public emailAdress: string;
  public password: string;
  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ){}
  
  ngOnInit(): void {
    this.route
    .queryParams
    .filter(params => params.access_token)
    .subscribe(params => {
      var token = params.access_token;
      if(token){
        this.authService.setAccessToken(token);
        this.router.navigate(['plannings']);
      }
      
    });
  }

  login(){
    var loginUser = {
      email: this.emailAdress,
      password: this.password
    };
    this.http.post(Configs.loginUrl, loginUser)
    .subscribe((resp: any) => {
      this.authService.setAccessToken(resp.token);
      this.router.navigate(['plannings']);
    });
  }
}
