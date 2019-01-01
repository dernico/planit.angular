import { Component, OnInit } from '@angular/core';
import { TodoService } from 'src/app/services/todo/todo.service';
import { ITodoItem } from 'src/app/services/todo/itodo-item';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css']
})
export class TodolistComponent implements OnInit {

  public todos: ITodoItem[];
  public newTodo: ITodoItem = {description: "", done: false, title: "", id: null};

  constructor(
    private todoService: TodoService
  ) { }

  ngOnInit() {
    
    this.todoService
      .getTodos()
      .then((res: ITodoItem[]) => {
        this.todos = res;
      });
  }

  public add(){
    this.todoService
      .addTodoOrUpdate(this.newTodo)
      .then((res: ITodoItem[]) => {
        this.todos = res;
      })
  }

  public doneChange(event, item){
    this.todoService
      .updateTodo(item)
      .then(resp => {
        this.todos = resp;
      });
  }

}
