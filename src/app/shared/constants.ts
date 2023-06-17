import { environment } from 'src/environments/environment';

// BASE_API_URL should have value 'http://localhost:8081' in DEVELOPMENT MODE, otherwise empty string ''
// export const BASE_API_URL: string = '';
export const BASE_API_URL: string = environment.baseApiUrl;

export const DOMAIN_BUYERS: string = 'buyers';
export const DOMAIN_COUNTRIES: string = 'countries';
export const DOMAIN_USERS: string = 'users';
export const DOMAIN_INCOMES: string = 'incomes';
export const DOMAIN_OUTCOMES: string = 'outcomes';
export const DOMAIN_CITY: string = 'cities';
export const DOMAIN_IMAGES: string = 'images';
export const DOMAIN_INVOICES: string = 'invoices';
export const DOMAIN_ROLES: string = 'roles';
export const DOMAIN_WORK_ORDERS: string = 'workorders';
export const DOMAIN_HISTORY: string = 'histories';

export const THUMBNAIL_GLASS = 'assets/images/glass_thumbnail.jpg';
export const THUMBNAIL_FRAME = 'assets/images/frames_thumbnail.jpg';
export const THUMBNAIL_PASSPARTU = 'assets/images/passpartu_thumbnail.jpg';
export const THUMBNAIL_MIRROR = 'assets/images/mirror_thumbnail.jpg';
export const THUMBNAIL_FACETING = 'assets/images/faceting_thumbnail.jpg';
export const THUMBNAIL_SANDING = 'assets/images/sanding_thumbnail.jpg';

// Login form content type
export const LOGIN_FORM_CONTENT_TYPE: { 'Content-Type': string } = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

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
