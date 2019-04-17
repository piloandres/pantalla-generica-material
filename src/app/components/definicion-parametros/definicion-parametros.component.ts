import { Component, OnInit } from '@angular/core';
import { Consulta } from 'src/app/POJOs/Consulta';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { Definicion } from 'src/app/POJOs/Definicion';
import { Propiedad } from 'src/app/POJOs/Propiedad';
import { Columna } from 'src/app/POJOs/Columna';
import { PropiedadSelected } from 'src/app/POJOs/PropiedadSelected';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { OpcionLista } from 'src/app/POJOs/OpcionLista';

@Component({
  selector: 'app-definicion-parametros',
  templateUrl: './definicion-parametros.component.html',
  styleUrls: ['./definicion-parametros.component.css']
})
export class DefinicionParametrosComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private propiedadService: PropiedadService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'x-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/cancel.svg'));
   }
  
  esUrl: boolean;
  consulta: Consulta;
  selectedCampo: string;
  camposDesabilitado: boolean = false;

  propiedadesCampo: Definicion[] = [];

  esFecha: boolean = true;
  fechaTemp: Date = new Date;

  propiedadNueva: PropiedadSelected = new PropiedadSelected;
  propiedadesSeleccionadas: PropiedadSelected[] = [];

  camposSelector: string[] = [
    "CD_DocumentoConocimientoCliente",
    "CD_Poliza"
  ]

  columnasAMostrar: Columna[] = [
    new Columna("DocumentTitle", "Título del documento"),
    new Columna("FechaexpedicionDocumento", "Fecha de expedición del documento"),
    new Columna("NombreUsuario", "Nombre de Usuario"),
    new Columna("NoCaso", "No. Caso"),
    new Columna("NumeroIdentificacionCliente", "Número de Identificación de cliente"),
    new Columna("TipoDocumentoIdCliente", "Tipo de documento de identificacion cliente"),
    new Columna("Nombredeldocumento", "Nombre del Documento"),
    new Columna("MimeType", "Tipo de MIME")
  ]

  ngOnInit() {
    this.propiedadNueva.valor ="";
    this.obtenerInputs();
  }

  //Eventos
  //Aqui falta lo de la condicion logica
  buscar(){
    /*this.consulta = new Consulta(
      ["TipoCliente","IsCurrentVersion","Nombredeldocumento","NumeroIdentificacionCliente",
  "IsReserved"],
  "?clave=NombreUsuario&valor=IBMpruebas"
    )*/
    let nuevasColumnas = this.columnasAMostrar;/*this.propiedadesCampo.map( p => 
      {
        return new Columna(p.nombreSimbolico, p.nombreVisual)
      });*/
    //let nuevasColumnas = this.propiedadesCampo.map( p => p.nombreSimbolico).slice(0,5);
    let nuevaQuery = "?";
    //&& i < this.propiedadesSeleccionadas.length-1
    for(let i=0; i< this.propiedadesSeleccionadas.length; i++){
      if(i > 0 ){
        nuevaQuery += '&operador=' + 'AND'+ "&";
      }
      nuevaQuery += 'clave='+this.propiedadesSeleccionadas[i].propiedad.nombreSimbolico + 
      '&'+'valor='+this.propiedadesSeleccionadas[i].valorCadena;
    }
    this.camposDesabilitado = true;
    //this.consulta = null;
    console.log(nuevaQuery);
    this.consulta = new Consulta(nuevasColumnas, nuevaQuery);
  }

  agregarPropiedad(){
    console.log(this.propiedadNueva);
    this.propiedadesSeleccionadas.push(this.propiedadNueva);
    this.propiedadNueva = new PropiedadSelected;
    this.propiedadNueva.valor = "";
  }

  actualizarParametros(){
    this.propiedadService.obtenerParametrosPorClase(this.selectedCampo)
    .subscribe( p => 
      {
        this.propiedadesSeleccionadas = [];
        this.propiedadesCampo = p;
        this.propiedadNueva.valor ="";
      }
      );
  }

  //Private
  //TODO: Faltan validaciones y delegarlo a un service
  obtenerInputs(){

    if(!this.route.snapshot.queryParamMap.has('columnas')
      || !this.route.snapshot.queryParamMap.has('criterios')
      || !this.route.snapshot.queryParamMap.has('operadores'))
      {
        this.esUrl = false;
        return;
      }
    let columnasInputStr = this.route.snapshot.queryParamMap.get('columnas');
    let criteriosInputStr = this.route.snapshot.queryParamMap.get('criterios');
    let operadoresInputStr = this.route.snapshot.queryParamMap.get('operadores');

    
    let columnasArray = columnasInputStr.split(",");
    let nuevasColumnasArray = columnasArray.map( c => 
      {
        const names = c.split(";");
        return new Columna(names[0],names[1]);
      })
    //Validar input
    //Ahora los criterios, falta validar
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

    //Toca cambiar
    this.esUrl = true;
    this.consulta = new Consulta(nuevasColumnasArray, nuevaQuery);

  }

  habilitarCampos(){
    this.camposDesabilitado = false;
  }

  eliminarPorpSeleccionada(i:number){
    this.propiedadesSeleccionadas.splice(i,1);
  }

  limpiarInput(propiedadActual: PropiedadSelected){
    console.log("entro a limpiar input");
    propiedadActual.valor = "";
    propiedadActual.valorDate = new Date;
    propiedadActual.valorNumeric = undefined;
    propiedadActual.valorBoolean = false;
  }

}


