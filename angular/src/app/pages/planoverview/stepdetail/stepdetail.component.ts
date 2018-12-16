import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../../models/Planing';
import { PlanningService } from '../../../services/planning.service';
import { Step } from '../../../models/Step';
import { Todo } from '../../../models/Todo';
import { Configs } from '../../../configs';
import { FileService } from '../../../services/file.service';
import { File } from '../../../models/File';
import { Location } from '../../../models/Location';

@Component({
  selector: 'app-stepdetail',
  templateUrl: './stepdetail.component.html',
  styleUrls: ['./stepdetail.component.css']
})
export class StepDetailComponent implements OnInit {
  public plan: Planning;
  public step: Step;
  public selectedTodo: Todo;
  public location : Location;
  
  constructor(
    private fileService: FileService,
    private route: ActivatedRoute,
    private router: Router,
    private planningService: PlanningService
  ) { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.route
      .params
      .subscribe(params => {
        this.plan = this.planningService.getPlanning(params.planid);
        if (this.plan.steps != undefined) {
          this.step = this.plan.steps.find(s => { return s._id == params.stepid });
        }
      });
      // if (navigator.geolocation) {
      //   var self = this;
      //   navigator.geolocation.getCurrentPosition(position => {
      //     self.showPosition(position);
      //   });
      // }
  }

  showPosition(position) {
    this.location = new Location();
    this.location.lat = position.coords.latitude;
    this.location.lng = position.coords.longitude; 
  }

  backToPlannings() {
    this.router.navigate(['planoverview', this.plan._id]);
  }

  planChanged() {
    this.planningService.setPlanning(this.plan);
  }

  stepUpdate(step: Step){
    this.planningService.removeEdit(step);
    this.planningService.setPlanning(this.plan);
  }

  todoChanged(newTodo: Todo) {
    this.selectedTodo = newTodo;
  }

  stepSelectionUpdate(todo: Todo) {
    //this.selectedTodo = todo;
    this.step.title = todo.title;
    // console.log(todo);
    // this.planningService.setPlanning(this.plan);

    // disable places
    // this.placeDetails(suggest.place_id, (place: PlaceDetail) => {
    //   let step = this.plan.steps[index];
    //   step.title = place.name;
    //   step.location = place.geometry.location;
    //   this.planningService.setPlanning(this.plan);
    // });
  }


  getTodosWithLocation(todos: Array<Todo>) {
    return todos.filter(item => { return item.location; });
  }


}

