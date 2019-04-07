import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Documento } from '../../POJOs/Documento';
import { DocumentoService } from 'src/app/services/documento.service';
import { MatTable, MatSort } from '@angular/material'

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit {

  constructor(
    private documentoService: DocumentoService
  ) { }

  columnas: string[] = ["TipoCliente","IsCurrentVersion","Nombredeldocumento","NumeroIdentificacionCliente",
  "IsReserved"];
  documentos: Documento[];
  dataSource = new MatTableDataSource<Documento>(this.documentos);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.obtenerDocumentos();
  }

  obtenerDocumentos(){
    this.documentoService.obtenerDocumentos()
    .subscribe( documentoDTO => 
      {
        this.documentos = documentoDTO.documento;
        this.dataSource = new MatTableDataSource<Documento>(this.documentos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.table.renderRows();
      });
  }

  obtenerValorPropiedad(doc:Documento, prop:string){
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

}
