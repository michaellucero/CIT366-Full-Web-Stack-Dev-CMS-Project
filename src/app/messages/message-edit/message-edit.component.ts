import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender = '1';

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }

  onSendMessage() {
    const subject = this.subject.nativeElement.value;
    const msgText = this.msgText.nativeElement.value;

    // logic to not allow submission unless form input is filled in
    if (msgText.length > 0 && subject.length > 0 ) {

      // later needs to be changed to not be hard coded
      const message = new Message('1', subject, msgText, this.currentSender);
      this.messageService.addMessage(message);

      // reset fields after message submission to start fresh for new input
      this.onClear();
    }
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }
}
