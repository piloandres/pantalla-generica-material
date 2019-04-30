import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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