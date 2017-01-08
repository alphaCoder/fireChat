import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Message } from './message.model';
import { AuthService } from '../security/auth.service';
import * as firebase from 'firebase'
@Injectable()
export class ChatBoxService {
  private uid:string = null;
  private friends = null
  public toUid:string = null;
  public messages: any[] = null;
  public messageKey : string = null;
  public users : any = {};
  private messagesRef : FirebaseListObservable<any[]> =null;
  private notify;
  constructor(private af:AngularFire, private auth:AuthService) {
  //   this.notify =  this.debounce(function(title, txt) {
	// 	if (windowHasFocus) return;
	// 	let n = createNotification(title, {
	// 		body: txt,
	// 		icon: 'bolt2.png'
	// 	})		
	// 	if (n) {
	// 		setTimeout(function() {
	// 			n.close();
	// 		}, 9600); // 2600
	// 	}
	// }, 500);
  }

  public init(toUid:string, displayName:string, photoUrl:string) {
    this.uid = this.auth.id;
    this.toUid = toUid;
    this.users[this.uid] = { displayName: this.auth.displayName, photoUrl: this.auth.photoUrl };
    this.users[this.toUid] = { displayName: displayName, photoUrl: photoUrl };
    const messageKey =(this.uid.localeCompare(this.toUid) == -1)? (this.uid + ':' + this.toUid) :(this.toUid + ':' + this.uid) ;
    this.messagesRef = this.af.database.list(`messages/${messageKey}`);
    this.messagesRef.subscribe(messages => {
      this.messages = messages;
    })

    console.log("users");
    console.log(JSON.stringify(this.users));
  }
  
  public send(message:string) {
    let msg = new Message();
    msg.from = this.uid;
    msg.to = this.toUid;
    msg.message = message;
    msg.time =  firebase.database.ServerValue.TIMESTAMP;
    
    this.messagesRef.push(msg);
  }
  public setTyping(isTyping:boolean) {

  }

 private debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};



}
