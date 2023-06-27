import { environment } from 'src/environments/environment';

// BASE_API_URL should have value 'http://localhost:8081' in DEVELOPMENT MODE, otherwise empty string ''
// export const BASE_API_URL: string = '';
export const BASE_API_URL: string = environment.baseApiUrl;

export const DOMAIN_BUYERS: string = 'buyers';
export const BARCODE_PREFIX: string = 'StakloRamPlusBackaPalankaRacunBroj';

export const THUMBNAIL_GLASS = 'assets/images/glass_thumbnail.jpg';
export const THUMBNAIL_FRAME = 'assets/images/frames_thumbnail.jpg';
export const THUMBNAIL_PASSPARTU = 'assets/images/passpartu_thumbnail.jpg';
export const THUMBNAIL_MIRROR = 'assets/images/mirror_thumbnail.jpg';
export const THUMBNAIL_FACETING = 'assets/images/faceting_thumbnail.jpg';
export const THUMBNAIL_SANDING = 'assets/images/sanding_thumbnail.jpg';

export const NUMBER_OF_ITEMS_ON_PAGE: number = 50;

////////////////////////////////////////////////////////////////////////
export enum SERVICE_TYPE {
  FRAMING = 'framing',
}

export enum UOM {
  CENTIMETER = 'cm',
  CENTIMETER2 = 'cm2',
  MILIMETER = 'mm',
  MILIMETER2 = 'mm2',
  METER = 'm',
  METER2 = 'm2',
  NUMBER = 'num',
  PIECES = 'kom',
}

export enum QRCodeErrorCorrectionLevel {
  SMALL_levelL = 'L',
  MEDIUM_levelM = 'M',
  LARGE_levelQ = 'Q',
  EXTRALARGE_levelH = 'H',
}

export enum DateFormat {
  DAY_MONTH_YEAR_DOT = 'dd.MM.yyyy',
  DAY_MONTH_YEAR_CROSS = 'dd/MM/yyyy',
  MONTH_DAY_YEAR_DOT = 'MM.dd.yyyy',
  MONTH_DAY_YEAR_CROSS = 'MM/dd/yyyy',
}

export function getDateFormatEnumByKey(key?: string): DateFormat | undefined {
  let value;
  if (key) {
    value = (DateFormat as Record<string, DateFormat>)[key];
  }
  return value;
}

export function getQRCodeErrorCorrectionLevelEnumByKey(
  key?: string
): QRCodeErrorCorrectionLevel | undefined {
  let value;
  if (key) {
    value = (
      QRCodeErrorCorrectionLevel as Record<string, QRCodeErrorCorrectionLevel>
    )[key];
  }
  return value;
}
