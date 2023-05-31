import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSettingsComponent } from './product-settings.component';
import { ProductSettingsRoutingModule } from './product-settings-routing.module';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ProductSettingsComponent],
  imports: [
    CommonModule,
    ProductSettingsRoutingModule,
    ButtonModule,
    TranslateModule,
  ],
  exports: [ProductSettingsComponent],
})
export class ProductSettingsModule {}
