import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class DocumentService {

  private documentsURL = '*** REPLACE WITH Documents URL ***';

  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {

    this.http.get(this.documentsURL).subscribe(
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort( (currentArg, nextArg) => {
          if (currentArg < nextArg) {
            return -1;
          }

          if (currentArg > nextArg) {
            return 1;
          } else {
            return 0;
          }
        });
        this.documentListChangedEvent.next(documents.slice());
      },
    (error: any) => {
        console.log(error);
      }
    );

    return this.documents.slice();
  }

  getDocument(id: string): Document {
    return this.documents.find( (document: Document) => document.id === id);
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }

  getMaxId(): number {
    let maxId = 0;

    this.documents.forEach((document: Document) => {
      const currentID: number = +document.id;

      if (currentID > maxId) {
        maxId = currentID;
      }
    });

    return maxId;
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const position = this.documents.indexOf(originalDocument);
    if (position < 0) {
      return;
    } else {
      newDocument.id = originalDocument.id;
      this.documents[position] = newDocument;
      this.storeDocuments();
    }
  }

  storeDocuments() {
    const jsonDocuments = JSON.stringify(this.documents);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put(this.documentsURL, jsonDocuments, {headers: headers}).subscribe(() => {
      this.documentListChangedEvent.next(this.documents.slice());
    });
  }
}
