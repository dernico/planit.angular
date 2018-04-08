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

  backToPlannings(){
    this.router.navigate(['plannings']);
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

  addStep(suggest: PlaceSuggestion, days){
    this.placeDetails(suggest.place_id, (place : PlaceDetail) => {
      var newStep = new Step();
      newStep.title = place.name;
      newStep.days = days;
      newStep.location = place.geometry.location;

      // if(place.photos.length > 0 ){
      //   var photo = place.photos[0];
      //   newStep.photoUrl = this.placesPhotoUrl + "?photoid=" +photo.photo_reference;
      //   newStep.photoUrl = place.photo;
      // }
      this.stepChanged(newStep);
    });
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
      this.fileService.loadFilesForPlan(this.plan._id).subscribe((files: Array<File>) => {
        
        files.forEach(file => {
          this.plan.files
        });
      });
    }
  }

  addFilesToPlan(newFile){
    if (!this.plan.files){
      this.plan.files = [];
    }
    this.plan.files.push(newFile);
    this.updatePlan(this.plan);
  }
  deleteFileFromPlan(index){
    this.plan.files.splice(index, 1);
    this.updatePlan(this.plan);
  }

  downloadFile(file:File){
    const headers = new HttpHeaders();
    headers.append('Accept', 'text/plain');
    this.http.get(file.url, {headers: headers, responseType: 'blob'}).subscribe(resp =>{
      //const blob = new Blob([resp], { type: 'application/octet-stream' });
      const blob = new Blob([resp], { type: 'application/pdf' });
      //saveAs(blob, file.filename + "." + file.extension);
      this.showFile(blob, file.filename);
    });
  }

  private findStep(stepid, cb){
    this.plan.steps.forEach(step => {
      if(step._id == stepid){
        cb(step);
      }
    });
  }

  private showFile(newBlob, filename){
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    //var newBlob = new Blob([blob], {type: "application/pdf"})
  
    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    } 

    // var reader = new FileReader();
    // //var out = new Blob([this.response], {type: 'application/pdf'});
    // reader.onload = function(e){
    //   window.location.href = reader.result;
    // }
    // reader.readAsDataURL(newBlob);
    var url = URL.createObjectURL(newBlob);
    window.open(url,'_self');
    return;
  
    // For other browsers: 
    // Create a link pointing to the ObjectURL containing the blob.

    // const data = window.URL.createObjectURL(newBlob);
    // var link = document.createElement('a');
    // link.href = data;
    // link.download=filename;
    // link.click();
    // setTimeout(function(){
    //   // For Firefox it is necessary to delay revoking the ObjectURL
    //   console.log("show file calling 2");
    //   window.URL.revokeObjectURL(data)
    // , 100});
  }
}

