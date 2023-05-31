import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlassingComponent } from './glassing.component';
import { GlassingRoutingModule } from './glassing-routing.module';

@NgModule({
  declarations: [GlassingComponent],
  imports: [CommonModule, GlassingRoutingModule],
  exports: [GlassingComponent],
})
export class GlassingModule {}
