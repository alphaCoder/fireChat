import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';
@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router, private user:UserService) {
    this.auth.auth$.subscribe((state: FirebaseAuthState) => {
      if (state) {
        this.router.navigate(['']);
      }
    });
  }
  ngOnInit() {
    if(this.auth.authenticated) {
        this.router.navigate(['']);
    }
  }

  login() {
    this.user.login();
  }
}