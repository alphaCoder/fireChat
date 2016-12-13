import { Injectable } from '@angular/core';
import { AngularFire, AngularFireAuth } from 'angularfire2';

@Injectable()
export class UserService {
    private isLoggedIn = false;
    private email:string = null;
    private displayName : string = null;
    private uid : string = null;

    constructor(private af: AngularFire) { }
    public login() {
        if(!this.isLoggedIn) {
        this.af.auth.login().then(user => {
            this.displayName = user.auth.displayName;
            this.email = user.auth.email;
            this.uid = user.auth.uid;
            this.isLoggedIn = true;
        }).catch(e => {
            this.isLoggedIn = false;
        });
        }
    }
}