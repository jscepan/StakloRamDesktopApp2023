import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSettingsComponent } from './product-settings.component';
import { ProductSettingsRoutingModule } from './product-settings-routing.module';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { TableShowModule } from 'src/app/shared/components/table-show/table-show.module';
import { CreateEditPopupModule } from './create-edit-popup/create-edit-popup.module';

@NgModule({
  declarations: [ProductSettingsComponent],
  imports: [
    CommonModule,
    ProductSettingsRoutingModule,
    TableShowModule,
    CreateEditPopupModule,
    ButtonModule,
    TranslateModule,
  ],
  exports: [ProductSettingsComponent],
})
export class ProductSettingsModule {}
