import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../models/Planing'
import { PlanningService } from '../../services/planning.service';
import { Configs } from '../../configs';

@Component({
  selector: 'app-plannings',
  templateUrl: './plannings.component.html',
  styleUrls: ['./plannings.component.css']
})
export class PlanningsComponent implements OnInit {
  
  public name: string;
  public plannings: Array<Planning> = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private planningService: PlanningService
  ) { }

  ngOnInit() {
    this.init();
  }

  init(){
    this.http.get(Configs.planningsUrl).subscribe( (items: Array<Planning>) => {
      this.planningService.setPlannings(items);
      this.plannings = items;
    });
  }

  goto(planid){
    this.router.navigate(['planoverview', planid]);
  }

  add(name) {
    this.http.post(Configs.planningsUrl, {title: name}).subscribe(() => {
      this.init();
    });
  }
}
