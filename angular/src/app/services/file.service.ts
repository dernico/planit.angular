import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Configs } from '../configs';

@Injectable()
export class FileService {
    constructor(private http: HttpClient) { }

    upload(files, parameters){
        let headers = new Headers();
        let options = new RequestOptions({ headers: headers });
        options.params = parameters;
        return  this.http.post(Configs.fileuploadUrl, files);
                 //.subscribe(response => response);
                 //.catch(error => Observable.throw(error));

    }
    getImages(){
        return this.http.get(Configs.fileGetImagesUrl);
                   //.map(response => response.json())
                   //.catch(error => Observable.throw(error));
    }
}