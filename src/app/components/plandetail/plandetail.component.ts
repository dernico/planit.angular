import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../models/Planing';
import { PlanningService } from '../../services/planning.service';
import { Step } from '../../models/Step';
import { Todo } from '../../models/Todo';
import { PlaceSuggestion } from '../../models/PlaceSuggestion';
import { PlaceSearchResult } from '../../models/PlaceSearchResult';

@Component({
  selector: 'app-plandetail',
  templateUrl: './plandetail.component.html',
  styleUrls: ['./plandetail.component.css']
})
export class PlanDetailComponent implements OnInit {
  private baseUrl = 'http://localhost:4200/plannings';
  private placesAutocompleteUrl = 'http://localhost:4200/places/autocomplete';
  private placesUrl = 'http://localhost:4200/places/search';
  private plan: Planning;
  private startDate;
  private endDate;
  private suggestlist = [];
  private searchTimer:any;

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

  addStep(suggest: PlaceSearchResult, days){
    var newStep = new Step();
    newStep.title = suggest.name;
    newStep.days = days;
    newStep.location = suggest.geometry.location;
    this.plan.steps.push(newStep);
    
    this.updatePlan(this.plan);
  }

  stepKeyUp(value){
    clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      var url = this.placesUrl + '?q=' + encodeURIComponent(value);
      this.http.get(url).subscribe((res: any) => {
        this.suggestlist = res.results;
      });
    }, 1000);
  }
  
  displaySuggest(suggest: PlaceSearchResult){
    return suggest ? suggest.name : suggest;
  }

  removeStep(index){
    this.plan.steps.splice(index, 1);

    this.updatePlan(this.plan);
  }

  addTodo(title: string, step: Step){
    var newTodo = new Todo();
    newTodo.title = title;

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
