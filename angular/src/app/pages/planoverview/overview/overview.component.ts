import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../../models/Planing';
import { PlanningService } from '../../../services/planning.service';
import { Step } from '../../../models/Step';
import { Todo } from '../../../models/Todo';
import { PlaceSuggestion } from '../../../models/PlaceSuggestion';
import { Configs } from '../../../configs';
import { FileService } from '../../../services/file.service';
import { File } from '../../../models/File';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  public plan: Planning;
  public files;
  public selectedSuggestion;
  public stepDays;

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
        this.plan = this.planningService.getPlanning(params.id);
      });
  }

  sharePlan() {
    this.router.navigate(['share', this.plan._id]);
  }

  goToDetails(stepid) {
    this.router.navigate(['stepdetails', this.plan._id, stepid]);
  }

  startDateChanged() {
    this.plan.endDate = this.plan.startDate;
  }

  planChanged() {
    this.planningService.setPlanning(this.plan);
  }

  getFromToDates(step: Step, stepIndex){
    let alreadySpentDays = 0;
    for(var i = 0; i < stepIndex; i++){
      alreadySpentDays += this.plan.steps[i].days;
    }
    let startDate = new Date(this.plan.startDate);
    startDate.setDate(startDate.getDate() + alreadySpentDays);

    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + step.days);
    return  startDate.toLocaleDateString() + " - " + endDate.toLocaleDateString();
  }


  placesSelectionChanged(suggest: PlaceSuggestion) {
    this.selectedSuggestion = suggest;
  }

  placesSelectionUpdate(suggest: Todo, index) {
    if (!suggest || !suggest.title) return;


    let step = this.plan.steps[index];
    step.title = suggest.title;
    //step.location = suggest.location;
    //this.stepChanged(step);
  }

  stepTotalCosts(step: Step) {
    return this.planningService.stepTotalCosts(step);
  }

  addStep(todo: Todo, days) {
    var newStep = new Step();
    newStep.title = todo.title;
    newStep.days = days;
    newStep.location = todo.location;
    this.planningService.addStep(this.plan, newStep);
    this.planningService.setPlanning(this.plan).then(newPlanning => {
      this.plan = newPlanning;
    });;
  }

  stepUpdate(step: Step) {
    this.planningService.removeEdit(step);
    this.planningService.setPlanning(this.plan);
  }

  removeStep(index) {
    this.plan.steps.splice(index, 1);
    this.planningService.setPlanning(this.plan);
  }

  refreshFiles(status) {
    if (status) {
      this.fileService.loadFilesForPlan(this.plan._id).subscribe((files: Array<File>) => {

        files.forEach(file => {
          this.plan.files
        });
      });
    }
  }

  addFilesToPlan(newFiles: File[]) {
    this.planningService.addFilesToPlan(this.plan, newFiles);
  }

  downloadFile(file: File) {
    this.fileService.downloadFile(file);
  }
}

