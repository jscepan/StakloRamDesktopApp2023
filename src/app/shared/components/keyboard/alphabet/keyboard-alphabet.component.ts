import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SubscriptionManager } from 'src/app/shared/services/subscription.manager';
import { Button, KeyboardButtons } from './all-buttons';

export interface DialogData {
  title: string;
  value: number;
}

@Component({
  selector: 'app-keyboard-alphabet',
  templateUrl: './keyboard-alphabet.component.html',
  styleUrls: ['./keyboard-alphabet.component.scss'],
})
export class KeyboardAlphabetComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private subs: SubscriptionManager = new SubscriptionManager();
  language: 'SR' | 'EN' = 'SR';

  buttonZeroRow: string[] = [
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
  ];
  buttonFirstRow: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];
  buttonSecondRow: string[] = [
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
  ];
  buttonThirdRow: string[] = [
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
  ];

  title: string = '';
  inputFieldTitle: string = '';
  @ViewChild('inputValue') inputValue!: ElementRef;
  valueForm: UntypedFormGroup;
  initialLoad: boolean = true;

  capsLockActive: boolean = false;
  shiftActive: boolean = false;
  private keyboardButtons: KeyboardButtons = new KeyboardButtons();

  constructor(
    private dialogRef: MatDialogRef<KeyboardAlphabetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private cdRef: ChangeDetectorRef
  ) {
    this.title = data?.title || '';
    this.valueForm = new UntypedFormGroup({
      value: new UntypedFormControl(data?.value ? data.value : '', []),
    });
  }

  get valueControl(): AbstractControl | null {
    return this.valueForm.get('value');
  }

  getButton(key: string): Button {
    return this.keyboardButtons.getButtonById(key);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.inputValue.nativeElement.focus();
      this.inputValue.nativeElement.select();
    });
  }

  public saveSelection(): void {
    this.dialogRef.close(this.valueForm.value.value);
  }

  public cancelSaveSelection(): void {
    this.dialogRef.close();
  }

  deselectText(): void {
    if (this.initialLoad) {
      this.initialLoad = false;
    }
  }

  keyClicked(key: string): void {
    if (this.initialLoad) {
      this.initialLoad = false;
      this.valueControl?.setValue('');
    }
    const button = this.keyboardButtons.getButtonById(key);
    this.valueControl?.setValue(
      this.valueControl.value +
        (this.language === 'SR'
          ? this.capsLockActive || this.shiftActive
            ? button.rs.displayValueCL
            : button.rs.displayValue
          : this.capsLockActive || this.shiftActive
          ? button.en.displayValueCL
          : button.en.displayValue)
    );
    this.shiftActive = false;
  }

  specialButtonClicked(type: string): void {
    switch (type) {
      case 'SR':
        this.language = 'SR';
        break;
      case 'EN':
        this.language = 'EN';
        break;
      case 'capsLock':
        this.capsLockActive = !this.capsLockActive;
        break;
      case 'shift':
        this.shiftActive = true;
        break;
      case 'space':
        if (this.initialLoad) {
          this.initialLoad = false;
          this.valueControl?.setValue('');
        }
        this.valueControl?.setValue(this.valueControl.value + ' ');
        break;
    }
  }

  backspaceClicked(): void {
    if (this.initialLoad) {
      this.initialLoad = false;
      this.valueControl?.setValue('');
    }
    if (this.valueControl?.value.length > 0) {
      this.valueControl?.setValue(this.valueControl.value.slice(0, -1));
    }
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
