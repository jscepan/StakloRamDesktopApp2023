import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconsModule } from '../../modules/icons/icons.module';

import { BasicAlertComponent } from './basic-alert.component';
import { BasicAlertService } from './basic-alert.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@NgModule({
  imports: [CommonModule, RouterModule, IconsModule, MatSnackBarModule],
  exports: [BasicAlertComponent],
  declarations: [BasicAlertComponent],
  providers: [BasicAlertService],
})
export class BasicAlertModule {}
