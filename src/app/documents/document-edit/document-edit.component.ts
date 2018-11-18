import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document = null;
  document: Document = null;
  editMode = false;

  constructor(private  documentService: DocumentService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        const id = params.id;
        console.log(id);
        // no id for document then return
        if (id == null) {
          this.editMode = false;
          return;
        }

        this.originalDocument = this.documentService.getDocument(params.id); // or params['id']

        if (this.originalDocument == null) {
          return;
        }

        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      }
    );
  }

  onSubmit(form: NgForm) {
    const values = form.value;

    const newDocument = new Document('', values.title, values.description, values.documentUrl, []);

    if (this.editMode) {

      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    this.router.navigate(['/documents']);
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }
}
