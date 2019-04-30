import { Component, OnInit } from '@angular/core';
import { Consulta } from 'src/app/Models/Consulta';
import { ActivatedRoute } from '@angular/router';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { Definicion } from 'src/app/Models/Definicion';
import { Columna } from 'src/app/Models/Columna';
import { PropiedadSelected } from 'src/app/Models/PropiedadSelected';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';
import { StyleSingletonService } from 'src/app/services/style-singleton.service';
import { DialogError } from '../error-dialog/dialog-error';
import { ClaseVista } from 'src/app/Models/ClaseVista';

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
    sanitizer: DomSanitizer,
    public dialogError: MatDialog,
    public styleSingletonService: StyleSingletonService
  ) {
    iconRegistry.addSvgIcon(
      'x-icon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/cancel.svg'));
   }
  
  esUrl: boolean;
  consulta: Consulta;
  selectedCampo: ClaseVista;
  camposDesabilitado: boolean = false;

  propiedadesCampo: Definicion[] = [];

  esFecha: boolean = true;
  fechaTemp: Date = new Date;

  propiedadNueva: PropiedadSelected = new PropiedadSelected;
  propiedadesSeleccionadas: PropiedadSelected[] = [];

  camposSelector: ClaseVista[] = [
    new ClaseVista("CD_DocumentoIdentificacionCliente","Documento de Identificacion del cliente"),
    new ClaseVista("CD_DocumentoConocimientoCliente","Conocimiento Cliente"),
    new ClaseVista("CD_Acta","Acta"),
    new ClaseVista("CD_InformesTecnicos","Informes Tecnicos"),
    new ClaseVista("CD_InformacionMedica","Informacion Medica"),
    new ClaseVista("CD_AnexosPoliza","Anexos a la Poliza"),
    new ClaseVista("CD_SolicitudesModificanNegocio","Solicitudes modifican negocio"),
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
  ];

  ngOnInit() {
    this.styleSingletonService.backgroundColor = "#ffeb3b";
    this.propiedadNueva.valor ="";
    this.obtenerInputs();
  }

  //Eventos
  //Aqui falta lo de la condicion logica
  buscar(){
    //this.propiedadesSeleccionadas.map(p => console.log(p));
    let nuevasColumnas = this.columnasAMostrar;

    let propiedadTaxonomia = new PropiedadSelected;
    propiedadTaxonomia.propiedad.tipo = "STRING";
    propiedadTaxonomia.valor = this.selectedCampo.nombreSimbolico;
    propiedadTaxonomia.propiedad.nombreSimbolico = "taxonomia";
    propiedadTaxonomia.propiedad.nombreVisual = "taxonomia";
    let propiedadesConTaxonomia = this.propiedadesSeleccionadas.slice();
    propiedadesConTaxonomia.push(propiedadTaxonomia);

    let nuevaQuery = this.propiedadService.construirQuery(propiedadesConTaxonomia);
    if(nuevaQuery != undefined){
      this.camposDesabilitado = true;
      console.log(nuevaQuery);
      this.consulta = new Consulta(nuevasColumnas, nuevaQuery);
    }else{
      this.mostrarError("Campos Incompletos", "Complete los datos");
    }
    
  }

  agregarPropiedad(){
    this.propiedadesSeleccionadas.push(this.propiedadNueva);
    this.propiedadNueva = new PropiedadSelected;
    this.propiedadNueva.valor = "";
  }

  actualizarParametros(){
    let selectedCampoTemp = this.selectedCampo.nombreSimbolico;
    this.propiedadesCampo = [];
    this.propiedadesSeleccionadas = [];
    this.propiedadNueva.valor ="";
    this.propiedadNueva = new PropiedadSelected;
    this.consulta = undefined;
    this.propiedadService.obtenerParametrosPorClase(selectedCampoTemp)
    .subscribe( p => 
      {
        this.propiedadesCampo = p;
      },
      error => {
        this.mostrarError("Error al cargar propiedades", "No se han obtenido las propiedades");
        //console.log("Aqui se debe mostrar el error en la interfaz de usuario");
      }
      );
  }

  //Private
  //TODO: Faltan validaciones
  obtenerInputs(){

    if(!this.route.snapshot.queryParamMap.has('columnas')
      || !this.route.snapshot.queryParamMap.has('criterios')
      || !this.route.snapshot.queryParamMap.has('operadores'))
      {
        this.esUrl = false;
        //this.mostrarError("Faltan parametros", "Faltan campos en la url (columnas, criterios, operadores)");
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
    propiedadActual.valor = "";
    propiedadActual.valorDate = new Date;
    propiedadActual.valorNumeric = undefined;
    propiedadActual.valorBoolean = false;
    propiedadActual.valorOpcion = "";
  }

  mostrarError(title: string, content: string){
    const myDialogError = this.dialogError.open(DialogError, {
      width: '30%',
      data: {title: title, content: content}
    })

  }

  obtenerBGColor(): string{
    return this.styleSingletonService.getBackGroundColor();
  }

}


