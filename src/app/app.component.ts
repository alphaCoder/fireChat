import { Component } from '@angular/core';
import { AuthService } from './security/auth.service';
import { UserService } from './security/user.service';
import { PushNotificationsService } from 'angular2-notifications';
import { WindowRefService } from './chat-box/window-ref.service';
import { TitleService } from './title/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private auth : AuthService, private user:UserService, private pushService:PushNotificationsService, private windowRef:WindowRefService, private title:TitleService) {
    this.pushService.requestPermission()
  //  user.attemptAutoLogin();
  windowRef.isActive.subscribe(focus =>{
    console.log("is window is currently active:",focus);
    if(focus) {
      console.log("disabling animation");
      title.Off();
    }
  })
  }
}
