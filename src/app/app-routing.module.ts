import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { DefinicionParametrosComponent } from './components/definicion-parametros/definicion-parametros.component';

const routes: Routes = [
  { path: '', redirectTo: '/criterios', pathMatch: 'full'},
  { path: 'criterios', component: DefinicionParametrosComponent },
  { path: 'documentos', component: DocumentosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
