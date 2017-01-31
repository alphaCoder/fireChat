import { Component, OnInit, Input, AfterViewChecked, ElementRef, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { FirebaseObjectObservable, AngularFire } from 'angularfire2';
import { ChatBoxService } from './chat-box.service';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../security/auth.service';
declare var $;
declare var EmojiPicker;
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

  constructor(private chat: ChatBoxService, private elementRef: ElementRef, private auth: AuthService, private af: AngularFire, @Inject("windowObject") window: Window) {

    Observable.fromEvent(elementRef.nativeElement, 'keyup')
      .map(() => this.message)
      .debounceTime(250)
      .distinctUntilChanged()
      .subscribe(x => {
        if (!x || x.length == 0) {
          this.chat.setTyping(false);
        }
        else {
          this.chat.setTyping(true)
        }
      });
  }

  ngOnInit() {
    this.friend.typing = false;
    // this.scrollToBottom();
    this.show = true
    let uf$ = this.af.database.object(`Users/${this.friend.id}`).subscribe(frnd => {
      this.friendUser = frnd;
      this.chat.init(this.friendUser.id, this.friendUser.displayName, this.friendUser.photoUrl);
    })
    this.friendTypingRef = this.af.database.object(`friends/${this.auth.id}/${this.friend.id}/typing`);
    let ft$ = this.friendTypingRef.subscribe(val => {
      this.friend.typing = val.$value;
    })

    this.auth.auth$.subscribe(state => {
      if (!state) {
        console.log("--------logout-------------1");
        uf$.unsubscribe();
        ft$.unsubscribe();
      }
    })
  }

  ngAfterViewChecked() {
    //this.scrollToBottom();
    $("#chat").scrollTop($("#chat")[0].scrollHeight);
    // Initializes and creates emoji set from sprite sheet
    (window as any).emojiPicker = new EmojiPicker({
      emojiable_selector: '[data-emojiable=true]',
      assetsPath: 'assets/emoji/img/',
      popupButtonClasses: 'fa fa-smile-o'
    });
    // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
    // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
    // It can be called as many times as necessary; previously converted input fields will not be converted again
    (window as any).emojiPicker.discover();
    $('.emoji-wysiwyg-editor').keyup(function (e) {
      console.log("key press---");
      //  console.log(this.val());
    })
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
    console.log("--message---:", this.message);
    if (this.message && this.message.trim().length > 0) {
      this.chat.send(this.message);
      this.chat.setTyping(false);
      this.message = '';
    }
  }
}
