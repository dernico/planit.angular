import { Todo } from './Todo'

export class Step {
    public _id; 
    public title: String;
    public description: String;
    public todos: Array<Todo>;
    public location: {lat: String, lng: String};
    public days: number;
    public order: number;
}