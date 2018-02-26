import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../../models/Planing';
import { PlanningService } from '../../../services/planning.service';
import { Observable } from 'rxjs/Observable';
import { Configs } from '../../../configs';
import { Cost } from '../../../models/Cost';
import { User } from '../../../models/User';


@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.css']
})
export class MoneyComponent implements OnInit {
  private plan: Planning;
  private selectedFromUser: User;

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
        if(this.plan.costs == undefined){
          this.plan.costs = [];
        }
    });
  }

  public displayWithDisplayName(user: User){
    return user ? user.displayName : user;
  }

  public fromSelectionChange(user: User){
    this.selectedFromUser = user;
  }
  
  public addCosts(whatFor, amount){
    let cost = new Cost();
    cost.amount = amount;
    cost.for = whatFor;
    cost.from = this.selectedFromUser; //this.plan.loggedInUser;
    this.plan.costs.push(cost);
    this.updatePlan(this.plan);
  }

  public deleteCost(index){
    this.plan.costs.splice(index, 1);
    this.updatePlan(this.plan);
  }

  
  private updatePlan(plan: Planning){

    this.planningService.setPlanning(plan);
    this.http.post(Configs.planningsUrl, plan).subscribe((resp) => {});
  }
}
