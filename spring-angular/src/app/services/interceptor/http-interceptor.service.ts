import { Injectable } from '@angular/core';
import { SessionService } from '../session/session.service';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of, empty } from "rxjs";
import { catchError, map } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private session: SessionService, private router: Router) {}
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.session.getAccessToken();
    const authHeader = this.getAuthHeader(token);
    // Clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('Authorization', authHeader)});
    // Pass on the cloned request instead of the original request.
    return next
      .handle(authReq)
      .pipe(map((event: HttpEvent<any>) => {
        if(event instanceof HttpResponse){
          console.log('interceptor error: ', event);
          if(event.status == 401 || event.status == 403){
            this.router.navigate(['login']);
          }
        }
        return event;
      }));
      // .toPromise()
      // .catch(reason => {
      //   if(reason.status == 401 || reason.status == 403){
      //     this.router.navigate(['callback']);
      //   }
      //   return Observable.throw(reason);
      // });
      // .pipe(catchError(err => of(HttpErrorResponse)), map(err => {
      //   return Observable.;
      // });
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
