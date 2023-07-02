import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { KeyboardAlphabetComponentService } from '../keyboard/alphabet/keyboard-alphabet.component.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-number-increase-decrease',
  templateUrl: './number-increase-decrease.component.html',
  styleUrls: ['./number-increase-decrease.component.scss'],
  providers: [KeyboardAlphabetComponentService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NumberIncreaseDecreaseComponent implements OnInit, OnDestroy {
  @Input() value?: number = 0;
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Output() changeEvent: EventEmitter<string> = new EventEmitter();

  constructor(
    private keyboardAlphabetComponentService: KeyboardAlphabetComponentService
  ) {}

  ngOnInit(): void {}

  clickEvent(type: 'increase' | 'decrease'): void {
    this.changeEvent.emit(type);
  }

  ngOnDestroy(): void {}
}
