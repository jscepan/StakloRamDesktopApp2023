import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductSettingsComponent } from './product-settings/product-settings.component';

import { SettingsLayoutComponent } from './settings-layout.component';

const routes: Routes = [
  { path: '', component: SettingsLayoutComponent },
  {
    path: 'appSettings',
    loadChildren: () =>
      import('@features/settings/app-settings/app-settings.module').then(
        (m) => m.AppSettingsModule
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('@features/settings/user-settings/user-settings.module').then(
        (m) => m.UserSettingsModule
      ),
  },
  {
    path: 'products-settings',
    loadChildren: () =>
      import(
        '@features/settings/product-settings/product-settings.module'
      ).then((m) => m.ProductSettingsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsLayoutRoutingModule {}
