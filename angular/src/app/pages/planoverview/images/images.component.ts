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
import { File } from '../../../models/File'
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  private plan: Planning;
  public images: Array<File>;
  public fileupload = {
    imagesurl: Configs.imagesUrl
  };

  constructor(
    private http: HttpClient,
    private fileService: FileService,
    private route: ActivatedRoute,
    private router: Router,
    private planningService: PlanningService
  ) {
    this.images = [];
   }

  ngOnInit() {
    this.init();
  }

  private init(){
    this.route
    .params
    .subscribe(params => {
        this.plan = this.planningService.getPlanning(params.id);
        if(this.plan.images == undefined){
          this.plan.images = [];
        }
        this.loadFiles();
    });
  }
  private updatePlan(plan: Planning){

    this.planningService.setPlanning(plan);
    this.http.post(Configs.planningsUrl, plan).subscribe((resp) => {this.loadFiles();});
  }
  
  addImagesToPlan(newImages){
    if (!this.plan.images){
      this.plan.images = [];
    }
    this.plan.images = this.plan.images.concat(newImages);
    this.updatePlan(this.plan);
  }

  private loadFiles(){
    // this.fileService.loadFilesForPlan(Configs.imagesUrl, this.plan._id).subscribe((res : Array<File>) => {
    //   this.files = res;
    // });
  }

  public deleteFile(index){
    var fileid = this.plan.images[index].fileId;

    this.fileService.deleteFile(Configs.fileUrl, fileid).subscribe(() => {

      this.plan.images.splice(index, 1);
      this.updatePlan(this.plan);
      
    });
  }
}
