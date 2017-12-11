import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../../models/Planing';
import { PlanningService } from '../../../services/planning.service';
import { Step } from '../../../models/Step';
import { Todo } from '../../../models/Todo';
import { PlaceSuggestion } from '../../../models/PlaceSuggestion';
import { PlaceSearchResult } from '../../../models/PlaceSearchResult';
import { Observable } from 'rxjs/Observable';
import { PlaceDetail } from '../../../models/PlaceDetail';
import { Configs } from '../../../configs';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  private mapsApiKey = Configs.mapsApiKey;
  private plan: Planning;
  private startDate;
  private endDate;
  private suggestlist = [];
  private selectedSuggestion: PlaceSuggestion;
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
        // var photo = place.photos[0];
        // newStep.photoUrl = this.placesPhotoUrl + "?photoid=" +photo.photo_reference;
        // newStep.photoUrl = place.photo;
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
    let url = Configs.placesDetailsUrl + '?placeid='+placeid;
    this.http.get(url).subscribe((res: any) => {
      cb(res.result);
    });
  }

  private searchPlaces(query: any, cb: any){

    this.searchTimer = setTimeout(() => {
      var url = Configs.placesAutocompleteUrl + '?q=' + encodeURIComponent(query);
      this.http.get(url).subscribe((res: any) => {
        //cb(res.results);
        cb(res.predictions);
      });
    }, 1000);

  }
  
  displaySuggest(suggest: PlaceSuggestion){
    return suggest ? suggest.description : suggest;
  }

  suggestlistSelectionChanged(suggest: PlaceSuggestion){
    this.selectedSuggestion = suggest;
  }

  removeStep(index){
    this.plan.steps.splice(index, 1);

    this.updatePlan(this.plan);
  }

  addTodo(suggest: PlaceSuggestion, step: Step){
    this.placeDetails(suggest.place_id, (place : PlaceDetail) => {
      var newTodo = new Todo();
      newTodo.title = place.name;
      newTodo.location = place.geometry.location;
      step.todos.push(newTodo);

      // if(place.photos.length > 0 ){
      //   // var photo = place.photos[0];
      //   // newStep.photoUrl = this.placesPhotoUrl + "?photoid=" +photo.photo_reference;
      //   // newStep.photoUrl = place.photo;
      // }

      this.updatePlan(this.plan);
    });
  }

  removeTodo(index, step: Step){
    step.todos.splice(index, 1);

    this.updatePlan(this.plan);
  }

  private updatePlan(plan: Planning){

    this.planningService.setPlanning(plan);
    this.http.post(Configs.planningsUrl, plan).subscribe((resp) => {
      console.log(resp);
    });
  }
}
