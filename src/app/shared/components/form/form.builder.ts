import { Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Entity } from './form.component';

export class FormBuilder {
  public objectForm!: UntypedFormGroup;
  public formControls: { entity: Entity; formControl: UntypedFormControl }[] = [];

  constructor(@Inject('') items: Entity[]) {
    this.init(items);
  }

  private init(items: Entity[]): void {
    this.objectForm = new UntypedFormGroup({});

    this.formControls = [];

    items.forEach((item) => {
      // TODO set validators logic...
      let formControl = new UntypedFormControl(item.value, []);
      if (item.disabled) {
        formControl.disable();
      }
      this.formControls.push({
        entity: item,
        formControl,
      });
    });

    this.formControls.forEach((item) => {
      this.objectForm.addControl(item.entity.label.key, item.formControl);
    });
  }
}
