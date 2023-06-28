import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';
import { FeatherModule } from 'angular-feather';
import { IconsModule } from '../../modules/icons/icons.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ButtonComponent],
  imports: [CommonModule, MatButtonModule, FeatherModule, IconsModule],
  exports: [ButtonComponent],
})
export class ButtonModule {}
