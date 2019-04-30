import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Documento } from 'src/app/Models/Documento';

@Component({
    selector: 'dialog-info',
    templateUrl: 'dialog-info.html',
    styleUrls: ['dialog-info.css']
  })
  
  export class DialogInfo {
  
    constructor(
      public dialogRef: MatDialogRef<DialogInfo>,
      @Inject(MAT_DIALOG_DATA) public data: DialogInfoData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
  
  export interface DialogInfoData{
    documentoInfo: Documento;
  }