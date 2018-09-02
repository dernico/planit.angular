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
import { Distance } from '../../../models/Distance';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  private mapsApiKey = Configs.mapsApiKey;
  private plan: Planning;
  private files;
  private selectedSuggestion;
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
        this.plan = this.planningService.getPlanning(params.id);
    });
  }

  sharePlan(){
    this.router.navigate(['share', this.plan._id]);
  }
  
  goToDetails(stepid){
    this.router.navigate(['stepdetails', this.plan._id, stepid]);
  }

  startDateChanged(){
    this.plan.endDate = this.plan.startDate;
  }

  planChanged(){
    this.planningService.setPlanning(this.plan);
  }

  stepChanged(step: Step){
    this.planningService.addStep(this.plan, step);
  }

  placesSelectionChanged(suggest: PlaceSuggestion){
    this.selectedSuggestion = suggest;
  }

  placesSelectionUpdate(suggest: Todo, index){
    if(!suggest || !suggest.title || !suggest.location) return;


      let step = this.plan.steps[index];
      step.title = suggest.title;
      step.location = suggest.location;
      this.stepChanged(step);
  }

  stepTotalCosts(step: Step){
    return this.planningService.stepTotalCosts(step);
  }

  addStep(todo: Todo, days){
    var newStep = new Step();
    newStep.title = todo.title;
    newStep.days = days;
    newStep.location = todo.location;
    this.stepChanged(newStep);
  }
  
  stepUpdate(step: Step, stepTitle){
    step.title = stepTitle;
    this.planningService.setPlanning(this.plan);
  }

  removeStep(index){
    this.plan.steps.splice(index, 1);
    this.planningService.setPlanning(this.plan);
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

  addFilesToPlan(newFiles: File[]){
    this.planningService.addFilesToPlan(this.plan, newFiles);
  }

  downloadFile(file:File){
    this.fileService.downloadFile(file);
  }
}

