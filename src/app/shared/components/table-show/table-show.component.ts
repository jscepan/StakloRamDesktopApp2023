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
  data: string[] = [];
}

@Component({
  selector: 'app-table-show',
  templateUrl: './table-show.component.html',
  styleUrls: ['./table-show.component.scss'],
})
export class TableShowComponent implements OnInit, OnDestroy {
  private subs = new SubscriptionManager();

  @Input() dataModel!: TableShow;
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
    this.editData.emit(
      this.dataModel.data[i + 1 - this.dataModel.header.length]
    );
  }

  clickDeleteData(i: number): void {
    this.sweetAlertService.openMeSweetAlert({
      mode: 'danger',
      type: {
        name: SweetAlertTypeEnum.submit,
        buttons: {
          submit: this.translateService.instant('mark'),
          cancel: this.translateService.instant('cancel'),
        },
      },
      title: this.translateService.instant('areYouSureYouWantToDeleteThis'),
      message: '',
    });

    this.subs.sink.$sweetAlertSubs = this.sweetAlertService
      .getDataBackFromSweetAlert()
      .subscribe((data: SweetAlertI) => {
        if (data?.confirmed) {
          this.deleteData.emit(
            this.dataModel.data[i + 1 - this.dataModel.header.length]
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
