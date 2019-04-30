import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'dialog-error',
    templateUrl: 'dialog-error.html',
    styleUrls: ['dialog-error.css']
  })
  
  export class DialogError {
  
    constructor(
      public dialogRef: MatDialogRef<DialogError>,
      @Inject(MAT_DIALOG_DATA) public data: ErrorData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }
  
  export interface ErrorData {
    title: string;
    content: string;
  }