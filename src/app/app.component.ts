import { Component } from '@angular/core';
import { AuthService } from './security/auth.service';
import { UserService } from './security/user.service';
import { PushNotificationsService } from 'angular2-notifications';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private auth : AuthService, private user:UserService, private pushService:PushNotificationsService) {
    this.pushService.requestPermission()
  //  user.attemptAutoLogin();
  }
}
