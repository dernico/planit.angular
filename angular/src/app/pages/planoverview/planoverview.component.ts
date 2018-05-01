import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Planning } from '../../models/Planing';
import { OverviewComponent } from './overview/overview.component';
import { ChangeDetectorRef } from '@angular/core';
import { PlanningService } from '../../services/planning.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-planoverview',
  templateUrl: './planoverview.component.html',
  styleUrls: ['./planoverview.component.css']
})
export class PlanoverviewComponent implements OnInit {

  public plan: Planning;

  constructor(private changeDetectRef: ChangeDetectorRef, 
    private planningService: PlanningService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route
    .params
    .subscribe(params => {
        this.plan = this.planningService.getPlanning(params.id);
    });
  }

  backToPlannings(){
    this.router.navigate(['plannings']);
  }

  tabChanged(event) {
    console.log(event);
  }
  ngAfterViewChecked() {
    //check later: this fixes the error -> Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value:
    this.changeDetectRef.detectChanges();
  }
}
