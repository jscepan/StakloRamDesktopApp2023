import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceCreateEditComponent } from './invoice-create-edit.component';

const routes: Routes = [
  { path: '', component: InvoiceCreateEditComponent },
  { path: 'edit/:invoiceOid', component: InvoiceCreateEditComponent },
  // {
  //   path: 'edit/:invoiceOid/framing',
  //   loadChildren: () =>
  //     import('@features/invoice-create-edit/framing/framing.module').then(
  //       (m) => m.FramingModule
  //     ),
  // },
  {
    path: 'framing',
    loadChildren: () =>
      import('@features/invoice-create-edit/framing/framing.module').then(
        (m) => m.FramingModule
      ),
  },
  // {
  //   path: 'edit/:invoiceOid/glassing',
  //   loadChildren: () =>
  //     import('@features/invoice-create-edit/glassing/glassing.module').then(
  //       (m) => m.GlassingModule
  //     ),
  // },
  {
    path: 'glassing',
    loadChildren: () =>
      import('@features/invoice-create-edit/glassing/glassing.module').then(
        (m) => m.GlassingModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoiceCreateEditRoutingModule {}
