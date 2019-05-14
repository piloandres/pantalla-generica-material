import { Injectable } from '@angular/core';
import { ValoresConfiguracion } from '../configuration/configuracion';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/Usuario';
import { catchError, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(
    private http: HttpClient
  ) { }

  autenticarUsuario(user: string): Observable<Usuario> {

    let url = `${ValoresConfiguracion.uriAutenticacion}/${user}`;

    return this.http.get<Usuario>(url).pipe( tap(a => console.log("Autenticacion usuario"),
    catchError( this.handleError<any>('autenticar'))
    ) )
  }

  private handleError<T>(operacion, resultado?:T){
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operacion} failed: ${error.message}`);
      return Observable.throw(error);
    }
  }
}
