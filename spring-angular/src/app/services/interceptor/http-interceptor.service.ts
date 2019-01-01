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
          if(event.status == 401 || event.status == 403){
            this.router.navigate(['login']);
          }
        }
        return event;
      }));
  }

  private getAuthHeader(token: string) : string{
      return `Bearer ${token}`;
  }
}
