import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionItemComponent } from './selection-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconsModule } from 'src/app/shared/modules/icons/icons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [SelectionItemComponent],
  imports: [CommonModule, IconsModule, MatCheckboxModule, TranslateModule],
  exports: [SelectionItemComponent],
})
export class SelectionItemModule {}
