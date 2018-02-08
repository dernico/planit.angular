import { Step } from './Step'
import { File } from './File'

export class Planning {
    public _id;
    public title : String;
    public startDate;
    public endDate;
    public comments: Array<String>;
    public steps: Array<Step>;
    public files: Array<File>;
}