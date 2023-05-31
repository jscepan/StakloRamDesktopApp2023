import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Router } from '@angular/router';
// import { TranslateService } from '@ngx-translate/core';
// import { GlobalService } from 'src/app/shared/services/global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [],
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router // private globalService: GlobalService, // private router: Router,
  ) // private translateService: TranslateService
  {}

  ngOnInit(): void {}

  navigateTo(url: string): void {
    if (url === 'exit') {
      // this.ipcService.send('exitApp');
    } else {
      this.router.navigate([url]);
    }
  }
}
