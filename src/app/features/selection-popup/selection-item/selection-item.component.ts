import { Component, Input, OnInit } from '@angular/core';
import { SelectionItem } from './selection-item.interface';

@Component({
  selector: 'app-selection-item',
  templateUrl: './selection-item.component.html',
  styleUrls: ['./selection-item.component.scss'],
  providers: [],
})
export class SelectionItemComponent implements OnInit {
  @Input() dataModel!: SelectionItem;
  @Input() itemSize: 'big' | 'middle' | 'small' = 'big';

  constructor() {}

  ngOnInit(): void {}
}
