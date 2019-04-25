import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent } from '@angular/common/http';
import { MyCacheService } from '../services/my-cache.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

    constructor(private cache: MyCacheService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        const cacheResponse = this.cache.get(req);
        return cacheResponse ? of(cacheResponse) : this.sendRequest(req, next);
    }

    private sendRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(event => {
                if(event instanceof HttpResponse){
                    this.cache.put(req, event)
                }
            })
        )
    }
}
