import { Component, OnInit, Input } from '@angular/core';
import { PlanningService } from '../../services/planning.service';
import { Step } from '../../models/Step';
import { Planning } from '../../models/Planing';
import { Todo } from '../../models/Todo';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
    selector: 'step-list',
    styleUrls: ['./step-list.component.css'],
    templateUrl: './step-list.component.html'
})
export class StepListComponent implements OnInit {

    @Input() googlemap;
    @Input() plan: Planning;
    @Input() step: Step;
    @Input() overview: boolean = false;
    
    private selectedSuggestion: Todo;

    constructor(
        private planningService: PlanningService
    ) { }

    ngOnInit() { }

    drop(event: CdkDragDrop<Step[]>) {
      moveItemInArray(this.step.todos, event.previousIndex, event.currentIndex);
      this.step.todos.forEach((t,i) => {
        t.order = i;
      });
      this.planningService.setPlanning(this.plan).then(p => this.plan = p);
    }

    addTodo() {
        var newTodo = new Todo();
        newTodo.title = this.selectedSuggestion.title;
        newTodo.description = this.selectedSuggestion.description;
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

      getTodosWithLocation(todos: Array<Todo>) {
        return todos.filter(item => { return item.location; });
      }
}
