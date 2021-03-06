import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { RouterModule } from '@angular/router';
import {MomentModule} from 'angular2-moment';
import { PushNotificationsModule } from 'angular2-notifications';
import { LinkyModule } from 'angular2-linky';
import { EmojiModule } from 'angular2-emoji';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { AppComponent } from './app.component';
import { TopNavComponent } from './layout/top-nav/top-nav.component';
import { LoginComponent } from './security/login.component';
import { UserService } from './security/user.service';
import { UnauthGuard } from './security/unauth-guard.service';
import { AuthGuard } from './security/auth-guard.service';
import { AuthService } from './security/auth.service';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardService } from './dashboard/dashboard.service';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { ChatBoxService } from './chat-box/chat-box.service';
import { WindowRefService } from './chat-box/window-ref.service';
import { TitleService } from './title/title.service';

import { KeysPipe } from './shared/keys.pipe';
import { InviteUserComponent } from './shared/invite-user.component';
const myFirebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Popup
}

var firebaseConfig = {
  apiKey: "AIzaSyBuz7VHwFn5T6RC7IY8PCXcD8GMAauLJQg",
  authDomain: "firechat-2be6c.firebaseapp.com",
  databaseURL: "https://firechat-2be6c.firebaseio.com",
  storageBucket: "firechat-2be6c.appspot.com"
};

const routesModule = RouterModule.forRoot([
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'login/:id', component: LoginComponent, pathMatch: 'full', canActivate: [UnauthGuard] },
  { path: 'login', component: LoginComponent, pathMatch: 'full', canActivate: [UnauthGuard] },
  { path: '', redirectTo:'dashboard', pathMatch: 'full', canActivate: [AuthGuard] }
  
  /* define app module routes here, e.g., to lazily load a module
     (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
   */
], {useHash: true})

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    LoginComponent, DashboardComponent, ChatBoxComponent, InviteUserComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routesModule,
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    HttpModule,
    MomentModule,
    PushNotificationsModule,
    LinkyModule,
    EmojiModule,
    Ng2Bs3ModalModule
  ],
  providers: [AuthGuard, AuthService, UserService, ChatBoxService, DashboardService, UnauthGuard,  { provide: "windowObject", useValue: window}, WindowRefService, TitleService],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
