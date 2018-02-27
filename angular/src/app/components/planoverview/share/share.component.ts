import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../../models/Planing';
import { PlanningService } from '../../../services/planning.service';
import { Observable } from 'rxjs/Observable';
import { Configs } from '../../../configs';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  private plan: Planning;
  public email: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private planningService: PlanningService
  ) {}

  ngOnInit() {
    this.init();
  }

  private init(){
    this.route
    .params
    .subscribe(params => {
        this.plan = this.planningService.getPlanning(params.id);
    });
  }
  
  share(){
    this.http.post(Configs.shareUrl, { email: this.email, planid: this.plan._id }).subscribe(() => {
      this.updatePlan();
    });
  }
  
  private updatePlan(){
    this.http.get(Configs.planningsUrl).subscribe( (items: Array<Planning>) => {
        this.planningService.setPlannings(items);
        this.plan = this.planningService.getPlanning(this.plan._id);
        this.router.navigate(['planoverview', this.plan._id]);
    });
  }
}
