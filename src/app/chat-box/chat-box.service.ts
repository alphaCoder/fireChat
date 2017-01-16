import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Message } from './message.model';
import { AuthService } from '../security/auth.service';
import * as firebase from 'firebase'
import { PushNotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ChatBoxService {
  private uid: string = null;
  private friends = null
  public toUid: string = null;
  public messages: any[] = null;
  public messageKey: string = null;
  public users: any = {};
  public messagesRef: FirebaseListObservable<any[]> = null;
  private friendRef: FirebaseObjectObservable<any> = null;
  private notify;
  public windowHasFocus: boolean = false;

  constructor(private af: AngularFire, private auth: AuthService, private push: PushNotificationsService) {
  }

  public init(toUid: string, displayName: string, photoUrl: string) {
    this.uid = this.auth.id;
    this.toUid = toUid;
    this.users[this.uid] = { displayName: this.auth.displayName, photoUrl: this.auth.photoUrl };
    this.users[this.toUid] = { displayName: displayName, photoUrl: photoUrl };
    const messageKey = (this.uid.localeCompare(this.toUid) == -1) ? (this.uid + ':' + this.toUid) : (this.toUid + ':' + this.uid);
    var self = this;

    this.messagesRef = this.af.database.list(`messages/${messageKey}`,
      {
        query: {
          orderByChild: 'time',
          limitToLast:50
        }
      }
    );
    this.messagesRef.subscribe(messages => {
      this.messages = messages;

      console.log("this.windowHasFocus", this.windowHasFocus);

      if (messages[messages.length - 1].from != this.uid) {
        this.push.create(displayName, { body: 'sent you a new message' }).subscribe(
          res => { console.log("in push notifications"); console.log(res) },
          err => console.log(err)
        )
      }
    })
    this.friendRef = this.af.database.object(`friends/${this.toUid}/${this.uid}`);
  }

  public send(message: string) {
    let msg = new Message();
    msg.from = this.uid;
    msg.to = this.toUid;
    msg.message = message;
    msg.time = firebase.database.ServerValue.TIMESTAMP;

    this.messagesRef.push(msg);
  }
  public setTyping(isTyping: boolean) {
    this.friendRef.$ref.update({ typing: isTyping });
  }
}
