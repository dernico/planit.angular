import { Todo } from './Todo'

export class Step {
    constructor(){
        this.todos = [];
    }
    public _id; 
    public title: String;
    public description: String;
    public todos: Array<Todo>;
    public location: {lat: number, lng: number};
    public days: number;
    public order: number;
}