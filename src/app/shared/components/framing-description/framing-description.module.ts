import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FramingDescriptionComponent } from './framing-description.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FramingDescriptionComponent],
  imports: [CommonModule, TranslateModule],
  exports: [FramingDescriptionComponent],
})
export class FramingDescriptionModule {}
