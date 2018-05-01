import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { AuthService } from './auth.service'
import { Router } from '@angular/router';
 
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    const authHeader = this.getAuthHeader(token);
    // Clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('Authorization', authHeader)});
    // Pass on the cloned request instead of the original request.
    return next
      .handle(authReq)
      .catch((err: any, caught) => {
        if(err.status == 401 || err.status == 403){
          this.router.navigate(['callback'])
        }
        return Observable.throw(err);
      });
  }

  private getAuthHeader(token: string) : string{
      return `Bearer ${token}`;
  }

}