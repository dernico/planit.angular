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
import { File } from '../../../models/File'

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  private plan: Planning;
  public files: Array<File>;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private planningService: PlanningService
  ) {
    this.files = [];
   }

  ngOnInit() {
    this.init();
  }

  private init(){
    this.route
    .params
    .subscribe(params => {
        this.plan = this.planningService.getPlanning(params.id);
        if(this.plan.steps == undefined){
          this.plan.steps = [];
        }
        this.loadFiles();
    });
  }
  
  private loadFiles(){
    let url = Configs.fileUrl + '?planid='+ this.plan._id;
    this.http.get(url).subscribe((res: Array<File>) => {
      console.log("files:");
      console.log(res);
      this.files = res;
    });
  }
}
