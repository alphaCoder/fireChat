import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from '../security/auth.service';
@Injectable()
export class DashboardService {
  public friends: any[] = null;
  private friendsRef: FirebaseListObservable<any[]> = null;
  private friendsInvitationRef: FirebaseListObservable<any[]> = null;
  private friendsRef$;
  private pss$ =[];
  constructor(private af: AngularFire, private auth: AuthService) {
    this.friendsRef = af.database.list(`friends/${auth.id}`);
    this.friendsInvitationRef = af.database.list(`invitations/${auth.id}`);
   let fr$= this.friendsRef.subscribe(friends => {
      this.friends = friends;
      this.friends.forEach(friend => {
       let ps$ =  af.database.object(`presence/${friend.id}/status`).subscribe(val => {
          friend.status = val.$value == null ? 1 : val.$value;
        });
        this.pss$.push(ps$);
      });
    })

   let fr1$ = this.friendsInvitationRef.subscribe(friends => {
      console.log("already invited friends");
      console.log(JSON.stringify(friends));
    });

    this.auth.auth$.subscribe(val=>{
      if(!val) {
        console.log("-----------logout unsubscribe----------------");
        fr$.unsubscribe();
        fr1$.unsubscribe();
        this.pss$.forEach((val)=>{ val.unsubscribe()});
      }
    })
  }

  public inviteUser(email: string) {
    //todo: check if the invitation already sent
    console.log("inviting new user:", email);
    this.friendsInvitationRef.push(email);
  }
}
