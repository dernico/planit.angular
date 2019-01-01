import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { ITodoItem } from './itodo-item';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) { }

  public getTodos(){

    var promise = new Promise<ITodoItem[]>((resolve, reject) => {
      
      this.http.get(this.config.todosUrl())
        .subscribe((resp: ITodoItem[]) => {
          resolve(resp);
        }, 
        error => {
          reject(error);
        });
    });

    return promise;
  }

  public addTodoOrUpdate(item: ITodoItem){
    if(item.id){
      this.updateTodo(item);
    }else{
      return this.addTodo(item);
    }
  }

  public addTodo(item: ITodoItem){
    let promise = new Promise<ITodoItem[]>((resolve, reject) => {
      this.http.post(this.config.todosUrl(), item)
        .subscribe((resp: ITodoItem[]) => {
          resolve(resp);
        })
        err => {reject(err);}
    });
    return promise;
  }

  public updateTodo(item: ITodoItem){
    let promise = new Promise<ITodoItem[]>((resolve, reject) => {
      this.http.patch(this.config.todosUrl(), item)
        .subscribe((resp: ITodoItem[]) => {
          resolve(resp);
        })
        err => {reject(err);}
    });
    return promise;
  }
}
