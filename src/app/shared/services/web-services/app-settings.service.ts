import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseWebService } from './base-web.service';

@Injectable({
  providedIn: 'root',
})
export class AppSettingsWebService<AppSettings> {
  constructor(public baseWebService: BaseWebService) {}

  getSettings(): Observable<AppSettings> {
    return this.baseWebService.getRequest<AppSettings>('settings');
  }

  updateSettings(data: AppSettings): Observable<AppSettings> {
    return this.baseWebService.putRequest<AppSettings>('settings', data);
  }
}
