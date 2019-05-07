import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Documento } from '../../Models/Documento';
import { DocumentoService } from 'src/app/services/documento.service';
import { MatTable, MatSort } from '@angular/material'
import { Consulta } from 'src/app/Models/Consulta';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Columna } from 'src/app/Models/Columna';
import { MatDialog } from '@angular/material';
import { EventEmitter } from '@angular/core';
import { DialogError } from '../error-dialog/dialog-error';
import { DialogInfo } from '../info-dialog/dialog-info';
import { DialogChoose } from '../choose-dialog/dialog-choose';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})

export class DocumentosComponent implements OnInit, OnChanges {
//Los botones de ordenar no funcionan
  constructor(
    private documentoService: DocumentoService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) { 
    iconRegistry.addSvgIcon(
      'fileIcon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/file-icon.svg'));
    iconRegistry.addSvgIcon(
      'showIcon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/show-icon.svg')
    );
  }

  @Input() consulta: Consulta;
  @Output() onCargado = new EventEmitter();

  isLoading: boolean = true;
  columnas: Columna[] ;
  documentos: Documento[];
  columnasAMostrar: string[];
  dataSource = new MatTableDataSource<Documento>(this.documentos);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  ngOnInit() {
    //this.updateView(); 
  }

  ngOnChanges(changes: SimpleChanges){
    this.updateView();
  }

  updateView(){
    this.limpiarTabla();
    this.columnas = this.consulta.parametros;
    let columnasDeseadas = this.columnas.map( c => c.nombreSimbolico);
    this.columnasAMostrar = [...columnasDeseadas, 'details', 'ver'];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.obtenerDocumentos();
  }

  limpiarTabla(){
    this.documentos = [];
    this.dataSource = new MatTableDataSource<Documento>(this.documentos);
  }

  //Validar consulta undefined
  obtenerDocumentos(){
    this.isLoading = true;
    this.documentoService.obtenerDocumentos(this.consulta.criterios)
    .subscribe( documentoDTO => 
      {
        this.documentos = documentoDTO.documento;
        this.updateTable();
      }, error => {
        this.documentos = [];
        this.updateTable();
        this.mostrarError("Error al buscar documentos","No se puso realizar la comunicacion con el servidor");
      });
  }

  private updateTable(){
    this.isLoading = false;
    this.dataSource = new MatTableDataSource<Documento>(this.documentos);
    this.dataSource.paginator = this.paginator;
    this.table.renderRows();
    this.dataSource.sort = this.sort;
    this.onCargado.emit();
  }

  //Eventos
  obtenerValorPropiedad(doc:Documento, prop:string){
    let valorEncontrado = this.documentoService.obtenerValorPropiedad(doc, prop);
    return valorEncontrado;
  }

  mostrarArchivo(laFila:Documento){
    //console.log(laFila);
    this.documentoService.obtenerArchivoPorDocumento(laFila.idDocumento)
    .subscribe( r => 
      {
        let nomArchivo = this.documentoService.obtenerNombreArchivo(r.headers.get("Content-Disposition"));
        this.abrirDialog(r.body,r.headers.get('Content-Type'),nomArchivo);
      },
      error =>{
        this.mostrarError("Error al obtener archivo","No se puso realizar la comunicacion con el servidor");
      });
  }

  mostrarInfoDocumento(doc: Documento){
    this.abrirDialogInfo(doc);
  }

  private descargarArchivo(data: any, tipo: string, nombre:string){
    let binaryData = [];
    binaryData.push(data);
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: tipo}));
    let extension = extensionesPorArchivo[tipo];
    downloadLink.download = `${nombre}.${extension}`;
    downloadLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  }

  private abrirArchivo(data: any, tipo: string, nombre:string){
    
    let binaryData = [];
    binaryData.push(data);
    let nameUrl = window.URL.createObjectURL(new Blob(binaryData, {type: tipo}));
    let win = window.open(nameUrl, '_blank');
    if(win){
      win.focus();
    }
  }

  abrirDialog(data: any, tipo: string, nombreArchivo: string): void {
    const dialogRef = this.dialog.open(DialogChoose, {
      width: '350px',
      data: {info: nombreArchivo}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == "descargar"){
        this.descargarArchivo(data,tipo, nombreArchivo);
      }else if (result == "abrir"){
        this.abrirArchivo(data, tipo, nombreArchivo);
      }
    },
    error =>{
      console.log("Aqui se debe mostrar el error en la interfaz de usuario")
    });
  }

  abrirDialogInfo(doc: Documento){
    const dialogRef = this.dialog.open(DialogInfo, {
      width: '55%',
      height: '80%',
      data: {documentoInfo:doc}
    });

    dialogRef.afterClosed().subscribe( result => {
      console.log("salio de dialog info")
    },
    error =>{
      console.log("Aqui se debe mostrar el error en la interfaz de usuario")
    })
  }

  mostrarError(title: string, content: string){
    const myDialogError = this.dialog.open(DialogError, {
      width: '30%',
      data: {title: title, content: content}
    })

  }

}

export const extensionesPorArchivo: { [key: string]: string } = {
  ["application/pdf"]: "pdf",
  ["image/jpeg"]: "jpg",
  ["application/vnd.ms-excel"]: "xls"
};