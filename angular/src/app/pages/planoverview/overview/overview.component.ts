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
  private startDate;
  private endDate;
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
        if(this.plan.steps == undefined){
          this.plan.steps = [];
        }
    });
  }

  sharePlan(){
    this.router.navigate(['share', this.plan._id]);
  }
  
  goToDetails(stepid){
    this.router.navigate(['stepdetails', this.plan._id, stepid]);
  }

  planChanged(){
    this.updatePlan(this.plan);
  }

  stepChanged(step: Step){
    //delete Object.getPrototypeOf(newObj).name
    if("edit" in step){
      delete step["edit"];
    }
    
    if(!step._id){
      // this is when step is a new step!
      this.plan.steps.push(step);
    }

    if(this.plan.steps.length > 0){
      
      let prevStep;
      if(!step._id){
        // this is when step is a new step!
        prevStep = this.plan.steps[this.plan.steps.length - 2];
      }
      else{
        // this is when step already exists
        for(let i = 0; i < this.plan.steps.length; i++){
          if(this.plan.steps[i]._id == step._id){
            if(i > 0){
              prevStep = this.plan.steps[i - 1];
              break;
            }
          }
        }
      }
      if(prevStep){

        var url = Configs.placesDistanceUrl + "?startLat=" + prevStep.location.lat + "&startLng=" + prevStep.location.lng;
        url += "&endLat=" + step.location.lat + "&endLng=" + step.location.lng;
        this.http.get(url).subscribe( (rows :Array<any>) => {
          if(rows.length > 0  && rows[0].elements.length > 0){
            var result = rows[0].elements[0];
            var distance = new Distance();
            distance.distance = {
              text: result.distance.text,
              value: result.distance.value
            };
            distance.duration = {
              text: result.duration.text,
              value: result.duration.value
            };
            prevStep.distance = distance;
          }
          
          this.updatePlan(this.plan);
        });
      }
      else{
        this.updatePlan(this.plan);
      }
    }else{
      this.updatePlan(this.plan);
    }
  }

  placesSelectionChanged(suggest: PlaceSuggestion){
    this.selectedSuggestion = suggest;
  }

  placesSelectionUpdate(suggest: PlaceSuggestion, index){
    this.placeDetails(suggest.place_id, (place : PlaceDetail) => {
      let step = this.plan.steps[index];
      step.title = place.name;
      step.location = place.geometry.location;
      this.stepChanged(step);
    });
  }

  addStep(todo: Todo, days){
    var newStep = new Step();
    newStep.title = todo.title;
    newStep.days = days;
    newStep.location = todo.location;
    this.stepChanged(newStep);
  }

  private placeDetails(placeid, cb: any){
    let url = Configs.placesDetailsUrl + '?placeid='+placeid;
    this.http.get(url).subscribe((res: any) => {
      cb(res.result);
    });
  }

  removeStep(index){
    this.plan.steps.splice(index, 1);
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

  addFilesToPlan(newFiles){
    if (!this.plan.files){
      this.plan.files = [];
    }
    this.plan.files = this.plan.files.concat(newFiles);
    this.updatePlan(this.plan);
  }
  deleteFileFromPlan(index){
    this.plan.files.splice(index, 1);
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

