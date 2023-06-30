import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { SelectionItem } from './selection-item/selection-item.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  selectedOids: string[];
  isSingleSelection: boolean;
  items: SelectionItem[];
}

@Component({
  selector: 'app-selection-popup',
  templateUrl: './selection-popup.component.html',
  styleUrls: ['./selection-popup.component.scss'],
})
export class SelectionPopupComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private subs: SubscriptionManager = new SubscriptionManager();

  public selectedOids: string[] = [];
  public isSingleSelection: boolean = true;
  public items: SelectionItem[] = [];
  itemSize: 'big' | 'middle' | 'small';
  searchValue: string = '';

  constructor(
    private dialogRef: MatDialogRef<SelectionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cdRef: ChangeDetectorRef
  ) {
    this.selectedOids = data?.selectedOids || [];
    this.isSingleSelection = !(data.isSingleSelection === false);
    this.items = data.items;
    if (this.items.length < 10) {
      this.itemSize = 'big';
    } else if (this.items.length < 21) {
      this.itemSize = 'middle';
    } else {
      this.itemSize = 'small';
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  searchInputEvent(searchValue: string): void {
    this.searchValue = searchValue;
  }

  isSearchSatisfied(name: string): boolean {
    return (
      !this.searchValue ||
      name.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  handleItemClick(card: SelectionItem): void {
    this.dialogRef.close(card.oid);
  }

  public saveSelection(): void {
    this.dialogRef.close(this.selectedOids);
  }

  public cancelSaveSelection(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
