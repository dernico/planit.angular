import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../models/Planing'
import { PlanningService } from '../../services/planning.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {
  baseUrl = 'http://localhost:4200/plannings';
  plannings: Array<Planning> = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private planningService: PlanningService
  ) { }

  ngOnInit() {
    this.init();
  }

  init(){
    this.http.get(this.baseUrl).subscribe( (items: Array<Planning>) => {
      items.forEach(item => {
        this.plannings = items;
        this.planningService.setPlannings(items);
      });
    });
  }

  goto(planid){
    this.router.navigate(['plan', planid]);
  }

  add(name) {
    this.http.post(this.baseUrl, {title: name}).subscribe(() => {
      this.init();
    });
  }
}
