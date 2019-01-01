import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { AuthService } from './auth.service'
import { Router } from '@angular/router';
import { Observable, of, empty } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from '../../environments/environment';
 
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
      .pipe(map((event: HttpEvent<any>) => {
        if(event instanceof HttpResponse){
          if(event.status == 401 || event.status == 403){
            this.router.navigate(['callback']);
          }
        }
        return event;
      }));
      // .catch((err: any, caught) => {
      //   if(err.status == 401 || err.status == 403){
      //     this.router.navigate(['callback']);
      //   }
      //   return Observable.throw(err);
      // });
  }

  private getAuthHeader(token: string) : string{
      return `Bearer ${token}`;
  }

}