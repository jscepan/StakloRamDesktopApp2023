import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintingComponent } from './printing.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonModule } from 'src/app/shared/components/button/button.module';

@NgModule({
  declarations: [PrintingComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
    MatProgressSpinnerModule,
    ButtonModule,
  ],
  exports: [PrintingComponent],
})
export class PrintingPopupModule {}
