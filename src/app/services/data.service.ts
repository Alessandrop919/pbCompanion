import { Injectable } from '@angular/core';
import { collectionData, doc, docData, Firestore, updateDoc, addDoc, collection, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Note{
  id?: string; //? means parameter is optional
  testField1: string;
  testField2: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore : Firestore) { }

  getNotes(): Observable<Note[]>{ //returns whole collection as array
    const notesReference = collection(this.firestore,'notes');
    return collectionData(notesReference, { idField :'id'}) as Observable<Note[]>;
  }

  getNoteById(id): Observable<Note>{ //returns whole collection as array
    const noteDocReference = doc(this.firestore,'notes/${id}');
    return docData(noteDocReference, { idField :'id'}) as Observable<Note>;
  }

  addNote(note:Note){
    const notesReference = collection(this.firestore,'notes');
    return addDoc(notesReference,note);
  }

  deleteNote(note:Note){
    const noteDocReference = doc(this.firestore,'notes.id');
    return deleteDoc(noteDocReference);
  }

  updateNote(note:Note){
    const noteDocReference = doc(this.firestore,'notes.id');
    return updateDoc(noteDocReference,{testField1: note.testField1, testField2:note.testField2});
  }
}
