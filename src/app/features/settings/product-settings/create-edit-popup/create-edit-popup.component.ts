import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Entity } from 'src/app/shared/components/form/form.component';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';

export interface DialogData {
  items: Entity[];
  isEdit: boolean;
}

@Component({
  selector: 'app-create-edit-popup',
  templateUrl: './create-edit-popup.component.html',
  styleUrls: ['./create-edit-popup.component.scss'],
})
export class CreateEditPopupComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private subs: SubscriptionManager = new SubscriptionManager();

  items: Entity[] = [];
  isEdit: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CreateEditPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cdRef: ChangeDetectorRef
  ) {
    this.items = data.items;
    this.isEdit = !!data.isEdit || false;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(setting: any): void {
    this.dialogRef.close(setting);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
