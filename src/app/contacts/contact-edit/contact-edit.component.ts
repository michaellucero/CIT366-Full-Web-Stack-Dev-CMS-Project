import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {

  invalidGroupContact = false;
  originalContact: Contact = null;
  contact: Contact = null;
  groupContacts: Contact[] = [];
  editMode = false;
  hasGroup = false;


  constructor(private contactService: ContactService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        const id = params.id;

        if (id == null) {
          this.editMode = false;
          return;
        }

        this.originalContact = this.contactService.getContact(id); // or params['id']

        if (this.originalContact == null) {
          return;
        }

        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));

        if (this.contact.group != null) {
          this.groupContacts = this.originalContact.group.slice();
          this.hasGroup = true;

        }
      }
    );
  }

  onSubmit(form: NgForm) {
    const values = form.value;

    if (values.imageUrl == null) {
      values.imageUrl = '';
    }

    const newContact = new Contact('', values.name, values.email, values.phone, values.imageUrl, this.groupContacts);

    if (this.editMode) {

      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  onRemoveItem(idx: number) {
    // if contact is outside the bounds of the array
    console.log(idx);
    if (idx < 0 || idx >= this.groupContacts.length) {
      return;
    }
    console.log(this.groupContacts);

    this.groupContacts.splice(idx, 1);
    this.invalidGroupContact = false;
  }

  // check if contact is already in group
  isInvalidContact(newContact: Contact) {
    console.log(this.activatedRoute);
    if (this.activatedRoute.snapshot.url[0].path === 'new') { // newContact has no value?
      // check if already exists
      for (let i = 0 ; i < this.groupContacts.length ; i++) {
        if (newContact.id === this.groupContacts[i].id) {
          return true;
        }
      }
      return false;
    }

    // check self
    if (newContact.id === this.contact.id) {
      return true;
    }

    // check if already exists
    for (let i = 0 ; i < this.groupContacts.length ; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    console.log(selectedContact, 'selectedContact');
    this.invalidGroupContact = this.isInvalidContact(selectedContact);

    if (this.invalidGroupContact) {
      return;
    }
    this.groupContacts.push(selectedContact);
    this.invalidGroupContact = false;
  }

}
