import { Step } from './Step'
import { File } from './File'
import { Cost } from './Cost';
import { User } from './User';

export class Planning {
    public _id;
    public title : String;
    public startDate;
    public endDate;
    public comments: Array<String>;
    public steps: Array<Step>;
    public files: Array<File>;
    public costs: Array<Cost>;
    public loggedInUser: User;
    public users: Array<User>;
}