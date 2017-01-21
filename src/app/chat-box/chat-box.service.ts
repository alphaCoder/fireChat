import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Message } from './message.model';
import { AuthService } from '../security/auth.service';
import * as firebase from 'firebase'
import { PushNotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs/Rx';
import { WindowRefService } from './window-ref.service';
import { TitleService } from '../title/title.service';

@Injectable()
export class ChatBoxService {
  private uid: string = null;
  private friends = null
  public toUid: string = null;
  public messages: any[] = [];
  public messageKey: string = null;
  public users: any = {};
  public messagesRef: FirebaseListObservable<any[]> = null;
  private friendRef: FirebaseObjectObservable<any> = null;
  //private readRef: FirebaseObjectObservable<any> = null;
  private lastReadAt: any = null;
  private notify;
  private lastAddedMsg:Message = null;
  private lastMsgKey:string = null;
  constructor(private af: AngularFire, private auth: AuthService, private push: PushNotificationsService, private windowRef: WindowRefService, private ts: TitleService) {
  }

  public init(toUid: string, displayName: string, photoUrl: string) {
    this.uid = this.auth.id;
    this.toUid = toUid;
    this.users[this.uid] = { displayName: this.auth.displayName, photoUrl: this.auth.photoUrl };
    this.users[this.toUid] = { displayName: displayName, photoUrl: photoUrl };
    this.messageKey = (this.uid.localeCompare(this.toUid) == -1) ? (this.uid + ':' + this.toUid) : (this.toUid + ':' + this.uid);
    var self = this;

    this.messagesRef = this.af.database.list(`messages/${this.messageKey}`,
      {
        query: {
          orderByChild: 'time',
          limitToLast: 10
        }
      }
    );
    this.windowRef.isActive.subscribe(focus => {
      // if (!focus) {
      //   this.lastReadAt = null;
      //   this.readRef.set({ 'read': 0, 'readAt': null })
      // }
    })


    this.af.database.list(`messages/${this.messageKey}`).$ref.limitToLast(1).on('child_added', msg => {
      console.log('child_added');
      this.lastAddedMsg = msg.val();
      this.lastMsgKey = msg.key;
      console.log(msg.key);
      console.log('val', msg.val());
      const newMsg = msg.val();
      if (!this.messages) {
        this.messages = [];
      }
      if (newMsg.from != this.uid) {
        if (!this.windowRef.hasFocus) {
          this.ts.setTitle(newMsg.message).marquee();
        }
        if (!this.windowRef.hasFocus) {
          this.push.create(displayName, { body: 'sent you a new message' }).subscribe(
            res => { console.log("in push notifications"); console.log(res) },
            err => console.log(err)
          )
        }
      }
      this.messages.push(newMsg);
    })
    this.messagesRef.first().subscribe(messages => {
      this.messages = messages;
      console.log('messagesRef');
      console.log(this.messages);
    })
    this.friendRef = this.af.database.object(`friends/${this.toUid}/${this.uid}`);
    this.af.database.list(`messages/${this.messageKey}`).$ref.on('child_changed', msg =>{
      console.log("lisiting to child_changed", msg.val(), this.messages.indexOf(msg.val()));
      this.messages[this.messages.length-1].read = msg.val().read;
      this.messages[this.messages.length-1].readAt = msg.val().readAt;
      //  this.messages.filter(x=>x.time == msg.val().time).map(x=>{
      //   console.log("inside filter", x);

      //   const m:Message = msg.val();
      //   this.messages[this.messages.indexOf(x)].read = m.read;
      //   this.messages[this.messages.indexOf(x)].readAt = m.readAt
      // });
    })
  }

  public read() {
    console.log('read');
    if(this.lastMsgKey && this.lastAddedMsg && this.lastAddedMsg.to == this.uid && !this.lastAddedMsg.read) {
      const lastkey = 'messages/' + this.messageKey+ '/' + this.lastMsgKey;
      console.log('lastkey:',)
      this.af.database.object(lastkey+'/'+'read').set(true);
      this.af.database.object(lastkey+'/'+'readAt').set(firebase.database.ServerValue.TIMESTAMP);
    }
    // this.readRef.set({'read': 1, 'readAt': firebase.database.ServerValue.TIMESTAMP})
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
