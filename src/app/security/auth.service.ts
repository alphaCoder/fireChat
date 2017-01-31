import { Injectable } from '@angular/core';
import { AuthProviders, AuthMethods, FirebaseAuth, FirebaseAuthState, AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { Router } from '@angular/router';
import * as firebase from 'firebase'
export enum Status {
  Online,
  Offline,
  Busy
}

@Injectable()
export class AuthService {
  private authState: FirebaseAuthState = null;
  public user: any = null;
  constructor(public auth$: FirebaseAuth, private router: Router, private af: AngularFire) {

    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
      if (this.authState) {
        let userRef = af.database.list('Users')
        if (state && state.google.displayName) {
          userRef.$ref.ref.child(`${state.uid}`).set({ "id": state.uid, "displayName": state.google.displayName, "email": state.google.email, "photoUrl": state.google.photoURL });
        }
        //this will keep track of number of users who logged in currently
        let presenseRef = af.database.list('presence');
        presenseRef.$ref.ref.child(`${state.uid}/status`).set(Status.Online)

        let pp = af.database.object(`presence/${state.uid}/status`);
        pp.$ref.onDisconnect().set(Status.Offline);

        //this keeps track of users sessions
        let sessionRef = af.database.list(`presence/${state.uid}/session`);
        sessionRef.push({ "loggedInAt": firebase.database.ServerValue.TIMESTAMP });

        //this can be replaced with observable/subscribe 
        var self = this;
        userRef.$ref.ref.child(`${state.uid}`).on('value', function (snapshot) {
          self.user = snapshot.val();
        })
      }
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get id(): string {
    return this.authenticated ? this.authState.uid : '';
  }
  get displayName(): string {
    return this.authenticated ? this.authState.google.displayName : '';
  }

  get photoUrl(): string {
    return this.authenticated ? this.authState.google.photoURL : '';
  }


  signIn(provider: number): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login({ provider })
      .catch(error => console.log('ERROR @ AuthService#signIn() :', error));
  }

  signInWithGoogle(): firebase.Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Google);
  }

  signOut(): void {
    let presenseRef = this.af.database.list('presence');
    presenseRef.$ref.ref.child(`${this.authState.uid}/status`).set(Status.Offline)
    this.auth$.logout();
  }
}