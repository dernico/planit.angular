import { Todo } from './Todo'
import { Location } from './Location';

export class Step {
    constructor(){
        this.todos = [];
    }
    public _id; 
    public title: String;
    public description: String;
    public todos: Array<Todo>;
    public location: Location;
    public days: number;
    public order: number;
    public photoUrl: string;
}