import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DocumentoGlobal } from '../Models/DocumentoGlobal';
import { ValoresConfiguracion } from '../configuration/configuracion';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators'
import { Documento } from '../Models/Documento';
import { PropiedadSelected } from '../Models/PropiedadSelected';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  constructor(
    private http: HttpClient
  ) { }

  private valoresConfiguracion = ValoresConfiguracion;

  //TODO: Manejo de log
  obtenerDocumentos(criterios: PropiedadSelected[]): Observable<DocumentoGlobal>{
    //TODO: Esta función debe modificarse para que haga la consulta con varios criterios
    //Por ahora se pone la query, hasta no saber el formato
    let queryTxt = this.construirQuery(criterios);
    let urlQuery = `${this.valoresConfiguracion.uriDocumentos}?${queryTxt}`;
    
    const httpOptions = {
      headers: new HttpHeaders({
        'IP': this.valoresConfiguracion.headerIpDocumentos
      })
    };
    console.log("obtencion documentos");
    return this.http.get<DocumentoGlobal>(urlQuery, httpOptions)
    .pipe( tap( d => console.log("obtencion de documentos") ),
    catchError( this.handleError<any>('obtenerDocumentos'))
    );
  }

  private construirQuery(propiedadesSeleccionadas: PropiedadSelected[]): string{
    let nuevaQuery = "";
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
      return Observable.throw(error);
    }
  }

  obtenerValorPropiedad(doc:Documento, prop:string): string {
    let valorEncontrado = "...";
    let i = 0;
    let encontro = false;
    while( i < doc.propiedades.propiedad.length && !encontro){
        if(doc.propiedades.propiedad[i].clave.trim() == prop.trim()){
            valorEncontrado = doc.propiedades.propiedad[i].valor;
            encontro = true;
        }
        ++i;
    }
    if(valorEncontrado == ""){
      valorEncontrado = "...";
    }
    return valorEncontrado;
  }

  obtenerNombreArchivo(texto: string): string {
    let cadena = texto.split(";")[1].split('"')[1].trim();
    return cadena;
  }
}
