import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'invoices',
    loadChildren: () =>
      import('@features/draft-invoices/invoices.module').then(
        (m) => m.InvoicesModule
      ),
  },
  {
    path: 'invoice-create-edit',
    loadChildren: () =>
      import('@features/invoice-create-edit/invoice-create-edit.module').then(
        (m) => m.InvoiceCreateEditModule
      ),
  },
  // {
  //   path: 'search',
  //   loadChildren: () =>
  //     import('@features/search/search.module').then((m) => m.SearchModule),
  // },
  {
    path: 'settings',
    loadChildren: () =>
      import('@features/settings/settings-layout.module').then(
        (m) => m.SettingsLayoutModule
      ),
  },
  {
    path: 'app-settings',
    loadChildren: () =>
      import('@features/settings/app-settings/app-settings.module').then(
        (m) => m.AppSettingsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
