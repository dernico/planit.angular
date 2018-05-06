import { Injectable } from '@angular/core';
//import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

import { Configs } from '../configs';
import { File } from '../models/File';

@Injectable()
export class FileService {
    constructor(private http: HttpClient) { }

    upload(url, formData) {
        return this.http.post(url, formData);

    }
    loadFilesForPlan(url, planid) {
        url = url + '?planid=' + planid;
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
    deleteFile(url, fileid) {
        url += '?id=' + fileid;
        return this.http.delete(url);
    }

    downloadFile(file: File) {
        const headers = new HttpHeaders();
        headers.append('Accept', 'text/plain');
        this.http.get(file.url, { headers: headers, responseType: 'blob' }).subscribe(resp => {
            //const blob = new Blob([resp], { type: 'application/octet-stream' });
            const blob = new Blob([resp], { type: 'application/pdf' });
            //saveAs(blob, file.filename + "." + file.extension);
            this.showFile(blob, file.filename);
        });
    }

    private showFile(newBlob, filename) {
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        //var newBlob = new Blob([blob], {type: "application/pdf"})

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        // var reader = new FileReader();
        // //var out = new Blob([this.response], {type: 'application/pdf'});
        // reader.onload = function(e){
        //   window.location.href = reader.result;
        // }
        // reader.readAsDataURL(newBlob);
        var url = URL.createObjectURL(newBlob);
        window.open(url, '_self');
        return;

        // For other browsers: 
        // Create a link pointing to the ObjectURL containing the blob.

        // const data = window.URL.createObjectURL(newBlob);
        // var link = document.createElement('a');
        // link.href = data;
        // link.download=filename;
        // link.click();
        // setTimeout(function(){
        //   // For Firefox it is necessary to delay revoking the ObjectURL
        //   console.log("show file calling 2");
        //   window.URL.revokeObjectURL(data)
        // , 100});
    }
}