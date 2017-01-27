import { Component, OnInit, Input, AfterViewChecked, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { FirebaseObjectObservable, AngularFire } from 'angularfire2';
import { ChatBoxService } from './chat-box.service';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../security/auth.service';

@Component({
  selector: 'chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {
  @Input("friend") friend: any = null;
  public message: string = null;
  @Input("show") show: boolean = true;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @Output() destroy: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  private friendUser: any = null;
  private friendTypingRef: FirebaseObjectObservable<any> = null;

  constructor(private chat: ChatBoxService, private elementRef: ElementRef, private auth: AuthService, private af: AngularFire) {

    Observable.fromEvent(elementRef.nativeElement, 'keyup')
      .map(() => this.message)
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(x => {
        if (x.length == 0) {
          this.chat.setTyping(false);
        }
        else {
          this.chat.setTyping(true)
        }
      });
 }

  ngOnInit() {
    this.friend.typing = false;
    this.scrollToBottom();
    this.show = true
    this.af.database.object(`Users/${this.friend.id}`).subscribe(frnd => {
      this.friendUser = frnd;
      this.chat.init(this.friendUser.id, this.friendUser.displayName, this.friendUser.photoUrl);
    })
    this.friendTypingRef = this.af.database.object(`friends/${this.auth.id}/${this.friend.id}/typing`);
    this.friendTypingRef.subscribe(val => {
      this.friend.typing = val.$value;
    })
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  setFocus(focus: boolean) {
    this.chat.read();
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  hide() {
    this.show = false;
    this.destroy.emit(true);
  }

  send() {

    if (this.message.trim().length > 0) {
      this.chat.send(this.message);
      this.chat.setTyping(false);
      this.message = '';
    }
  }
}
