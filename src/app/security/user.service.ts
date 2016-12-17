import { Injectable } from '@angular/core';
import { AngularFire, AngularFireAuth, AuthProviders } from 'angularfire2';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
    //todo: maybe delete this service and only rely on auth service
    constructor(private af: AngularFire, private router: Router) { }
    public login() {
        this.attemptAutoLogin(); //todo: deal with other logins here        
    }

    public attemptAutoLogin() {
        this.af.auth.login(AuthProviders.Google).then(user => {
            this.router.navigate(['']);
        }).catch(e => {
            this.router.navigate(['login']);
        });
    }
}