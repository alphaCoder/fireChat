import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { RouterModule } from '@angular/router';
import {MomentModule} from 'angular2-moment';
import { PushNotificationsModule } from 'angular2-notifications';

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

const myFirebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
}

var firebaseConfig = {
  apiKey: "AIzaSyBuz7VHwFn5T6RC7IY8PCXcD8GMAauLJQg",
  authDomain: "firechat-2be6c.firebaseapp.com",
  databaseURL: "https://firechat-2be6c.firebaseio.com",
  storageBucket: "firechat-2be6c.appspot.com"
};

const routesModule = RouterModule.forRoot([
  { path: 'login', component: LoginComponent, pathMatch: 'full', canActivate: [UnauthGuard] },
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo:'dashboard', pathMatch: 'full', canActivate: [AuthGuard] }
  
  /* define app module routes here, e.g., to lazily load a module
     (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
   */
])

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    LoginComponent, DashboardComponent, ChatBoxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routesModule,
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    HttpModule,
    MomentModule,
    PushNotificationsModule
  ],
  providers: [AuthGuard, AuthService, UserService, ChatBoxService, DashboardService, UnauthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
