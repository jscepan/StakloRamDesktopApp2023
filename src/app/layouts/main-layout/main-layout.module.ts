import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { MainRoutingModule } from './main-routing.module';
import { GlobalService } from 'src/app/shared/services/global.service';
import { SidebarModule } from 'src/app/shared/components/sidebar/sidebar.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatTooltipModule,
    MainRoutingModule,
    SidebarModule,
  ],
  providers: [GlobalService],
})
export class MainLayoutModule {}
