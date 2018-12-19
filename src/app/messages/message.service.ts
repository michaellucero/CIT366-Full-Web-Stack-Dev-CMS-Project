import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { ContactService } from '../contacts/contact.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private messagesURL = 'messages';

  maxMessageId: number;
  messageChangeEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];

  constructor(private http: HttpClient, private contactsService: ContactService) {

    // load contacts if not loaded because messages depend on contacts Id
    if (this.contactsService.contacts.length < 1) {
      this.contactsService.getContacts();
      setTimeout(() => { this.getMessages(); }, 2500);
    } else {
      this.getMessages();
    }
  }


  getMessages(): Message[] {

    this.http.get<{message: String, messages: Message[]}>(this.messagesURL).subscribe(
      (responseData) => {
        this.messages = responseData.messages;
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

        this.messageChangeEvent.next(this.messages.slice());
      },
      (error: any) => {
        console.log(error);
      });

    return this.messages.slice();
  }

  getMessage(id: string): Message {
    return this.messages.find( (message: Message) => message.id === id );
  }

  addMessage(newMessage: Message) {

    if (!newMessage) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    newMessage.id = '';

    this.http.post<{mess: String, message: Message}>('http://localhost:3000/messages', newMessage, {headers: headers})
      .subscribe(
        (responseData) => {
          this.messages.push(responseData.message);
          this.messageChangeEvent.next(this.messages.slice());
        }
      );
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
