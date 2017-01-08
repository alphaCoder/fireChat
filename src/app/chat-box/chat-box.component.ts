import { Component, OnInit, Input, AfterViewChecked, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ChatBoxService } from './chat-box.service';

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
  constructor(private chat: ChatBoxService) { }

  ngOnInit() {
    console.log("opening chatbox for the friend");
    console.log(JSON.stringify(this.friend));
    this.chat.init(this.friend.id, this.friend.displayName, this.friend.photoUrl);
    this.scrollToBottom();
    this.show = true
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  hide() {
    console.log("chatbox hide");
    this.show = false;
    this.destroy.emit(true);
  }
  send() {
    console.log("message,", this.message.trim().length);
    if (this.message.trim().length > 0) {
      //update db,
      console.log("message,", this.message.trim().length);
      this.chat.send(this.message);
      this.message = '';
    }
  }
}
