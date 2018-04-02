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
  private totalCosts: number;
  private costShares = [];
  private costPerPerson: number;

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
        this.initPlanning(params.id);
        this.calcCostShare();
    });
  }

  private initPlanning(id){
    this.plan = this.planningService.getPlanning(id);
        if(this.plan.costs == undefined){
          this.plan.costs = [];
        }
  }

  public displayWithDisplayName(user: User){
    return user ? user.displayName : user;
  }

  public fromSelectionChange(user: User){
    this.selectedFromUser = user;
  }
  
  public addCosts(whatFor, amount){
    let cost = new Cost();
    cost.amount = parseFloat(amount);
    cost.for = whatFor;
    cost.from = this.selectedFromUser; //this.plan.loggedInUser;
    this.plan.costs.push(cost);
    this.updatePlan(this.plan);
  }

  public deleteCost(index){
    this.plan.costs.splice(index, 1);
    this.updatePlan(this.plan);
  }

  private calcCostShare(){
    this.costShares = [];

    this.totalCosts = 0;
    this.costPerPerson = 0;
    this.plan.costs.forEach(cost => {
      let amount = parseFloat( cost.amount.toString() );
      this.totalCosts += amount
      this.costPerPerson += amount / this.plan.users.length;
    });

    this.plan.users.forEach(user => {
      var currentUser = {
        _id: user._id,
        name: user.displayName,
        totalAmount: 0,
        owes:[]
      };

      this.plan.costs.forEach(cost => {
        if(cost.from._id != currentUser._id){
          
          let amount = parseFloat( cost.amount.toString() );
          let amountPerPerson = amount / this.plan.users.length;
          currentUser.totalAmount += amountPerPerson;

          var oweUser = currentUser.owes.find(owe => {return owe.name == cost.from.displayName});

          if(oweUser){
            oweUser.amount += amountPerPerson;
            return;
          }
          
          currentUser.owes.push({
            name: cost.from.displayName,
            amount: amountPerPerson
          });
        }
      });
      this.costShares.push(currentUser);
    });
  }

  
  private updatePlan(plan: Planning) {

    this.planningService.setPlanning(plan);
    this.http.post(Configs.planningsUrl, plan).subscribe((resp) => {
      this.initPlanning(this.plan._id);
      this.calcCostShare();
    });
  }
}
