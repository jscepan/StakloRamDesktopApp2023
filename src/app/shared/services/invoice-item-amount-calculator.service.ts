import { Injectable } from '@angular/core';
import { FrameModel } from 'src/app/shared/models/frame-model';
import { InvoiceItemModel } from 'src/app/shared/models/invoice-item.model';
import { PasspartuColorModel } from '../models/passpartu-color-model';
import { ProductModel } from '../models/product-model';
import { SettingsStoreService } from './settings-store.service';
import { SERVICE_TYPE, UOM } from '../constants';
import { getDisplayNumberAsString, roundOnDigits } from '../utils';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class InvoiceItemCalculatorService {
  minGlassSurface: number = 0;

  constructor(
    private appSettings: SettingsStoreService,
    private translateService: TranslateService
  ) {
    this.appSettings.settings.subscribe((sett) => {
      this.minGlassSurface = sett?.minGlassSurface ?? 0;
    });
  }

  public getInvoiceItemAmount(invoiceItem: InvoiceItemModel): number {
    console.log('---------- Racunam stavku za fakturu, '+invoiceItem.oid+' ---------------------');
    let glassPrice = 0;
    let passpartuPrice = 0;
    let mirrorPrice = 0;
    let framesPrice = 0;
    let facetingPrice = 0;
    let sandingPrice = 0;
    if (invoiceItem.glass) {
      console.log(' IMALI SMO STAKLO, pa racunamo cenu stakla:');
      glassPrice = this.getGlassLengthForInvoiceItems([invoiceItem])[0].amount;
      console.log('ona je: '+glassPrice);
    }
    if (invoiceItem.selectedPasspartuColors?.length) {
      console.log(' IMALI SMO PASSPARTU, pa racunamo cenu paspartua:');
      passpartuPrice = this.getPasspartuLengthForInvoiceItems([invoiceItem])[0]
        .amount;
      console.log('ona je: '+passpartuPrice);
    }
    if (invoiceItem.mirror) {
      console.log(' IMALI SMO OGLEDALO, pa racunamo cenu ogledala:');
      mirrorPrice = this.getMirrorLengthForInvoiceItems([invoiceItem])[0]
        .amount;
      console.log('ona je: '+mirrorPrice);
    }
    if (invoiceItem.mirror && invoiceItem.faceting) {
      console.log(' IMALI SMO FAZETIRANJE, pa racunamo cenu fazetiranja:');
      facetingPrice = this.getFacetingLengthForInvoiceItems([invoiceItem])[0]
        .amount;
      console.log('ona je: '+facetingPrice);
      const surface =
        invoiceItem.dimensionsHeight * 2 + invoiceItem.dimensionsWidth * 2;
      console.log('povrsina je: '+surface+', ali tu povrsinu trenutno ne koristimo nizasta');
      }
    if (invoiceItem.mirror && invoiceItem.sanding) {
      console.log(' IMALI SMO PESKARENJE, pa racunamo cenu peskarenja:');
      sandingPrice = this.getSandingLengthForInvoiceItems([invoiceItem])[0]
        .amount;
      console.log('ona je: '+sandingPrice);
      }

    console.log('A sad da utvrdimo duzinu ramova za ovu stavku fakture');
    this.getFramesLengthAmountForInvoiceItems([invoiceItem]).forEach((f, index) => {
      console.log('cena rama broj ' + (index+1) + ' je: '+f.amount);
      framesPrice += f.amount;
    });
    let grossAmount =
      glassPrice +
      passpartuPrice +
      mirrorPrice +
      framesPrice +
      facetingPrice +
      sandingPrice;
      return roundOnDigits(grossAmount);
  }

  getFramesLengthAmountForInvoiceItems(
    invoiceItems: InvoiceItemModel[]
  ): { frame: FrameModel; uom: UOM; length: number; amount: number }[] {
    const result: {
      frame: FrameModel;
      uom: UOM;
      length: number;
      amount: number;
    }[] = [];
    console.log('A sad da saberemo ram po ram');
    invoiceItems.forEach((item) => {
      if (item.selectedFrames) {
        let height = item.dimensionsHeight;
        let width = item.dimensionsWidth;
        for (let i = 0; i < item.selectedFrames.length; i++) {
          if (i > 0) {
            for (let j = i; j > 0; j--) {
              height +=
                (item.selectedFrames[j - 1].frame.frameWidthMM * 2) / 10;
              width += (item.selectedFrames[j - 1].frame.frameWidthMM * 2) / 10;
            }
          }
          console.log('---------------------------------------');
          console.log('Idemo sad za ram broj '+(i+1));
          console.log('Visina: '+height+', a sirina: '+width);
          if (item.selectedPasspartuColors?.length) {
            console.log('Ima passpartu pa cemo da korigujemo sirinu i visinu');
            if (item.selectedPasspartuColors[0].passpartuLeft) {
              const passLengthIncreaseWidth = this.transformMeasure(
                this.transformPasspartuWidth(
                  item.selectedPasspartuColors[0].passpartuLeft
                ),
                item.selectedPasspartuColors[0].passpartuWidthUom ||
                  UOM.CENTIMETER,
                item.dimensionsUom
              );
              width += passLengthIncreaseWidth;
            }
            if (item.selectedPasspartuColors[0].passpartuRight) {
              const passLengthIncreaseWidth = this.transformMeasure(
                this.transformPasspartuWidth(
                  item.selectedPasspartuColors[0].passpartuRight
                ),
                item.selectedPasspartuColors[0].passpartuWidthUom ||
                  UOM.CENTIMETER,
                item.dimensionsUom
              );
              width += passLengthIncreaseWidth;
            }
            if (item.selectedPasspartuColors[0].passpartuTop) {
              const passLengthIncreaseHeight = this.transformMeasure(
                this.transformPasspartuWidth(
                  item.selectedPasspartuColors[0].passpartuTop
                ),
                item.selectedPasspartuColors[0]?.passpartuWidthUom ||
                  UOM.CENTIMETER,
                item.dimensionsUom
              );
              height += passLengthIncreaseHeight;
            }
            if (item.selectedPasspartuColors[0].passpartuDown) {
              const passLengthIncreaseHeight = this.transformMeasure(
                this.transformPasspartuWidth(
                  item.selectedPasspartuColors[0].passpartuDown
                ),
                item.selectedPasspartuColors[0]?.passpartuWidthUom ||
                  UOM.CENTIMETER,
                item.dimensionsUom
              );
              height += passLengthIncreaseHeight;
            }
          }
          console.log('Posle promene visina: '+height+', a sirina: '+width);
          let length = height * 2 + width * 2;
          length += (item.selectedFrames[i].frame.frameWidthMM * 8) / 10;
          length = this.transformMeasure(
            length,
            item.dimensionsUom,
            item.selectedFrames[i].frame.uom
          );
          console.log('A sad i da izracunamo duzinu koja iznosi: '+length);
          console.log('Dobili smo je ovako: sirina x 2 + visina x 2 = '+(height * 2 + width * 2)+'+ sirina rama u MM * 8/10, a sirina rama je: '+item.selectedFrames[i].frame.frameWidthMM);
          length = roundOnDigits(length);
          console.log('a onda duzinu zaokruzimo na tri decimale pa iznosi: '+length);
          let amount = length * (item.selectedFrames[i].frame.pricePerUom || 1);
          console.log('Cena rama iznosi: '+amount+', a zaokruzena na dve decimale: '+amount);
          amount = roundOnDigits(amount);
          let indexOf = result.findIndex(
            (r) => r.frame.oid === item.selectedFrames[i].frame.oid
          );
          if (indexOf >= 0) {
            let newElement = { ...result[indexOf] };
            newElement.amount = roundOnDigits((newElement.amount += amount));
            newElement.length = roundOnDigits((newElement.length += length));
            result.splice(indexOf, 1, newElement);
          } else {
            result.push({
              frame: item.selectedFrames[i].frame,
              uom: item.selectedFrames[i].frame.uom,
              length: roundOnDigits(length),
              amount: roundOnDigits(amount),
            });
          }
        }
      }
    });
    return result;
  }

  getGlassLengthForInvoiceItems(
    invoiceItems: InvoiceItemModel[]
  ): { glass: ProductModel; uom: UOM; length: number; amount: number }[] {
    const result: {
      glass: ProductModel;
      uom: UOM;
      length: number;
      amount: number;
    }[] = [];
    invoiceItems.forEach((item) => {
      if (item.glass) {
        let width = item.dimensionsWidth;
        let height = item.dimensionsHeight;
        if (item.selectedPasspartuColors?.length) {
          if (
            item.dimensionsUom ===
            item.selectedPasspartuColors[0].passpartuWidthUom
          ) {
            width += this.transformPasspartuWidth(
              item.selectedPasspartuColors[0].passpartuLeft || 0
            );
            width += this.transformPasspartuWidth(
              item.selectedPasspartuColors[0].passpartuRight || 0
            );
            height += this.transformPasspartuWidth(
              item.selectedPasspartuColors[0].passpartuTop || 0
            );
            height += this.transformPasspartuWidth(
              item.selectedPasspartuColors[0].passpartuDown || 0
            );
          } else if (
            item.dimensionsUom === UOM.CENTIMETER &&
            item.selectedPasspartuColors[0].passpartuWidthUom === UOM.MILIMETER
          ) {
            width +=
              this.transformPasspartuWidth(
                item.selectedPasspartuColors[0].passpartuLeft || 0
              ) / 10;
            width +=
              this.transformPasspartuWidth(
                item.selectedPasspartuColors[0].passpartuRight || 0
              ) / 10;
            height +=
              this.transformPasspartuWidth(
                item.selectedPasspartuColors[0].passpartuTop || 0
              ) / 10;
            height +=
              this.transformPasspartuWidth(
                item.selectedPasspartuColors[0].passpartuDown || 0
              ) / 10;
          }
        }

        let surface =
          this.getConstructionMeasure(height) *
          this.getConstructionMeasure(width);
        surface = this.transformMeasure(
          roundOnDigits(surface),
          UOM.CENTIMETER2,
          item.glass.uom
        );
        if (item.glass.uom === UOM.METER2 && surface < this.minGlassSurface) {
          surface = this.minGlassSurface;
        }
        let glassPrice = (item?.glass?.pricePerUom || 1) * surface;

        let indexOf = result.findIndex((g) => g.glass.oid === item.glass?.oid);
        if (indexOf >= 0) {
          let newElement = { ...result[indexOf] };
          newElement.length = roundOnDigits(
            (newElement.length += roundOnDigits(surface))
          );
          newElement.amount = roundOnDigits(
            (newElement.amount += roundOnDigits(glassPrice))
          );
          result.splice(indexOf, 1, newElement);
        } else {
          result.push({
            glass: item.glass,
            uom: item.glass.uom,
            length: roundOnDigits(surface),
            amount: roundOnDigits(glassPrice),
          });
        }
      }
    });
    return result;
  }

  getMirrorLengthForInvoiceItems(
    invoiceItems: InvoiceItemModel[]
  ): { mirror: ProductModel; uom: UOM; length: number; amount: number }[] {
    const result: {
      mirror: ProductModel;
      uom: UOM;
      length: number;
      amount: number;
    }[] = [];
    invoiceItems.forEach((item) => {
      if (item.mirror) {
        let width = item.dimensionsWidth;
        let height = item.dimensionsHeight;
        let surface =
          this.getConstructionMeasure(height) *
          this.getConstructionMeasure(width);
        surface = roundOnDigits(surface);

        let mirrorPrice =
          (item.mirror.pricePerUom || 1) *
          this.transformMeasure(surface, UOM.CENTIMETER2, item.mirror.uom);

        let indexOf = result.findIndex(
          (g) => g.mirror.oid === item.mirror?.oid
        );
        if (indexOf >= 0) {
          let newElement = { ...result[indexOf] };
          newElement.length = roundOnDigits(
            (newElement.length += roundOnDigits(surface))
          );
          newElement.amount = roundOnDigits(
            (newElement.amount += roundOnDigits(mirrorPrice))
          );
          result.splice(indexOf, 1, newElement);
        } else {
          result.push({
            mirror: item.mirror,
            uom: item.mirror.uom,
            length: roundOnDigits(
              this.transformMeasure(surface, UOM.CENTIMETER2, item.mirror.uom)
            ),
            amount: roundOnDigits(mirrorPrice),
          });
        }
      }
    });
    return result;
  }

  getFacetingLengthForInvoiceItems(
    invoiceItems: InvoiceItemModel[]
  ): { faceting: ProductModel; uom: UOM; length: number; amount: number }[] {
    const result: {
      faceting: ProductModel;
      uom: UOM;
      length: number;
      amount: number;
    }[] = [];
    invoiceItems.forEach((item) => {
      if (item.faceting) {
        let width = item.dimensionsWidth;
        let height = item.dimensionsHeight;

        let length = height * 2 + width * 2;
        length = roundOnDigits(length);

        let facetingPrice =
          (item?.faceting?.pricePerUom || 1) *
          this.transformMeasure(length, UOM.CENTIMETER, item.faceting.uom);
        let indexOf = result.findIndex(
          (g) => g.faceting.oid === item.faceting?.oid
        );
        if (indexOf >= 0) {
          let newElement = { ...result[indexOf] };
          newElement.length = roundOnDigits(
            (newElement.length += roundOnDigits(length))
          );
          newElement.amount = roundOnDigits(
            (newElement.amount += roundOnDigits(facetingPrice))
          );
          result.splice(indexOf, 1, newElement);
        } else {
          result.push({
            faceting: item.faceting,
            uom: item.faceting.uom,
            length: roundOnDigits(
              this.transformMeasure(length, UOM.CENTIMETER, item.faceting.uom)
            ),
            amount: roundOnDigits(facetingPrice),
          });
        }
      }
    });
    return result;
  }

  getSandingLengthForInvoiceItems(
    invoiceItems: InvoiceItemModel[]
  ): { sanding: ProductModel; uom: UOM; length: number; amount: number }[] {
    const result: {
      sanding: ProductModel;
      uom: UOM;
      length: number;
      amount: number;
    }[] = [];
    invoiceItems.forEach((item) => {
      if (item.sanding) {
        let width = item.dimensionsWidth;
        let height = item.dimensionsHeight;

        let surface =
          this.getConstructionMeasure(height) *
          this.getConstructionMeasure(width);
        surface = roundOnDigits(surface);

        let sandingPrice =
          (item?.sanding?.pricePerUom || 1) *
          this.transformMeasure(surface, UOM.CENTIMETER2, item.sanding.uom);

        let indexOf = result.findIndex(
          (g) => g.sanding.oid === item?.sanding?.oid
        );
        if (indexOf >= 0) {
          let newElement = { ...result[indexOf] };
          newElement.length = roundOnDigits(
            (newElement.length += roundOnDigits(surface))
          );
          newElement.amount = roundOnDigits(
            (newElement.amount += roundOnDigits(sandingPrice))
          );
          result.splice(indexOf, 1, newElement);
        } else {
          result.push({
            sanding: item.sanding,
            uom: item.sanding.uom,
            length: roundOnDigits(
              this.transformMeasure(surface, UOM.CENTIMETER2, item.sanding.uom)
            ),
            amount: roundOnDigits(sandingPrice),
          });
        }
      }
    });
    return result;
  }

  getPasspartuLengthForInvoiceItems(invoiceItems: InvoiceItemModel[]): {
    passpartuColor?: PasspartuColorModel;
    uom?: UOM;
    length: number;
    amount: number;
  }[] {
    const result: {
      passpartuColor?: PasspartuColorModel;
      uom?: UOM;
      length: number;
      amount: number;
    }[] = [];
    invoiceItems.forEach((item) => {
      if (item.selectedPasspartuColors?.length) {
        let width = item.dimensionsWidth;
        let height = item.dimensionsHeight;
        if (item.selectedPasspartuColors[0].passpartuColor) {
          if (
            item.dimensionsUom ===
            item.selectedPasspartuColors[0].passpartuWidthUom
          ) {
            width += this.transformPasspartuWidth(
              item.selectedPasspartuColors[0].passpartuLeft || 0
            );
            width += this.transformPasspartuWidth(
              item.selectedPasspartuColors[0].passpartuRight || 0
            );
            height += this.transformPasspartuWidth(
              item?.selectedPasspartuColors[0].passpartuTop || 0
            );
            height += this.transformPasspartuWidth(
              item?.selectedPasspartuColors[0].passpartuDown || 0
            );
          } else if (
            item.dimensionsUom === UOM.CENTIMETER &&
            item.selectedPasspartuColors[0].passpartuWidthUom === UOM.MILIMETER
          ) {
            width +=
              this.transformPasspartuWidth(
                item.selectedPasspartuColors[0].passpartuLeft || 0
              ) / 10;
            width +=
              this.transformPasspartuWidth(
                item.selectedPasspartuColors[0].passpartuRight || 0
              ) / 10;
            height +=
              this.transformPasspartuWidth(
                item?.selectedPasspartuColors[0].passpartuTop || 0
              ) / 10;
            height +=
              this.transformPasspartuWidth(
                item?.selectedPasspartuColors[0].passpartuDown || 0
              ) / 10;
          }
        }
        let surface =
          this.getConstructionMeasure(height) *
          this.getConstructionMeasure(width);
        surface = roundOnDigits(surface);

        // let passpartuPrice =0;
        item.selectedPasspartuColors.forEach((pass) => {
          const passpartuPrice =
            (pass?.passpartuColor?.passpartu?.pricePerUom || 1) *
            this.transformMeasure(
              surface,
              UOM.CENTIMETER2,
              pass?.passpartuColor?.passpartu?.uom || UOM.CENTIMETER2
            );

          let indexOf = result.findIndex(
            (g) => g.passpartuColor?.oid === pass.passpartuColor?.oid
          );
          if (indexOf >= 0) {
            let newElement = { ...result[indexOf] };
            newElement.length = roundOnDigits(
              (newElement.length += roundOnDigits(surface))
            );
            newElement.amount = roundOnDigits(
              (newElement.amount += roundOnDigits(passpartuPrice))
            );
            result.splice(indexOf, 1, newElement);
          } else {
            result.push({
              passpartuColor: pass.passpartuColor,
              uom: pass.passpartuColor?.passpartu.uom,
              length: roundOnDigits(
                this.transformMeasure(
                  surface,
                  UOM.CENTIMETER2,
                  pass?.passpartuColor?.passpartu?.uom || UOM.CENTIMETER2
                )
              ),
              amount: roundOnDigits(passpartuPrice),
            });
          }
        });
      }
    });
    return result;
  }

  private getConstructionMeasure(num: number): number {
    let n = Math.floor(num);
    if (++n % 3 === 0) {
      return n;
    } else if (++n % 3 === 0) {
      return n;
    } else if (++n % 3 === 0) {
      return n;
    }
    return num;
  }

  private transformPasspartuWidth(passpartuWidth: number): number {
    if (passpartuWidth > 0 && passpartuWidth <= 5) {
      return 5;
    }
    // else if (passpartuWidth > 5 && passpartuWidth <= 10) {
    //   return 10;
    // } else if (passpartuWidth > 10 && passpartuWidth <= 15) {
    //   return 15;
    // } else if (passpartuWidth > 15 && passpartuWidth <= 20) {
    //   return 20;
    // }
    return passpartuWidth;
  }

  private transformMeasure(amount: number, uom: UOM, targetUom: UOM): number {
    let value: number = 0;
    if (uom === UOM.MILIMETER) {
      if (targetUom === UOM.MILIMETER) {
        value = amount;
      } else if (targetUom === UOM.CENTIMETER) {
        value = amount / 10;
      } else if (targetUom === UOM.METER) {
        value = amount / 1000;
      }
    } else if (uom === UOM.CENTIMETER) {
      if (targetUom === UOM.MILIMETER) {
        value = amount * 10;
      } else if (targetUom === UOM.CENTIMETER) {
        value = amount;
      } else if (targetUom === UOM.METER) {
        value = amount / 100;
      }
    } else if (uom === UOM.METER) {
      if (targetUom === UOM.MILIMETER) {
        value = amount * 1000;
      } else if (targetUom === UOM.CENTIMETER) {
        value = amount * 100;
      } else if (targetUom === UOM.METER) {
        value = amount;
      }
    } else if (uom === UOM.MILIMETER2) {
      if (targetUom === UOM.MILIMETER2) {
        value = amount;
      } else if (targetUom === UOM.CENTIMETER2) {
        value = amount / 100;
      } else if (targetUom === UOM.METER2) {
        value = amount / 1000000;
      }
    } else if (uom === UOM.CENTIMETER2) {
      if (targetUom === UOM.MILIMETER2) {
        value = amount * 100;
      } else if (targetUom === UOM.CENTIMETER2) {
        value = amount;
      } else if (targetUom === UOM.METER2) {
        value = amount / 10000;
      }
    } else if (uom === UOM.METER2) {
      if (targetUom === UOM.MILIMETER2) {
        value = amount * 1000000;
      } else if (targetUom === UOM.CENTIMETER2) {
        value = amount * 10000;
      } else if (targetUom === UOM.METER2) {
        value = amount;
      }
    }
    return value;
  }

  getInvoiceItemTitle(invoiceItem: InvoiceItemModel): string {
    let title = '';
    if (invoiceItem.selectedPasspartuColors?.length) {
      title += this.translateService.instant('passpartu') + ': ';
      invoiceItem.selectedPasspartuColors.forEach((pas, index) => {
        if (index > 0) {
          title += ', ';
        }
        title += pas.passpartuColor?.name;
        if (
          pas.passpartuTop === pas.passpartuDown &&
          pas.passpartuTop === pas.passpartuLeft &&
          pas.passpartuTop === pas.passpartuRight
        ) {
          title +=
            '/' +
            this.translateService.instant('width') +
            ': ' +
            pas.passpartuTop +
            pas.passpartuWidthUom;
        } else if (
          pas.passpartuTop !== pas.passpartuDown ||
          pas.passpartuTop !== pas.passpartuLeft ||
          pas.passpartuTop !== pas.passpartuRight
        ) {
          title +=
            '/' +
            this.translateService.instant('top') +
            ': ' +
            pas.passpartuTop +
            pas.passpartuWidthUom +
            ', ';
          title +=
            this.translateService.instant('down') +
            ': ' +
            pas.passpartuDown +
            pas.passpartuWidthUom +
            ', ';
          title +=
            this.translateService.instant('left') +
            ': ' +
            pas.passpartuLeft +
            pas.passpartuWidthUom +
            ', ';
          title +=
            this.translateService.instant('right') +
            ': ' +
            pas.passpartuRight +
            pas.passpartuWidthUom;
        }
      });
      title += ', ';
    }
    if (invoiceItem.glass?.oid) {
      title +=
        this.translateService.instant('glass') +
        ': ' +
        invoiceItem.glass.name +
        ', ';
    }
    if (invoiceItem.mirror?.oid) {
      title +=
        this.translateService.instant('mirror') +
        ': ' +
        invoiceItem.mirror.name +
        ', ';
      if (invoiceItem.faceting?.oid) {
        title +=
          this.translateService.instant('faceting') +
          ': ' +
          invoiceItem.faceting.name +
          ', ';
      }
      if (invoiceItem.sanding?.oid) {
        title +=
          this.translateService.instant('sanding') +
          ': ' +
          invoiceItem.sanding.name +
          ', ';
      }
    }
    if (invoiceItem.selectedFrames.length === 1) {
      title += this.translateService.instant('frame');
    } else {
      title += this.translateService.instant('frames');
    }
    title += ': ';
    invoiceItem.selectedFrames.forEach((frame, index) => {
      if (index > 0) {
        title += ', ';
      }
      title += `${frame.frame.code}${frame.colorCode}`;
    });
    return title;
  }

  public getItemsDescription(invoiceItems: InvoiceItemModel[]): string[] {
    let items: string[] = [];
    let num = 1;
    this.getFramesLengthAmountForInvoiceItems(invoiceItems).forEach((item) => {
      if (item.amount && item.amount > 0) {
        items.push(
          num +
            ') ' +
            getDisplayNumberAsString(item.length) +
            ' ' +
            item.uom +
            ' X ' +
            item.frame.cashRegisterNumber +
            ' (' +
            item.frame.name +
            ', ' +
            item.frame.code.substring(0, 2) +
            ')'
        );
        num++;
      }
    });
    this.getPasspartuLengthForInvoiceItems(invoiceItems).forEach((item) => {
      if (item.amount && item.amount > 0) {
        items.push(
          num +
            ') ' +
            getDisplayNumberAsString(item.length) +
            ' ' +
            item.uom +
            ' X ' +
            item.passpartuColor?.passpartu.cashRegisterNumber +
            ' (' +
            item.passpartuColor?.name +
            ')'
        );
        num++;
      }
    });
    this.getGlassLengthForInvoiceItems(invoiceItems).forEach((item) => {
      if (item.amount && item.amount > 0) {
        items.push(
          num +
            ') ' +
            getDisplayNumberAsString(item.length) +
            ' ' +
            item.uom +
            ' X ' +
            item.glass.cashRegisterNumber +
            ' (' +
            item.glass.name +
            ')'
        );
        num++;
      }
    });
    this.getMirrorLengthForInvoiceItems(invoiceItems).forEach((item) => {
      if (item.amount && item.amount > 0) {
        items.push(
          num +
            ') ' +
            getDisplayNumberAsString(item.length) +
            ' ' +
            item.uom +
            ' X ' +
            item.mirror.cashRegisterNumber +
            ' (' +
            item.mirror.name +
            ')'
        );
        num++;
      }
    });
    this.getSandingLengthForInvoiceItems(invoiceItems).forEach((item) => {
      if (item.amount && item.amount > 0) {
        items.push(
          num +
            ') ' +
            getDisplayNumberAsString(item.length) +
            ' ' +
            item.uom +
            ' X ' +
            item.sanding.cashRegisterNumber +
            ' (' +
            item.sanding.name +
            ')'
        );
        num++;
      }
    });
    this.getFacetingLengthForInvoiceItems(invoiceItems).forEach((item) => {
      if (item.amount && item.amount > 0) {
        items.push(
          num +
            ') ' +
            getDisplayNumberAsString(item.length) +
            ' ' +
            item.uom +
            ' X ' +
            item.faceting.cashRegisterNumber +
            ' (' +
            item.faceting.name +
            ')'
        );
        num++;
      }
    });
    return items;
  }

  getInvoiceItemHeader(item: InvoiceItemModel): string {
    let header = '';
    if (item.serviceType === SERVICE_TYPE.FRAMING) {
      if (item.mirror?.oid) {
        header += this.translateService.instant('mirror');
      } else {
        header += this.translateService.instant('picture');
      }
      header += `: ${item.dimensionsWidth} X ${item.dimensionsHeight} ${item.dimensionsUom}`;
    }

    return header;
  }
}
