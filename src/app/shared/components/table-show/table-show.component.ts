import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SubscriptionManager } from '../../services/subscription.manager';
import { SweetAlertService } from '../sweet-alert/sweet-alert.service';
import {
  SweetAlertI,
  SweetAlertTypeEnum,
} from '../sweet-alert/sweet-alert.interface';

export class TableShow {
  header: string[] = [];
  rowData: { data: string[]; isDeleted: boolean }[] = [];
}

@Component({
  selector: 'app-table-show',
  templateUrl: './table-show.component.html',
  styleUrls: ['./table-show.component.scss'],
})
export class TableShowComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  @Input() dataModel!: TableShow;
  @Input() showDeleted: boolean = false;
  @Output() editData: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteData: EventEmitter<string> = new EventEmitter<string>();
  gridTemplateColumnsCssStyle: string = 'auto ';

  constructor(
    private translateService: TranslateService,
    private sweetAlertService: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.gridTemplateColumnsCssStyle += 'auto ';
    this.dataModel.header.forEach(() => {
      this.gridTemplateColumnsCssStyle += 'auto ';
    });
  }

  clickEditData(i: number): void {
    this.editData.emit(this.dataModel.rowData[i].data[0]);
  }

  clickDeleteData(i: number): void {
    this.sweetAlertService.openMeSweetAlert({
      mode: 'danger',
      type: {
        name: SweetAlertTypeEnum.submit,
        buttons: {
          submit: this.translateService.instant('ok'),
          cancel: this.translateService.instant('cancel'),
        },
      },
      title: this.dataModel.rowData[i].isDeleted
        ? this.translateService.instant('areYouSureYouWantToActivateThis')
        : this.translateService.instant('areYouSureYouWantToDeleteThis'),
      message: '',
    });

    this.subs.sink.$sweetAlertSubs = this.sweetAlertService
      .getDataBackFromSweetAlert()
      .subscribe((data: SweetAlertI) => {
        if (data?.confirmed) {
          this.deleteData.emit(this.dataModel.rowData[i].data[0]);
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
