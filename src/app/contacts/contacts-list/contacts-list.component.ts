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

   constructor(private contactService: ContactService) {
     this.contacts = contactService.getContacts();
   }

   ngOnInit() {
     this.subscription = this.contactService.contactListChangedEvent.subscribe(
       (contactList: Contact[]) => {
         this.contacts = contactList;
       }
     );

     // this.contactService.contactsChangedEvent.subscribe((contacts: Contact[]) => {
     //   this.contacts = contacts;
     // });
   }

   ngOnDestroy() {
     this.subscription.unsubscribe();
   }
}
