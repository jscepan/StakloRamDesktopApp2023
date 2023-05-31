import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FramingComponent } from './framing.component';

const routes: Routes = [
  { path: '', component: FramingComponent },
  { path: 'edit/:invoiceItemOid', component: FramingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FramingRoutingModule {}
