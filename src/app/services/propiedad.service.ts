import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ValoresConfiguracion } from '../configuration/configuracion';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Definicion } from '../Models/Definicion';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { ClaseGlobal } from '../Models/ClaseGlobal';
import { PropiedadSelected } from '../Models/PropiedadSelected';
import { Columna } from '../Models/Columna';

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

  construirCriterios(criteriosInputStr: string): PropiedadSelected[]{
    let criteriosResultado = []
    let criteriosArray = criteriosInputStr.split(",");

    for (let i = 0; i < criteriosArray.length; i++) {
      const element = criteriosArray[i].split(";");
      const llave = element[0];
      const valor = element[1];
      let nuevaPropiedad = new Definicion;

      nuevaPropiedad = { ...nuevaPropiedad, 
        tipo: "STRING",
        nombreSimbolico: llave,
        nombreVisual: llave 
      }

      let nuevoCriterio = new PropiedadSelected;
      nuevoCriterio.propiedad = nuevaPropiedad;
      nuevoCriterio.valor = valor;

      criteriosResultado = [...criteriosResultado, nuevoCriterio];

    }

    return criteriosResultado;
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
