import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ValoresConfiguracion } from '../configuration/configuracion';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Definicion } from '../POJOs/Definicion';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { ClaseGlobal } from '../POJOs/ClaseGlobal';
import { PropiedadSelected } from '../POJOs/PropiedadSelected';
import { Columna } from '../POJOs/Columna';
import { HttpEvent, HttpRequest, HttpResponse, HttpInterceptor, HttpHandler } from '@angular/common/http';

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
    .pipe( retry(3), map(d => d.clase[0].definiciones.definicion), 
      tap(d => console.log("obtener propiedades")), 
    catchError( this.handleError<any>('obtenerParametrosClase'), ) );
  }

  private handleError<T>(operacion, resultado?:T){
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operacion} failed: ${error.message}`);
      return Observable.throw(error);
    }
  }

  construirQuery(propiedadesSeleccionadas: PropiedadSelected[]): string{
    let nuevaQuery = "?";
    //&& i < this.propiedadesSeleccionadas.length-1
    for(let i=0; i< propiedadesSeleccionadas.length; i++){
      if(propiedadesSeleccionadas[i].valorCadena == "" || !propiedadesSeleccionadas[i].propiedad.nombreSimbolico){
        return undefined;
      }
      if(i > 0 ){
        nuevaQuery += '&operador=' + 'AND'+ "&";
      }
      nuevaQuery += 'clave='+propiedadesSeleccionadas[i].propiedad.nombreSimbolico + 
      '&'+'valor='+propiedadesSeleccionadas[i].valorCadena;
    }
    return nuevaQuery;
  }

  construirQueryUrl(criteriosInputStr: string, operadoresInputStr: string): string{
    let criteriosArray = criteriosInputStr.split(",");
    let operadoresArray = operadoresInputStr.split(',');
    
    let nuevaQuery = "?";

    for (let i = 0; i < criteriosArray.length; i++) {
      const element = criteriosArray[i].split(";");
      const llave = element[0];
      const valor = element[1];
      if(i > 0 && i < criteriosArray.length-1){
        nuevaQuery += '&operador=' + operadoresArray[i-1]+ "&";
      }
      nuevaQuery += 'clave='+llave+'&'+'valor='+valor;

    }

    return nuevaQuery;
  }

  construirColumnas(columnasInputStr: string): Columna[]{
    let columnasArray = columnasInputStr.split(",");
    let nuevasColumnasArray = columnasArray.map( c => 
      {
        const names = c.split(";");
        return new Columna(names[0],names[1]);
      })

    return nuevasColumnasArray;
  }
}
