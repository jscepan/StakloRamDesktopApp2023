import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { FacetingSandingPopupComponent } from './faceting-sanding-popup.component';
import { IconsModule } from 'src/app/shared/modules/icons/icons.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [FacetingSandingPopupComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    ButtonModule,
    TranslateModule,
    IconsModule,
  ],
  exports: [FacetingSandingPopupComponent],
})
export class FacetingSandingPopupModule {}
