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
import { MatDialogModule } from '@angular/material/dialog';
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
  private selectedTodo: Todo;
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

  init() {
    this.route
      .params
      .subscribe(params => {
        this.plan = this.planningService.getPlanning(params.planid);
        if (this.plan.steps != undefined) {
          this.step = this.plan.steps.find(s => { return s._id == params.stepid });
        }
      });
  }

  backToPlannings() {
    this.router.navigate(['planoverview', this.plan._id]);
  }

  planChanged() {
    this.planningService.setPlanning(this.plan);
  }

  stepUpdate(step: Step, stepTitle){
    step.title = stepTitle;
    this.planningService.setPlanning(this.plan);
  }

  placesSelectionChanged(newTodo: Todo) {
    this.selectedTodo = newTodo;
  }

  placesSelectionUpdate(todo: Todo, index) {

    this.selectedTodo = todo;
    // let step = this.plan.steps[index];
    // step.title = todo.title;
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

  private placeDetails(placeid, cb: any) {
    let url = Configs.placesDetailsUrl + '?placeid=' + placeid;
    this.http.get(url).subscribe((res: any) => {
      cb(res.result);
    });
  }

  getTodosWithLocation(todos: Array<Todo>) {
    return todos.filter(item => { return item.location; });
  }

  addTodo(step: Step, costs) {
    
    this.selectedTodo.costs = Number.parseFloat(costs);
    step.todos.push(this.selectedTodo);
    this.planningService.setPlanning(this.plan);
    this.selectedTodo = null;
  }

  removeTodo(index, step: Step) {
    step.todos.splice(index, 1);
    this.planningService.setPlanning(this.plan);
  }
  refreshFiles(status) {
    if (status) {
      this.fileService.loadFilesForPlan(Configs.fileUrl, this.plan._id).subscribe((files: Array<File>) => {

        files.forEach(file => {
          this.plan.files
        });
      });
    }
  }

  addFilesToStep(newFiles, step) {

    if (!("files" in step)) {
      step.files = [];
    }

    step.files = step.files.concat(newFiles);
    this.planningService.setPlanning(this.plan);

  }

}

