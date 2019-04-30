import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent } from '@angular/common/http';
import { MyCacheService } from '../services/my-cache.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

    constructor(private cache: MyCacheService){}

    //TODO: Insert code to verify whether a request is cachable

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        console.log("Entró a cache intercept")
        const cachedResponse = this.cache.get(req);
        return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next);
    }

    private sendRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("entro a cache sendRequest");
        return next.handle(req).pipe(
            tap(event => {
                if(event instanceof HttpResponse){
                    this.cache.put(req, event)
                }
            })
        )
    }
}
