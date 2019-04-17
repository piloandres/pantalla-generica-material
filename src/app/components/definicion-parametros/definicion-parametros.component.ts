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
    let nuevasColumnas = this.columnasAMostrar;
    let nuevaQuery = this.propiedadService.construirQuery(this.propiedadesSeleccionadas);
    this.camposDesabilitado = true;
    //console.log(nuevaQuery);
    this.consulta = new Consulta(nuevasColumnas, nuevaQuery);
  }

  agregarPropiedad(){
    //console.log(this.propiedadNueva);
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
      },
      error => {
        console.log("Aqui se debe mostrar el error en la interfaz de usuario")
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

    let nuevasColumnasArray = this.propiedadService.construirColumnas(columnasInputStr);
    //Validar input
    //Ahora los criterios, falta validar
    let nuevaQuery = this.propiedadService.construirQueryUrl(criteriosInputStr, operadoresInputStr);

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
    propiedadActual.valorOpcion = "";
  }

}


