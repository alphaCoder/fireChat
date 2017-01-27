import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Message } from './message.model';
import { AuthService } from '../security/auth.service';
import * as firebase from 'firebase'
import { PushNotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs/Rx';
import { WindowRefService } from './window-ref.service';
import { TitleService } from '../title/title.service';
//declare var moment;
import * as moment from "moment";


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
  private lastAddedMsg:Message = null;
  private lastMsgKey:string = null;
  public messageBucket = {};
  constructor(private af: AngularFire, private auth: AuthService, private push: PushNotificationsService, 
              private windowRef: WindowRefService, private ts: TitleService) {  }

  public init(toUid: string, displayName: string, photoUrl: string) {
    this.uid = this.auth.id;
    this.toUid = toUid;
   
    this.users[this.uid] = { displayName: this.auth.displayName, photoUrl: this.auth.photoUrl };
    this.users[this.toUid] = { displayName: displayName, photoUrl: photoUrl };
   
    this.messageKey = (this.uid.localeCompare(this.toUid) == -1) ? (this.uid + ':' + this.toUid) : (this.toUid + ':' + this.uid);
    this.friendRef = this.af.database.object(`friends/${this.toUid}/${this.uid}`);
   
    this.messagesRef = this.buildMsgQuery();
    this.onChildAdded(displayName);

    //this retrieves 10 messages for first time
    this.messagesRef.first().subscribe(messages => {
      this.messages = messages;
      this.buildMessageBucket(messages);
    })
    this.onChildChanged();
  }

  private buildMsgQuery() :FirebaseListObservable<any[]> {
     return this.af.database.list(`messages/${this.messageKey}`,
      {
        query: {
          orderByChild: 'time',
          limitToLast: 50
        }
      }
    );
  }

  private onChildAdded(displayName) {
     //whenever a new message is added a notification sent
    this.af.database.list(`messages/${this.messageKey}`).$ref.limitToLast(1).on('child_added', msg => {
      this.lastAddedMsg = msg.val();
      this.lastMsgKey = msg.key;
      
      const newMsg = msg.val();
      if (!this.messages) {
        this.messages = [];
      }
      if (newMsg.from != this.uid) {
        if (!this.windowRef.hasFocus) {
          this.ts.setTitle("(1)");
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
  }

  private onChildChanged() {
      this.af.database.list(`messages/${this.messageKey}`).$ref.on('child_changed', msg =>{
      this.messages[this.messages.length-1].read = msg.val().read;
      this.messages[this.messages.length-1].readAt = msg.val().readAt;
    })
  }

  private buildMessageBucket(messages:any[]) {
    var obs = Observable.from(messages)
    .groupBy(x=> moment(x.time).format("MM-DD-YYYY"))
       .flatMap(group =>
       {
          var obj = {};
          obj["key"] = group.key;
          obj["values"] = group.reduce((acc, curr) => [...acc, ...curr], []);
          return Observable.of(obj);
       });
       
    obs.subscribe(gp =>{
      gp["values"].subscribe(messages =>{
        this.messageBucket[gp.key] = messages;
      });
    })
  }

  public read() {
    if(this.lastMsgKey && this.lastAddedMsg && this.lastAddedMsg.to == this.uid && !this.lastAddedMsg.read) {
      const lastkey = 'messages/' + this.messageKey+ '/' + this.lastMsgKey;
      this.af.database.object(lastkey+'/'+'read').set(true);
      this.af.database.object(lastkey+'/'+'readAt').set(firebase.database.ServerValue.TIMESTAMP);
    }
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
