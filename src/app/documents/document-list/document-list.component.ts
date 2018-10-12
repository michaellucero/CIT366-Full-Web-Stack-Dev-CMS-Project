import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  @Output() selectedDocumentEvent = new EventEmitter();

  documents: Document[] = [
    new Document(
      '1',
      'Test Benchmark',
      'Testing the level of starting knowledge in programing ',
      'https://web.byui.edu/someDoc/test.doc',
      null
    ),
    new Document(
      '2',
      'Intro',
      'This is an intro lesson to programming principals',
      'https://web.byui.edu/someDoc/Intro.doc',
      null
    ),
    new Document(
      '3',
      'Section 2',
      'This is the second lesson to programming principals',
      'https://web.byui.edu/someDoc/section2.doc',
      null
    ),
    new Document(
      '4',
      'Section 3',
      'This is the third lesson to programming principals',
      'https://web.byui.edu/someDoc/section3.doc',
      null
    ),
    new Document(
      '2',
      'Final',
      'This is the final lesson to programming principals',
      'https://web.byui.edu/someDoc/final.doc',
      null
    ),
  ];

  constructor() { }

  ngOnInit() {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
