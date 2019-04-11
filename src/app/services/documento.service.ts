import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DocumentoGlobal } from '../POJOs/DocumentoGlobal';
import { ValoresConfiguracion } from '../configuration/configuracion';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  constructor(
    private http: HttpClient
  ) { }

  private valoresConfiguracion = ValoresConfiguracion;

  //TODO: Manejo de log
  obtenerDocumentos(queryTxt: string): Observable<DocumentoGlobal>{
    //TODO: Esta función debe modificarse para que haga la consulta con varios criterios
    //Por ahora se pone la query, hasta no saber el formato
    let urlQuery = (this.valoresConfiguracion.uriDocumentos 
      + queryTxt);

      //urlQuery = "http://10.1.3.68:9081/SBServiciosFilenetREST/rest/servicios-documentales/documentos?clave=NombreUsuario&valor=IBMpruebas";
    
    const httpOptions = {
      headers: new HttpHeaders({
        'IP': this.valoresConfiguracion.headerIpDocumentos
      })
    };
    console.log("obtencion documentos");
    return this.http.get<DocumentoGlobal>(urlQuery, httpOptions)
    .pipe( tap( d => console.log("obtencion de documentos") ),
    catchError( this.handleError<DocumentoGlobal>('obtenerDocumentos'))
    );
  }

  obtenerArchivoPorDocumento(id: string): Observable<any>{
    let url = ValoresConfiguracion.uriArchivosClase;
    const httpOptions = {
      observe: 'response',
      headers: new HttpHeaders(
        {
        'IP':ValoresConfiguracion.headerIpDocumentos
        }
        )
    }

    return this.http.get(`${url}/${id}`,
    {
      observe: 'response', 
      headers: new HttpHeaders({'IP':ValoresConfiguracion.headerIpDocumentos}),
      responseType: 'arraybuffer'
    }).pipe( 
    catchError(this.handleError<any>('Obtener archivo documento')) ) ;
  }

  

  private handleError<T>(operacion, resultado?:T){
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operacion} failed: ${error.message}`);
      return of(resultado as T);
    }
  }
}
