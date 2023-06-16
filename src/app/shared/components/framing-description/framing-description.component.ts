import { Component, Input, OnInit } from '@angular/core';
import { InvoiceItemModel } from '../../models/invoice-item.model';

@Component({
  selector: 'app-framing-description',
  templateUrl: './framing-description.component.html',
  styleUrls: ['./framing-description.component.scss'],
})
export class FramingDescriptionComponent implements OnInit {
  @Input() dataModel!: InvoiceItemModel;
  @Input() inOneRow: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
