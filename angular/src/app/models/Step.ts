import { Todo } from './Todo'
import { Location } from './Location';
import { File } from './File';
import { Distance } from './Distance';

export class Step {
    constructor(){
        this.todos = [];
    }
    public _id; 
    public title: String;
    public description: String;
    public todos: Array<Todo>;
    public files: Array<File>;
    public location: Location;
    public days: number;
    public order: number;
    public photoUrl: string;
    public distanceNextStep: Distance;
}