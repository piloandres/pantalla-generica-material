import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
    selector: 'info-snackbar',
    templateUrl: 'info-snackbar.html',
    styleUrls: ['info-snackbar.css']
})
export class InfoSnackbar {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any){}
}