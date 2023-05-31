import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { SettingsLayoutRoutingModule } from './settings-layout-routing.module';
import { SettingsLayoutComponent } from './settings-layout.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    SettingsLayoutRoutingModule,
    MatTabsModule,
    TranslateModule,
  ],
  exports: [SettingsLayoutComponent],
  declarations: [SettingsLayoutComponent],
})
export class SettingsLayoutModule {}
