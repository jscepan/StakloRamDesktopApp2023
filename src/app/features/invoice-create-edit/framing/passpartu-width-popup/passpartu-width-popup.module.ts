import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { PasspartuWidthPopupComponent } from './passpartu-width-popup.component';
import { IconsModule } from 'src/app/shared/modules/icons/icons.module';
import { MatDialogModule } from '@angular/material/dialog';
import { NumberIncreaseDecreaseModule } from 'src/app/shared/components/number-increase-decrease/number-increase-decrease.module';

@NgModule({
  declarations: [PasspartuWidthPopupComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    ButtonModule,
    TranslateModule,
    IconsModule,
    NumberIncreaseDecreaseModule,
  ],
  exports: [PasspartuWidthPopupComponent],
})
export class PasspartuWidthPopupModule {}
