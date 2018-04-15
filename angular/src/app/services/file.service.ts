import { Injectable } from '@angular/core';
//import { Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import { Configs } from '../configs';
import { File } from '../models/File';

@Injectable()
export class FileService {
    constructor(private http: HttpClient) { }

    upload(url, formData){
        return  this.http.post(url, formData);

    }
    loadFilesForPlan(url, planid){
        url = url + '?planid='+ planid;
        return this.http.get(url);
        /*.map( (files:Array<File>) => {
            let result = {};
            for(let i = 0; i < files.length; i ++){
                let file = files[i];
                if(""+file.link in result){
                    result[""+file.link].push(file);
                }
                else{
                    result[""+file.link] = [];
                    result[""+file.link].push(file);
                }
                
            }
            return result;
        });
        */
    }
    deleteFile(url, fileid){
        url += '?id=' + fileid;
        return this.http.delete(url);
    }
}