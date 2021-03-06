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
  }

  logout() {
    this.auth.signOut();
    this.router.navigate(['login']);
    this.auth.auth$.subscribe((state: any) => {
      if (!state) {
        this.router.navigate(['login']);
      }
    })
  }
}
