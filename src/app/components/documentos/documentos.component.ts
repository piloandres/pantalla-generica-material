import { Component, OnInit, ViewChild, AfterViewInit, Input, OnChanges, SimpleChange, SimpleChanges, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Documento } from '../../POJOs/Documento';
import { DocumentoService } from 'src/app/services/documento.service';
import { MatTable, MatSort } from '@angular/material'
import { Consulta } from 'src/app/POJOs/Consulta';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Columna } from 'src/app/POJOs/Columna';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent implements OnInit, OnChanges {
//Hay un bug con los botones de ordenar
  constructor(
    private documentoService: DocumentoService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) { 
    iconRegistry.addSvgIcon(
      'fileIcon',
      sanitizer.bypassSecurityTrustResourceUrl('assets/images/file-icon.svg')
    );
  }
  @Input() consulta: Consulta;
  isLoading: boolean = true;
  columnas: Columna[] ;/*= ["TipoCliente","IsCurrentVersion","Nombredeldocumento","NumeroIdentificacionCliente",
  "IsReserved"];*/
  documentos: Documento[];
  columnasAMostrar: string[];
  dataSource = new MatTableDataSource<Documento>(this.documentos);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  ngOnInit() {
    this.updateView(); 
  }

  ngOnChanges(changes: SimpleChanges){
    this.updateView();
  }

  updateView(){
    this.documentos = [];
    this.dataSource = new MatTableDataSource<Documento>(this.documentos);
    this.columnas = this.consulta.parametros;
    let columnasDeseadas = this.columnas.map( c => c.nombreSimbolico);
    columnasDeseadas.push('ver');
    this.columnasAMostrar = columnasDeseadas;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.obtenerDocumentos();
  }

  obtenerDocumentos(){
    this.isLoading = true;
    this.documentoService.obtenerDocumentos(this.consulta.queryUrl)
    .subscribe( documentoDTO => 
      {
        this.isLoading = false;
        this.documentos = documentoDTO.documento;
        this.dataSource = new MatTableDataSource<Documento>(this.documentos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.table.renderRows();
      });
  }

  //Eventos
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

  mostrarArchivo(laFila:Documento){
    console.log(laFila);
    this.documentoService.obtenerArchivoPorDocumento(laFila.idDocumento)
    .subscribe( r => 
      {
        this.abrirDialog();
      //this.descargarArchivo(r.body,r.headers.get('Content-Type'))
      });
  }

  private descargarArchivo(data: any, tipo: string){
    let binaryData = [];
    binaryData.push(data);
    let miBlob = new Blob([data], {type: tipo});
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: tipo}));
    downloadLink.download = "documento_nuevo.pdf";
    downloadLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  }

  abrirDialog(): void {
    const dialogRef = this.dialog.open(DialogChoose, {
      width: '350px',
      data: {info: "whatever"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El resultado fue'+ result);
    });
  }

}

@Component({
  selector: 'dialog-choose',
  templateUrl: 'dialog-choose.html',
})

export class DialogChoose {

  constructor(
    public dialogRef: MatDialogRef<DialogChoose>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  info: string;
  respuesta: string;
}
