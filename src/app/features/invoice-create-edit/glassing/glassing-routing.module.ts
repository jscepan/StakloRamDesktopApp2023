import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlassingComponent } from './glassing.component';

const routes: Routes = [
  { path: '', component: GlassingComponent },
  { path: 'edit/:invoiceItemOid', component: GlassingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlassingRoutingModule {}
