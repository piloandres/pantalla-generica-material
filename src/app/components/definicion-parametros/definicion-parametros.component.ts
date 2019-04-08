import { Component, OnInit } from '@angular/core';
import { Consulta } from 'src/app/POJOs/Consulta';

@Component({
  selector: 'app-definicion-parametros',
  templateUrl: './definicion-parametros.component.html',
  styleUrls: ['./definicion-parametros.component.css']
})
export class DefinicionParametrosComponent implements OnInit {

  constructor() { }

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
  }

  buscar(){
    this.consulta = new Consulta(
      ["TipoCliente","IsCurrentVersion","Nombredeldocumento","NumeroIdentificacionCliente",
  "IsReserved"],
  "?clave=NombreUsuario&valor=IBMpruebas"
    )
  }

}

export class PropiedadSelected {
  constructor(
    public propiedad: string,
    public condicion: string,
    public valor: string
    ){}
}
