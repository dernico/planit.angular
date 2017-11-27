import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../models/Planing';
import { PlanningService } from '../../services/planning.service';
import { Step } from '../../models/Step';
import { Todo } from '../../models/Todo';

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
        if(this.plan.steps == undefined){
          this.plan.steps = [];
        }
    });
  }

  planChanged(){
    this.updatePlan(this.plan);
  }

  addStep(title, days){
    var newStep = new Step();
    newStep.title = title;
    newStep.days = days;
    this.plan.steps.push(newStep);
    
    this.updatePlan(this.plan);
  }

  removeStep(index){
    this.plan.steps.splice(index, 1);

    this.updatePlan(this.plan);
  }

  addTodo(title: string, step: Step){
    var newTodo = new Todo();
    newTodo.title = title;

    //remove tmp field
    //delete step.todoTitle;

    step.todos.push(newTodo);
    
    this.updatePlan(this.plan);
  }

  removeTodo(index, step: Step){
    step.todos.splice(index, 1);

    this.updatePlan(this.plan);
  }

  private updatePlan(plan: Planning){

    this.planningService.setPlanning(plan);
    this.http.post(this.baseUrl, plan).subscribe((resp) => {
      console.log(resp);
    });
  }
}
