import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private contactsURL = 'contacts';

  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  selectedContactEvent = new EventEmitter<Contact>();
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[] {

    this.http.get<{message: String, contacts: Contact[]}>(this.contactsURL).subscribe(
      (responseData) => {
        this.contacts = responseData.contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort( (currentArg, nextArg) => {
          if (currentArg < nextArg) {
            return -1;
          }

          if (currentArg > nextArg) {
            return 1;
          } else {
            return 0;
          }
        });

        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );

    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    return this.contacts.find( (contact: Contact) => contact.id === id );
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });


    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.http.delete<{message: String}>('http://localhost:3000/contacts/' +
      contact.id, {headers: headers})
      .subscribe(
        () => {
          this.contacts.splice(pos, 1);
          this.contactListChangedEvent.next(this.contacts.slice());
        }
      );
  }

  getMaxId(): number {
    let maxId = 0;

    this.contacts.forEach((contact: Contact) => {
      const currentID: number = +contact.id;

      if (currentID > maxId) {
        maxId = currentID;
      }
    });

    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    newContact.id = '';

    this.http.post<{message: String, contact: Contact}>('http://localhost:3000/contacts', newContact, {headers: headers})
      .subscribe(
        (responseData) => {
          this.contacts.push(responseData.contact);
          this.contactListChangedEvent.next(this.contacts.slice());
        }
      );
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const position = this.contacts.indexOf(originalContact);
    if (position < 0) {
      return;
    } else {
      newContact.id = originalContact.id;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.put<{message: String}>('http://localhost:3000/contacts/' +
      newContact.id, newContact, {headers: headers})
      .subscribe(
        () => {
          this.contacts[position] = newContact;
          this.contactListChangedEvent.next(this.contacts.slice());
        }
      );
  }
}
