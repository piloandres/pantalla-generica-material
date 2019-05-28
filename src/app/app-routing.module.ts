import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { DefinicionParametrosComponent } from './components/definicion-parametros/definicion-parametros.component';
import { AccesoComponent } from './components/acceso/acceso.component';

const routes: Routes = [
  { path: '', redirectTo: '/buscador', pathMatch: 'full'},
  { path: 'buscador', component: DefinicionParametrosComponent },
  { path: 'acceso', component: AccesoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
