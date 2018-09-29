import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.css']
})
export class ContactsListComponent implements OnInit {
  contacts: Contact[] = [
    new Contact(
      1,
      'Bro. Jackson',
      'jacksonk@byui.edu',
      '208-496-3771',
      'https://web.byui.edu/Directory/Employee/jacksonk.jpg',
      null
    ),
    new Contact(
      2,
      'Bro. Thayne',
      'thayneti@byui.edu',
      '208-496-3777',
      'https://web.byui.edu/Directory/Employee/thayneti.jpg',
      null
    )
  ];
  constructor() { }

  ngOnInit() {
  }

}
