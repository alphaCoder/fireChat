import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TopNavComponent } from './layout/top-nav/top-nav.component';
import { LoginComponent } from './security/login.component';
import { UserService } from './security/user.service';
import { AuthGuard } from './security/auth-guard.service';
import { AuthService } from './security/auth.service';

import { DashboardComponent } from './dashboard/dashboard.component';
const myFirebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Popup
}

var firebaseConfig = {
 
};

const routesModule = RouterModule.forRoot([
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: '', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [AuthGuard] }
  
  /* define app module routes here, e.g., to lazily load a module
     (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
   */
])

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    LoginComponent, DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routesModule,
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    HttpModule
  ],
  providers: [AuthGuard, AuthService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
