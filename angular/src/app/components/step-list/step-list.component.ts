import { Component, OnInit, Input } from '@angular/core';
import { FileService } from '../../services/file.service';
import { PlanningService } from '../../services/planning.service';
import { Step } from '../../models/Step';
import { Planning } from '../../models/Planing';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../../models/Todo';
import { PlaceSuggestion } from '../../models/PlaceSuggestion';
import { PlaceDetail } from '../../models/PlaceDetail';

@Component({
    selector: 'step-list',
    styleUrls: ['./step-list.component.css'],
    templateUrl: './step-list.component.html'
})
export class StepListComponent implements OnInit {

    @Input() plan: Planning;
    @Input() step: Step;
    @Input() overview: boolean = false;

    private selectedSuggestion: Todo;

    constructor(
        private http: HttpClient,
        private fileService: FileService,
        private planningService: PlanningService
    ) { }

    ngOnInit() { }

    addTodo(todoText) {
        var newTodo = new Todo();
        newTodo.title = this.selectedSuggestion.title;
        newTodo.location = this.selectedSuggestion.location;
        this.step.todos.push(newTodo);
        this.planningService.setPlanning(this.plan);
      }
    
      removeTodo(index) {
        this.step.todos.splice(index, 1);
        this.planningService.setPlanning(this.plan);
      }

      placesSelectionChanged(suggest: Todo) {
        this.selectedSuggestion = suggest;
      }

}
