import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IpcService } from 'src/app/shared/services/ipc.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [IpcService],
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router, private ipcService: IpcService) {}

  ngOnInit(): void {}

  navigateTo(url: string): void {
    if (url === 'exit') {
      this.ipcService.send('exitApp');
    } else {
      this.router.navigate([url]);
    }
  }
}
