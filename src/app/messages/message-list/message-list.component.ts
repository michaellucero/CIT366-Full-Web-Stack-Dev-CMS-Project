import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

  // messages: Message;

  messages: Message[] = [
    new Message(
      1,
      'Hello',
      'I hope you are having a good day!',
      'Michael',
    ),
    new Message(
      2,
      'Hello too',
      'I am having a good day',
      'Mr. Man',
    ),
    new Message(
      3,
      'Bye',
      'take care!',
      'Mr. Man',
    )
  ];

  constructor() { }

  ngOnInit() {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
