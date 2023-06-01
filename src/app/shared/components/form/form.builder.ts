import { Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Entity } from './form.component';

export class FormBuilder {
  public objectForm!: FormGroup;
  public formControls: { entity: Entity; formControl: FormControl }[] = [];

  constructor(@Inject('') items: Entity[]) {
    this.init(items);
  }

  private init(items: Entity[]): void {
    this.objectForm = new FormGroup({});

    this.formControls = [];

    items.forEach((item) => {
      // TODO set validators logic...
      let formControl = new FormControl(item.value, []);
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
