import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { CreateEditPopupComponent } from './create-edit-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from 'src/app/shared/components/form/form.module';

@NgModule({
  declarations: [CreateEditPopupComponent],
  imports: [
    CommonModule,
    ButtonModule,
    MatDialogModule,
    TranslateModule,
    FormModule,
  ],
  exports: [CreateEditPopupComponent],
  entryComponents: [CreateEditPopupComponent],
})
export class CreateEditPopupModule {}
