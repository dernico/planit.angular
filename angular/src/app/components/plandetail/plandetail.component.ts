import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../models/Planing';
import { PlanningService } from '../../services/planning.service';
import { Step } from '../../models/Step';
import { Todo } from '../../models/Todo';
import { PlaceSuggestion } from '../../models/PlaceSuggestion';
import { PlaceSearchResult } from '../../models/PlaceSearchResult';
import { Observable } from 'rxjs/Observable';
import { PlaceDetail } from '../../models/PlaceDetail';

@Component({
  selector: 'app-plandetail',
  templateUrl: './plandetail.component.html',
  styleUrls: ['./plandetail.component.css']
})
export class PlanDetailComponent implements OnInit {
  private baseUrl = 'http://localhost:4200/plannings';
  private placesAutocompleteUrl = 'http://localhost:4200/places/autocomplete';
  private placesSearchUrl = 'http://localhost:4200/places/search';
  private placesDetailsUrl = 'http://localhost:4200/places/details';
  private placesPhotoUrl = 'http://localhost:4200/places/photo';
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

  addStep(suggest: PlaceSuggestion, days){
    this.placeDetails(suggest.place_id, (place : PlaceDetail) => {
      var newStep = new Step();
      newStep.title = place.name;
      newStep.days = days;
      newStep.location = place.geometry.location;

      if(place.photos.length > 0 ){
        var photo = place.photos[0];
        newStep.photoUrl = this.placesPhotoUrl + "?photoid=" +photo.photo_reference;
        newStep.photoUrl = place.photo;
      }

      this.plan.steps.push(newStep);
      this.updatePlan(this.plan);
    });
  }

  stepKeyUp(value){
    clearTimeout(this.searchTimer);
    this.searchPlaces(value, (suggestlist) => {
      this.suggestlist = suggestlist;
    })
  }

  private placeDetails(placeid, cb: any){
    let url = this.placesDetailsUrl + '?placeid='+placeid;
    this.http.get(url).subscribe((res: any) => {
      cb(res.result);
    });
  }

  private searchPlaces(query: any, cb: any){

    this.searchTimer = setTimeout(() => {
      var url = this.placesAutocompleteUrl + '?q=' + encodeURIComponent(query);
      this.http.get(url).subscribe((res: any) => {
        //cb(res.results);
        cb(res.predictions);
      });
    }, 1000);

  }
  
  displaySuggest(suggest: PlaceSuggestion){
    return suggest ? suggest.description : suggest;
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
