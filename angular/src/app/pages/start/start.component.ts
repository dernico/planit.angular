import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  
  title = 'plan it';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    
    if(this.authService.getAccessToken()){
      this.router.navigate(['plannings']);
    }
  }
}
