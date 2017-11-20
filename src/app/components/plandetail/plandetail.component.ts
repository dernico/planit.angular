import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../models/Planing';
import { PlanningService } from '../../services/planning.service';

@Component({
  selector: 'app-plandetail',
  templateUrl: './plandetail.component.html',
  styleUrls: ['./plandetail.component.css']
})
export class PlanDetailComponent implements OnInit {
  private baseUrl = 'http://localhost:4200/plannings';
  private plan: Planning;
  private startDate;
  private endDate;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private planningService: PlanningService
  ) { }

  ngOnInit() {
    this.init();
  }

  init(){
    this.route
    .params
    .subscribe(params => {
        this.plan = this.planningService.getPlanning(params.id);
        this.startDate = new Date(this.plan.startDate).toDateString();
        this.endDate = new Date(this.plan.endDate).toDateString();
    });
  }

  dateChanged(){
    var partialPlan = {
      _id: this.plan._id,
      startDate:  this.startDate,
      endDate: this.endDate,
    };
    this.plan.startDate = this.startDate;
    this.plan.endDate = this.endDate;

    this.planningService.setPlanning(this.plan);
    this.http.post(this.baseUrl, partialPlan).subscribe((resp) => {
      console.log(resp);
    });
  }
}
