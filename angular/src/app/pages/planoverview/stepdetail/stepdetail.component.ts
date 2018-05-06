import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { FileService } from '../../../services/file.service';
import { saveAs } from 'file-saver';
import { File } from '../../../models/File';

@Component({
  selector: 'app-stepdetail',
  templateUrl: './stepdetail.component.html',
  styleUrls: ['./stepdetail.component.css']
})
export class StepDetailComponent implements OnInit {
  private mapsApiKey = Configs.mapsApiKey;
  private plan: Planning;
  private step: Step;
  private files;
  private selectedTodo : Todo;
  private todoInputValue: string;
  private fileupload = {
    fileurl: Configs.fileUrl
  };

  constructor(
    private http: HttpClient,
    private fileService: FileService,
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
        this.plan = this.planningService.getPlanning(params.planid);
        if(this.plan.steps != undefined){
          this.step = this.plan.steps.find(s => {return s._id == params.stepid});
        }
    });
  }

  backToPlannings(){
    this.router.navigate(['planoverview', this.plan._id]);
  }

  planChanged(){
    this.updatePlan(this.plan);
  }

  placesSelectionChanged(newTodo: Todo){
    this.selectedTodo = newTodo;
  }

  placesSelectionUpdate(suggest: PlaceSuggestion, index){
    this.placeDetails(suggest.place_id, (place : PlaceDetail) => {
      let step = this.plan.steps[index];
      step.title = place.name;
      step.location = place.geometry.location;
      this.updatePlan(this.plan);
    });
  }

  private placeDetails(placeid, cb: any){
    let url = Configs.placesDetailsUrl + '?placeid='+placeid;
    this.http.get(url).subscribe((res: any) => {
      cb(res.result);
    });
  }

  getTodosWithLocation(todos: Array<Todo>){
    return todos.filter(item => { return item.location; });
  }

  addTodo(step: Step){
    console.log(this.selectedTodo + " - " + this.todoInputValue);
    step.todos.push(this.selectedTodo);
    this.updatePlan(this.plan);
    this.selectedTodo = null;
  }

  removeTodo(index, step: Step){
    step.todos.splice(index, 1);

    this.updatePlan(this.plan);
  }

  private updatePlan(plan: Planning){

    this.planningService.setPlanning(plan);
    this.http.post(Configs.planningsUrl, plan).subscribe((resp) => {});
  }

  refreshFiles(status){
    if(status){
      this.fileService.loadFilesForPlan(Configs.fileUrl, this.plan._id).subscribe((files: Array<File>) => {
        
        files.forEach(file => {
          this.plan.files
        });
      });
    }
  }

  addFilesToStep(newFiles, stepid){
    this.findStep(stepid, (step) =>{
      if(!("files" in step)){
        step.files = [];
      }
      
      step.files = step.files.concat(newFiles);
      this.updatePlan(this.plan);
    });
  }

  deleteFileFromStep(index, stepid){
    this.findStep(stepid, (step) =>{
      step.files.splice(index, 1);
    });
    this.updatePlan(this.plan);
  }

  downloadFile(file:File){
    this.fileService.downloadFile(file);
  }

  private findStep(stepid, cb){
    this.plan.steps.forEach(step => {
      if(step._id == stepid){
        cb(step);
      }
    });
  }
}

