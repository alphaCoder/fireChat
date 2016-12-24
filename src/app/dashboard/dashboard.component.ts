import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private email:string = '';
  private selectedFriend = null;

  constructor(private dashboard:DashboardService) { }

  ngOnInit() {
  }
  inviteUser() {
    if(this.email.trim().length > 0) { //todo: email validation regex
      this.dashboard.inviteUser(this.email);
      this.email = '';
    }
  }
  onDestroy(destroy) {
    this.selectedFriend = null;
  }
}
