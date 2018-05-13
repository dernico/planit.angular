import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Configs } from '../../configs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit{
  
  private emailAdress: string;
  private password: string;
  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ){}
  
  ngOnInit(): void {
    // this.route
    // .queryParams
    // .filter(params => params.access_token)
    // .subscribe(params => {
    //   var token = params.access_token;
    //   if(token){
    //     this.authService.setAccessToken(token);
    //     this.router.navigate(['plannings']);
    //   }
      
    // });
  }

  register(){
    //alert("register: " + this.emailAdress + " " + this.password);
    var newuser = {
      email: this.emailAdress,
      password: this.password
    };
    this.http.post(Configs.registerUrl, newuser)
    .subscribe((resp: any) => {

      this.authService.setAccessToken(resp.token);
      this.router.navigate(['plannings']);
    });
  }
}
