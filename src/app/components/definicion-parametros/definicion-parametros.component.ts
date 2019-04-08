import { Component, OnInit } from '@angular/core';
import { Consulta } from 'src/app/POJOs/Consulta';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-definicion-parametros',
  templateUrl: './definicion-parametros.component.html',
  styleUrls: ['./definicion-parametros.component.css']
})
export class DefinicionParametrosComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }
  
  esUrl: boolean;
  consulta: Consulta;
  selectedCampo: string;
  propiedadesCampo: string[] = ["id","nombre", "tipo"];
  propiedadesSeleccionadas: PropiedadSelected[] = [
    new PropiedadSelected("id","igual","{123213}"),
    new PropiedadSelected("nombre","igual","{123213}"),
    new PropiedadSelected("tipo","igual","{123213}")
  ];

  camposSelector: string[] = [
    "CD_DocumentoConocimientoCliente",
    "CD_DocumentoConocimientoCliente",
    "CD_DocumentoConocimientoCliente"
  ]

  ngOnInit() {
    this.obtenerInputs();
  }

  buscar(){
    this.consulta = new Consulta(
      ["TipoCliente","IsCurrentVersion","Nombredeldocumento","NumeroIdentificacionCliente",
  "IsReserved"],
  "?clave=NombreUsuario&valor=IBMpruebas"
    )
  }

  //Private
  obtenerInputs(){
    if(!this.route.snapshot.queryParamMap.has('columnas')
      || !this.route.snapshot.queryParamMap.has('criterios')
      || !this.route.snapshot.queryParamMap.has('operadores'))
      {
        this.esUrl = false;
        return;
      }
    let columnasInputStr = this.route.snapshot.queryParamMap.get('columnas');
    //console.log(columnasInputStr);
    let criteriosInputStr = this.route.snapshot.queryParamMap.get('criterios');
    //console.log(criteriosInputStr);
    let operadoresInputStr = this.route.snapshot.queryParamMap.get('operadores');

    
    let columnasArray = columnasInputStr.split(",");
    //Validar input
    //this.consulta.parametros = columnasArray;
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
    //console.log(nuevaQuery);
    this.consulta = new Consulta(columnasArray, nuevaQuery);

  }

}

export class PropiedadSelected {
  constructor(
    public propiedad: string,
    public condicion: string,
    public valor: string
    ){}
}
