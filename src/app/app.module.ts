import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { DefinicionParametrosComponent } from './components/definicion-parametros/definicion-parametros.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

import { DialogChoose } from 'src/app/components/choose-dialog/dialog-choose';
import { DialogInfo } from 'src/app/components/info-dialog/dialog-info';
import { DialogError } from 'src/app/components/error-dialog/dialog-error';

import { getSpanishPaginatorIntl } from './configuration/spanish-paginator-traslate';

import { CacheInterceptor } from './interceptors/cache-interceptor';
import { InfoSnackbar } from './components/info-snackbar/info-snackbar';
import { TimeoutInterceptor, DEFAULT_TIMEOUT } from './interceptors/timeout-interceptor';



@NgModule({
  declarations: [
    AppComponent,
    DocumentosComponent,
    DefinicionParametrosComponent,
    DialogChoose,
    DialogInfo,
    DialogError,
    InfoSnackbar
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatSnackBarModule
  ],
  providers: [
    DatePipe,
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    { provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true },
    { provide: DEFAULT_TIMEOUT, useValue: 10000 }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogChoose,
    DialogInfo,
    DialogError,
    InfoSnackbar
  ]
})
export class AppModule { }
