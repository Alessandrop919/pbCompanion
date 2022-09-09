import { Injectable } from '@angular/core';
import { collectionData, doc, docData, Firestore, updateDoc, addDoc, collection, deleteDoc } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
import { getDownloadURL, getStorage } from 'firebase/storage';
import { ref, Storage } from '@angular/fire/storage';

export interface Content{
  id?: string; 
  Description: string;
  Date: string;
  Image: string;
  Title: string;
}

export interface User{
  id: string;
  Kills: number;
  Death: number;
  TravelDist: number;
  Xp: number;
  imageUrl: string;
  Nickname: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore : Firestore, private storage:Storage) { }

  getHomeContents(): Observable<Content[]>{ 
    const ContentsReference = collection(this.firestore,'HomeContents');
    let coll= collectionData(ContentsReference, { idField :'id'}) as Observable<Content[]>;    
    const newColl= coll.pipe(
      map(contents => {
        for(let i=0;i<contents.length;i++){
          let content=contents[i];
          let pathReference=ref(this.storage,content.Image);   
          getDownloadURL(pathReference).then((url) => {content.Image=url;});          
        }
        contents.sort((content1,content2)=>{
          if(Number(content1.id)>Number(content2.id))return -1;
          if(Number(content1.id)<Number(content2.id))return 1;
          return 0;
        })
        return contents;
      })
    );
    return newColl ;
  }

  getLeaderboardsUsers(){
    const ContentsReference = collection(this.firestore,'users');
    let coll= collectionData(ContentsReference, { }) as Observable<User[]>;    
    return coll;
  }

  getContentById(id): Observable<Content>{ 
    const ContentDocReference = doc(this.firestore,'HomeContents/${id}');
    return docData(ContentDocReference, { idField :'id'}) as Observable<Content>;
  }

  addContent(Content:Content){
    const ContentsReference = collection(this.firestore,'HomeContents');
    return addDoc(ContentsReference,Content);
  }

  deleteContent(Content:Content){
    const ContentDocReference = doc(this.firestore,'HomeContents.id');
    return deleteDoc(ContentDocReference);
  }

  updateContent(Content:Content){
    const ContentDocReference = doc(this.firestore,'HomeContents.id');
    return updateDoc(ContentDocReference,{Description: Content.Description, Date:Content.Date});
  }
}
