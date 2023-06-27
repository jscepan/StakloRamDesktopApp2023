import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FramingDescriptionComponent } from './framing-description.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomNumberPipeModule } from 'src/app/core/pipes/custom-number-pipe.module';

@NgModule({
  declarations: [FramingDescriptionComponent],
  imports: [CommonModule, TranslateModule, CustomNumberPipeModule],
  exports: [FramingDescriptionComponent],
})
export class FramingDescriptionModule {}
