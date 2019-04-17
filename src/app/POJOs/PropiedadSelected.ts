import { Definicion } from './Definicion';
import { DatePipe } from '@angular/common' ;

export class PropiedadSelected {

    constructor(){
      this.propiedad = new Definicion;
      this.valorDate = new Date;
      this.datePipe = new DatePipe('en-US');
    }
  
      public propiedad: Definicion;
      public condicion: string;
      public valor: string;
      public valorDate: Date;
      public valorNumeric: number;
      public valorBoolean: boolean;
      public valorOpcion: string;
      public tipo: string;
      public datePipe: DatePipe;
  
      get tipoInput(){
        let tipoActual = this.propiedad.tipo;
        if(tipoActual == "STRING"){
          return "text";
        }else if(tipoActual == "DATE"){
          return "date";
        }else if (tipoActual == "LONG"){
          return "number";
        }else if (tipoActual == "BOOL"){
          return "checkbox";
        }else if( tipoActual == "LISTA"){
          return "select"
        }
        return "text";
      }
  
      get valorCadena(){
        let tipoActual = this.propiedad.tipo;
        if(tipoActual == "STRING"){
          return this.valor;
        }else if(tipoActual == "DATE"){
          return this.datePipe.transform(this.valorDate, 'dd-MM-yyyy HH:mm');
        }else if (tipoActual == "LONG"){
          return (this.valorNumeric+"");
        }else if (tipoActual == "BOOL"){
          return (this.valorBoolean+"");
        }else if (tipoActual == "LIST"){
          return this.valorOpcion;
        }
        return "";
      }
  }