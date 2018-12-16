import { Component, OnInit, Input } from '@angular/core';
import { FileService } from '../../services/file.service';
import { File } from '../../models/File';
import { PlanningService } from '../../services/planning.service';
import { Step } from '../../models/Step';
import { Planning } from '../../models/Planing';
import { HttpClient } from '@angular/common/http';
import { Configs } from '../../configs';
import { Todo } from '../../models/Todo';

@Component({
    selector: 'step-list',
    styleUrls: ['./step-list.component.css'],
    templateUrl: './step-list.component.html'
})
export class StepListComponent implements OnInit {

    @Input() plan: Planning;
    @Input() step: Step;

    constructor(
        private http: HttpClient,
        private fileService: FileService,
        private planningService: PlanningService
    ) { }

    ngOnInit() { }

    addTodo(todoText) {
        var newTodo = new Todo();
        newTodo.title = todoText;

        this.step.todos.push(newTodo);
        this.planningService.setPlanning(this.plan);
      }
    
      removeTodo(index) {
        this.step.todos.splice(index, 1);
        this.planningService.setPlanning(this.plan);
      }

}
