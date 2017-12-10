import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '../../models/Planing';
import { PlanningService } from '../../services/planning.service';
import { Step } from '../../models/Step';
import { Todo } from '../../models/Todo';
import { PlaceSuggestion } from '../../models/PlaceSuggestion';
import { PlaceSearchResult } from '../../models/PlaceSearchResult';
import { Observable } from 'rxjs/Observable';
import { PlaceDetail } from '../../models/PlaceDetail';
import { Configs } from '../../configs';
import { OverviewComponent } from './overview/overview.component';

@Component({
  selector: 'app-planoverview',
  templateUrl: './planoverview.component.html',
  styleUrls: ['./planoverview.component.css']
})
export class PlanoverviewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  tabChanged(event){
    console.log(event);
  }
}
