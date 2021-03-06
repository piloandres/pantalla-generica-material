import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyCacheService {
  //TODO: Aun se puede mejorar el cache, poniendo un limite de items, definiendo un criterio
  //de prioridad sobre que elementso deben estar en el cache
  constructor() { }
  deadLine = 300000;
  cache = new Map<string, any>();

  get(req: HttpRequest<any>): HttpResponse<any> | undefined {
      const myKey = req.urlWithParams + req.method;
      const myValue = this.cache.get(myKey);

      if(!myValue){
          return undefined;
      }

      const isTimeOut = Date.now() > ( myValue.lastPut + this.deadLine );
      if(isTimeOut){
          this.cache.delete(myKey);
          return undefined;
      }

      return myValue.response;
  }

  put(req: HttpRequest<any>, res: HttpResponse<any>): void {
      const myKey = req.urlWithParams + req.method;
      const newValue = {
          response: res,
          lastPut: Date.now()
      }
      this.cache.set(myKey, newValue);
  }

}
