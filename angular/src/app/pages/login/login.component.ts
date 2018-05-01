import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
  constructor(
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
}
