import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../security/auth.service';
import { Router } from '@angular/router';
import { FirebaseAuthState } from 'angularfire2';
@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent {
  private displayName: string;
  constructor(private auth: AuthService, private router: Router) {
    this.auth.auth$.subscribe((state: FirebaseAuthState) => {
      if (state) {
        this.displayName = state.google.displayName;
      }
    });
  }

  logout() {
    this.auth.signOut();
    this.auth.auth$.subscribe((state: any) => {
      if (!state) {
        this.router.navigate(['login']);
      }
    })
  }
}
