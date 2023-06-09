import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SweetAlertComponent } from './sweet-alert.component';
import { SweetAlertService } from './sweet-alert.service';
import { ButtonModule } from '../button/button.module';
import { SafePipeModule } from 'safe-pipe';
import { IconsModule } from '../../modules/icons/icons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    ButtonModule,
    SafePipeModule,
    MatTooltipModule,
  ],
  declarations: [SweetAlertComponent],
  exports: [SweetAlertComponent],
  providers: [SweetAlertService],
})
export class SweetAlertModule {}
