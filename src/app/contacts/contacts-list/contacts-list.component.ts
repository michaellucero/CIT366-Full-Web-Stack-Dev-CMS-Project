import { Component, OnDestroy, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
   selector: 'app-contacts-list',
   templateUrl: './contacts-list.component.html',
   styleUrls: ['./contacts-list.component.css'],
})
export class ContactsListComponent implements OnInit, OnDestroy {

   subscription: Subscription;
   contacts: Contact[] = [];
   term = '';


   constructor(private contactService: ContactService) {
     this.contacts = contactService.getContacts();
   }

   ngOnInit() {
     this.subscription = this.contactService.contactListChangedEvent.subscribe(
       (contactList: Contact[]) => {
         this.contacts = contactList;
       }
     );
   }

   ngOnDestroy() {
     this.subscription.unsubscribe();
   }

   onKeyPress(value: string) {
     this.term = value;
   }

   search(value: string) {
     this.onKeyPress(value);
   }
}
