import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  authTokenUrl(){
    return environment.baseUrl + '/oauth/token'
  }

  todosUrl(){
    return environment.baseUrl + '/todos'
  }
}
