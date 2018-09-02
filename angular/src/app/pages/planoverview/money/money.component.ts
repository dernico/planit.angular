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
  private costSharesSmart = [];
  private costPerPerson: number;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private planningService: PlanningService
  ) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.route
      .params
      .subscribe(params => {
        this.initPlanning(params.id);
        this.calcCostShare();
        this.calcCostSharSmart();
      });
  }

  private initPlanning(id) {
    this.plan = this.planningService.getPlanning(id);
  }

  public displayWithDisplayName(user: User) {
    return user ? user.displayName : user;
  }

  public fromSelectionChange(user: User) {
    this.selectedFromUser = user;
  }

  public addCosts(whatFor, amount) {
    let cost = new Cost();
    cost.amount = parseFloat(amount);
    cost.for = whatFor;
    cost.from = this.selectedFromUser; //this.plan.loggedInUser;
    this.plan.costs.push(cost);
    this.updatePlan(this.plan);
  }

  public deleteCost(index) {
    this.plan.costs.splice(index, 1);
    this.updatePlan(this.plan);
  }

  private calcCostShare() {
    this.costShares = [];

    this.totalCosts = 0;

    this.plan.steps.forEach(step => {
      step.todos.forEach(todo => {
        this.totalCosts += todo.costs;
      });
    });

    this.costPerPerson = 0;
    this.plan.costs.forEach(cost => {
      let amount = parseFloat(cost.amount.toString());
      this.totalCosts += amount
    });

    
    this.costPerPerson += this.totalCosts / this.plan.users.length;

    this.plan.users.forEach(user => {
      var currentUser = {
        _id: user._id,
        name: user.displayName,
        totalAmount: 0,
        owes: []
      };

      this.plan.costs.forEach(cost => {
        if (cost.from._id != currentUser._id) {

          let amount = parseFloat(cost.amount.toString());
          let amountPerPerson = amount / this.plan.users.length;
          currentUser.totalAmount += amountPerPerson;

          var oweUser = currentUser.owes.find(owe => { return owe.name == cost.from.displayName });

          if (oweUser) {
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

  private calcCostSharSmart() {
    this.costSharesSmart = [];

    this.totalCosts = 0;
    
    this.plan.steps.forEach(step => {
      step.todos.forEach(todo => {
        this.totalCosts += todo.costs;
      });
    });

    this.costPerPerson = 0;

    this.plan.costs.forEach(cost => {
      let amount = parseFloat(cost.amount.toString());
      this.totalCosts += amount
    });

    
    this.costPerPerson += this.totalCosts / this.plan.users.length;

    this.plan.users.forEach(user => {
      var currentUser = {
        _id: user._id,
        name: user.displayName,
        amountToPay: this.costPerPerson,
        totalAmount: this.costPerPerson,
        owes: []
      };

      var payedFromUser = this.plan.costs.filter(cost => { return cost.from._id == user._id });
      payedFromUser.forEach(cost => {
        currentUser.amountToPay -= cost.amount;
      });

      this.costSharesSmart.push(currentUser);
    });

    this.costSharesSmart.forEach(c => {
      if (c.amountToPay < 0) {
        var theothers = this.costSharesSmart.filter(c2 => { return c2._id != c._id && c2.amountToPay > 0 });
        theothers.forEach(o => {
          if (c.amountToPay < 0) {
            
            var test = c.amountToPay + o.amountToPay;
            if (test <= 0) {
              c.amountToPay += o.amountToPay;
              o.totalAmount += o.amountToPay;
              o.owes.push({
                name: c.name,
                amount: o.amountToPay
              });
              o.amountToPay = 0;
            }
            else {
              var theAmoutToGetZero = (-1 * c.amountToPay);
              o.totalAmount += theAmoutToGetZero;
              o.amountToPay -= theAmoutToGetZero;
              c.amountToPay += theAmoutToGetZero;
              o.owes.push({
                name: c.name,
                amount: theAmoutToGetZero
              });
            }

          }
        });
      }
    });
  }


  private updatePlan(plan: Planning) {

    this.planningService.setPlanning(plan);
    this.http.post(Configs.planningsUrl, plan).subscribe((resp) => {
      this.initPlanning(this.plan._id);
      this.calcCostShare();
      this.calcCostSharSmart();
    });
  }
}
