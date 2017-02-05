import { Injectable } from '@angular/core';
import { AngularFire, AngularFireAuth, AuthProviders, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

// import { DashboardService } from '../dashboard/dashboard.service';
@Injectable()
export class UserService {
    //todo: maybe delete this service and only rely on auth service
    constructor(private af: AngularFire, private router: Router, private auth: AuthService) { }
    public login(refId: string = null) {
        this.attemptAutoLogin(refId); //todo: deal with other logins here        
    }

    public attemptAutoLogin(refId: string = null) {
        this.af.auth.login(AuthProviders.Google).then(user => {
            console.log("in attemptAutoLogin");
            console.log(user);
            console.log("in refId:" + refId);
            if (refId) {
                this.af.database.object(`refers/${refId}`).subscribe(snap => {
                    if (snap) {
                        console.log('refers--------', snap);
                        this.addFriend(user.uid, snap.RefBy);
                    }
                })
            }

            this.router.navigate(['']);
        }).catch(e => {
            this.router.navigate(['login']);
        });
    }

    private addFriend(uid, refBy) {

        let frndrfu$ = this.af.database.object(`friends/${refBy}/${uid}`).subscribe(snap => {
            console.log("addFriend:");
            console.log(snap);
            let ur$ = null;
            let ru$ = null;
            if (snap) { //need to check other condition
                console.log("inside snap");
                ur$ = this.af.database.object(`Users/${uid}`).subscribe(user => {
                    this.af.database.object(`friends/${refBy}/${uid}`).set({ "id": user.id, "displayName": user.displayName, "email": user.email, "photoUrl": user.photoUrl });
                })
                ru$ = this.af.database.object(`Users/${refBy}`).subscribe(user => {
                    this.af.database.object(`friends/${uid}/${refBy}`).set({ "id": user.id, "displayName": user.displayName, "email": user.email, "photoUrl": user.photoUrl });
                });
            }
            this.auth.auth$.subscribe(val => {
                if (!val) {
                    console.log("-----------logout unsubscribe----------------");
                    frndrfu$.unsubscribe();
                    if (ru$ && ur$) {
                        ru$.unsubscribe();
                        ur$.unsubscribe();
                    }
                }
            })
        })
    }
}