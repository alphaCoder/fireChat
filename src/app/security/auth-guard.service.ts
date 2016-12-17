import { Injectable } from '@angular/core';
import 'rxjs';
import { Observable } from 'rxjs/Rx';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { AuthService } from './auth.service';
import { UserService } from './user.service';
@Injectable()
export class AuthGuard implements CanActivate {
  private isAuthenticated: Boolean
  constructor(private auth: AuthService, private router: Router, private user: UserService) { }

  canActivate(): boolean {
    return this.auth.authenticated;
  }
}