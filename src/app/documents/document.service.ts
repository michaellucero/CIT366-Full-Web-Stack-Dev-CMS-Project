import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
@Injectable()
export class DocumentService {

  private documentsURL = 'documents';

  documentListChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments(): Document[] {

    this.http.get<{message: String, documents: Document[]}>(this.documentsURL)
      .subscribe(
      (responseData) => {
        this.documents = responseData.documents;
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

        this.documentListChangedEvent.next(this.documents.slice());
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });


    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.http.delete<{message: String}>('http://localhost:3000/documents/' +
      document.id, {headers: headers})
      .subscribe(
        () => {
          this.documents.splice(pos, 1);
          this.documentListChangedEvent.next(this.documents.slice());
        }
      );
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

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    newDocument.id = '';

    this.http.post<{message: String, document: Document}>('http://localhost:3000/documents', newDocument, {headers: headers})
      .subscribe(
        (responseData) => {
          this.documents.push(responseData.document);
          this.documentListChangedEvent.next(this.documents.slice());
        }
      );
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
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.put<{message: String}>('http://localhost:3000/documents/' +
      newDocument.id, newDocument, {headers: headers})
      .subscribe(
        () => {
          this.documents[position] = newDocument;
          this.documentListChangedEvent.next(this.documents.slice());
        }
      );
  }
}
