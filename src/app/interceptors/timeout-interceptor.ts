import { Injectable, Inject, InjectionToken } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  constructor(@Inject(DEFAULT_TIMEOUT) protected defaultTimeout) {}
  //Falta variar el timeout dependiendo de la solicitud
  intercept(req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    const timeoutValue = this.defaultTimeout;

    return next.handle(req).pipe(timeout(300000));
  }
}