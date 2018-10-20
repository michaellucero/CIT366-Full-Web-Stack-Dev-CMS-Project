import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { ContactService } from '../../contacts/contact.service';
import { Contact } from '../../contacts/contact.model';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {


  @Input() message: Message;
  messageSender = '';

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    // message sender is an id not a string. This converts id to name.
    const contact: Contact = this.contactService.getContact(this.message.sender);
    this.messageSender = contact.name;
  }

}
