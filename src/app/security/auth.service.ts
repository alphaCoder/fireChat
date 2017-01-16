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
      
      console.log('auth state', state);
      this.authState = state;
      if (this.authState) {
        let userRef = af.database.list('Users')
        console.log("token:", state.auth.getToken());
        userRef.$ref.ref.child(`${state.uid}`).set({ "id": state.uid, "displayName": state.google.displayName, "email": state.google.email, "photoUrl": state.google.photoURL });
        let presenseRef = af.database.list('presence');
        presenseRef.$ref.ref.child(`${state.uid}/status`).set(Status.Online)
        
        af.database.object(`presence/${state.uid}/status`).subscribe(val =>{
          console.log("user presence changed:", val);
        });
        let pp = af.database.object(`presence/${state.uid}/status`);
        pp.$ref.onDisconnect().set(Status.Offline);
        let sessionRef = af.database.list(`presence/${state.uid}/session`);
        sessionRef.push({"loggedInAt" :firebase.database.ServerValue.TIMESTAMP });
        
        userRef.$ref.ref.child(`${state.uid}`).on('value', function (snapshot) {
          this.user = snapshot.val();
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

  signInAnonymously(): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login({
      provider: AuthProviders.Anonymous,
      method: AuthMethods.Anonymous
    })
      .catch(error => console.log('ERROR @ AuthService#signInAnonymously() :', error));
  }

  signInWithGithub(): firebase.Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Github);
  }

  signInWithGoogle(): firebase.Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Google);
  }

  signInWithTwitter(): firebase.Promise<FirebaseAuthState> {
    return this.signIn(AuthProviders.Twitter);
  }

  signOut(): void {
    let presenseRef = this.af.database.list('presence');
        presenseRef.$ref.ref.child(`${this.authState.uid}/status`).set(Status.Offline)
    this.auth$.logout();
  }
}