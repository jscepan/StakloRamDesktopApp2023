import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IconsModule } from '../../modules/icons/icons.module';

import { SidebarComponent } from './sidebar.component';
import { KeyboardNumericModule } from '../keyboard/numeric/keyboard-numeric.module';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IconsModule,
    MatMenuModule,
    TranslateModule,
    MatTooltipModule,
    KeyboardNumericModule,
  ],
  exports: [SidebarComponent],
  declarations: [SidebarComponent],
})
export class SidebarModule {}
