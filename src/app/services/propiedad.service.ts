import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ValoresConfiguracion } from '../configuration/configuracion';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Definicion } from '../POJOs/Definicion';
import { map, tap, catchError } from 'rxjs/operators';
import { ClaseGlobal } from '../POJOs/ClaseGlobal';

@Injectable({
  providedIn: 'root'
})
export class PropiedadService {

  constructor(private http: HttpClient) { }

  obtenerParametrosPorClase(clase: string): Observable<Definicion[]>{
    let url = ValoresConfiguracion.uriPropiedadesClase;
    const httpOptions = {
      headers: new HttpHeaders({
        'IP':ValoresConfiguracion.headerIpDocumentos
      }),
      mimeType: 'multipart/form-data',
      data: 'form',
    }

    //Validar inyeccion de codigo
    let formData = new FormData();
    const body = "{\"clase\":[{\"clasedoc\":\""+clase.trim()+"\"}]}";
    formData.append("metadata", body);

    return this.http.post<ClaseGlobal>(url, formData, httpOptions)
    .pipe( map(d => d.clase[0].definiciones.definicion), 
      tap(d => console.log("obtener propiedades")), 
    catchError( this.handleError<any>('obtenerParametrosClase'), ) );
  }

  private handleError<T>(operacion, resultado?:T){
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operacion} failed: ${error.message}`);
      return of(resultado as T);
    }
  }
}
