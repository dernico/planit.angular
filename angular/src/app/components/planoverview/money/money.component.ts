import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../../models/Planing';
import { PlanningService } from '../../../services/planning.service';
import { Observable } from 'rxjs/Observable';
import { Configs } from '../../../configs';
import { Cost } from '../../../models/Cost';


@Component({
  selector: 'app-money',
  templateUrl: './money.component.html',
  styleUrls: ['./money.component.css']
})
export class MoneyComponent implements OnInit {
  private plan: Planning;

  constructor(
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
  
  public addCosts(whatFor, amount){
    let cost = new Cost();
    cost.amount = amount;
    cost.for = whatFor;
    this.plan.costs.push(cost)
  }

  public deleteCost(id){
  }
}
