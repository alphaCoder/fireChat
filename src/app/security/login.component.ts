import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {
    this.auth.auth$.subscribe((state: FirebaseAuthState) => {
      if (state) {
        this.router.navigate(['']);
      }
    });
  }

  login() {
    this.auth.signInWithGoogle().then(x => {
      console.log(x);
    });
  }
  ngOnInit() {
    //this.router.navigate(['']);
  }
}