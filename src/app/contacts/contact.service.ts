import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private contactsURL = '*** REPLACE WITH Contacts URL ***';

  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  selectedContactEvent = new EventEmitter<Contact>();
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[] {

    this.http.get(this.contactsURL).subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
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

        this.contactListChangedEvent.next(contacts.slice());
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

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    this.storeContacts();
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

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts();
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
      this.contacts[position] = newContact;
      this.storeContacts();
    }
  }

  storeContacts() {
    const jsonContacts = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put(this.contactsURL, jsonContacts, {headers: headers}).subscribe(() => {
      this.contactListChangedEvent.next(this.contacts.slice());
    });
  }
}
