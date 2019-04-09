import { Component, OnInit } from '@angular/core';
import { Consulta } from 'src/app/POJOs/Consulta';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { PropiedadService } from 'src/app/services/propiedad.service';
import { Definicion } from 'src/app/POJOs/Definicion';
import { Propiedad } from 'src/app/POJOs/Propiedad';

@Component({
  selector: 'app-definicion-parametros',
  templateUrl: './definicion-parametros.component.html',
  styleUrls: ['./definicion-parametros.component.css']
})
export class DefinicionParametrosComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private propiedadService: PropiedadService
  ) { }
  
  esUrl: boolean;
  consulta: Consulta;
  selectedCampo: string;
  propiedadesCampo: Definicion[] = [];
  esFecha: boolean = true;
  fechaTemp: Date = new Date;

  propiedadNueva: PropiedadSelected = new PropiedadSelected;
  
  propiedadesSeleccionadas: PropiedadSelected[] = [];

  camposSelector: string[] = [
    "CD_DocumentoConocimientoCliente",
    "CD_Poliza"
  ]

  ngOnInit() {
    this.propiedadNueva.valor ="";
    this.obtenerInputs();
  }

  //Eventos
  //Aqui falta lo de la condicion logica, y tener en cuenta mandar
  //nombres visuales y simbolicos, solo se mandan simbolicos
  buscar(){
    /*this.consulta = new Consulta(
      ["TipoCliente","IsCurrentVersion","Nombredeldocumento","NumeroIdentificacionCliente",
  "IsReserved"],
  "?clave=NombreUsuario&valor=IBMpruebas"
    )*/
    let nuevasColumnas = this.propiedadesCampo.map( p => p.nombreSimbolico).slice(0,5);
    let nuevaQuery = "?";

    for(let i=0; i< this.propiedadesSeleccionadas.length; i++){
      if(i > 0 && i < this.propiedadesSeleccionadas.length-1){
        nuevaQuery += '&operador=' + 'AND'+ "&";
      }
      nuevaQuery += 'clave='+this.propiedadesSeleccionadas[i].propiedad + 
      '&'+'valor='+this.propiedadesSeleccionadas[i].valor;
    }
    this.consulta = null;
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

    this.esUrl = true;
    this.consulta = new Consulta(columnasArray, nuevaQuery);

  }

}

export class PropiedadSelected {
  
    public propiedad: string;
    public condicion: string;
    public valor: string;
    public valorDate: Date;
    public tipo: string;
}
