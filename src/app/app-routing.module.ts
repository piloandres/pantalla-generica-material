import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentosComponent } from './components/documentos/documentos.component';

const routes: Routes = [
  { path: '', redirectTo: '/documentos', pathMatch: 'full'},
  { path: 'documentos', component: DocumentosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
