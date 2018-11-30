import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { ContactService } from '../contacts/contact.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messagesURL = '*** REPLACE WITH Messages URL ***';

  maxMessageId: number;
  messageChangeEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];

  constructor(private http: HttpClient, private contactsService: ContactService) {

    // load contacts if not loaded because messages depend on contacts Id
    if (this.contactsService.contacts.length < 1) {
      this.contactsService.getContacts();
      setTimeout(() => { this.initMessages(); }, 1200);
    } else {
      this.initMessages();
    }
  }


  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message {
    return this.messages.find( (message: Message) => message.id === id );
  }

  addMessage(newMessage: Message) {

    this.maxMessageId++;
    newMessage.id = this.maxMessageId.toString();
    this.messages.push(newMessage);
    this.storeMessages();
  }

  initMessages() {


    this.http.get(this.messagesURL).subscribe(
      (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messages.sort( (currentArg, nextArg) => {
          if (currentArg < nextArg) {
            return -1;
          }

          if (currentArg > nextArg) {
            return 1;
          } else {
            return 0;
          }
        });
        this.messageChangeEvent.next(messages.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );

    return this.messages.slice();

  }

  storeMessages() {
    const jsonMessages = JSON.stringify(this.messages);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put(this.messagesURL, jsonMessages, {headers: headers}).subscribe(() => {
      this.messageChangeEvent.next(this.messages.slice());
    });
  }

  getMaxId(): number {
    let maxId = 0;

    this.messages.forEach((message: Message) => {
      const currentID: number = +message.id;

      if (currentID > maxId) {
        maxId = currentID;
      }
    });

    return maxId;
  }
}
