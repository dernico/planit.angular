import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
    private static accessToken: string;

    public setAccessToken(token: string){
        sessionStorage.setItem('access_token',token);
    }

    public getAccessToken(){
        var token = sessionStorage.getItem('access_token');
        return token;
    }

    public logout(){
        sessionStorage.removeItem('access_token');
    }
}