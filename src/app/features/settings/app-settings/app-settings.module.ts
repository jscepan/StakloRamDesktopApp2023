import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'src/app/shared/components/button/button.module';
import { AppSettingsRoutingModule } from './app-settings-routing.module';
import { AppSettingsComponent } from './app-settings.component';
import { FormModule } from 'src/app/shared/components/form/form.module';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    AppSettingsRoutingModule,
    TranslateModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule,
  ],
  exports: [AppSettingsComponent],
  declarations: [AppSettingsComponent],
})
export class AppSettingsModule {}
