import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseAuthState } from 'angularfire2';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './user.service';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private refId: string = null;
  constructor(private auth: AuthService, private router: Router, private user:UserService, private route: ActivatedRoute) {
    this.refId = this.route.snapshot.params['id'];
    console.log("params id", this.refId);
    if(!this.refId) {
    this.auth.auth$.subscribe((state: FirebaseAuthState) => {
      if (state) {
        this.router.navigate(['']);
      }
    });
    }
  }
  ngOnInit() {
    if(this.auth.authenticated) {
        this.router.navigate(['']);
    }
  }

  login() {
    this.user.login(this.refId);
  }
}