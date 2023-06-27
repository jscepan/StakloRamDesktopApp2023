import { NgModule } from '@angular/core';
import { CustomNumberPipe } from './custom-number.pipe';

@NgModule({
  declarations: [CustomNumberPipe],
  exports: [CustomNumberPipe],
})
export class CustomNumberPipeModule {}
