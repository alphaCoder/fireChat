import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from '../security/auth.service';
@Injectable()
export class DashboardService {
  public friends: any[] = null;
  private friendsRef: FirebaseListObservable<any[]> = null;
  private firendsInvitationRef : FirebaseListObservable<any[]> = null;
  constructor(private af : AngularFire, private auth:AuthService) {
    this.friendsRef = af.database.list(`friends/${auth.id}`);
    this.firendsInvitationRef = af.database.list(`invitations/${auth.id}`);
    this.friendsRef.subscribe(friends =>{
      console.log("friends");
      console.log(friends);
      this.friends = friends;
          this.friends.forEach(friend => {
         af.database.object(`presence/${friend.id}/status`).subscribe(val =>{
          friend.status = val.$value == null ? 1 : val.$value;
          console.log("status changed", val);
          console.log(friend);
        });
      });
    })
  
    this.firendsInvitationRef.subscribe(friends => {
      console.log("already invited friends");
      console.log(JSON.stringify(friends));
    });

     
  }
  public inviteUser(email:string) {
    //todo: check if the invitation already sent
    this.firendsInvitationRef.push(email);
  }
}
