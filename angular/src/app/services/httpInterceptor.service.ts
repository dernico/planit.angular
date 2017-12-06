import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { AuthService } from './auth.service'
 
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}
 
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    const authHeader = this.getAuthHeader(token);
    // Clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('Authorization', authHeader)});
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }

  private getAuthHeader(token: string) : string{
      return `Bearer ${token}`;
  }

}