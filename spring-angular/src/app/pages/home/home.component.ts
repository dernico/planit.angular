import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session/session.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private session: SessionService
    ) { }

  ngOnInit() {
    if(!this.session.getAccessToken()){
      this.router.navigate(['login']);
    }
  }

  logout(){
    this.session.logout();
    this.router.navigate(['login']);
  }

}
