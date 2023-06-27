import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore, private _auth: AngularFireAuth) { }

  getUser(uid: string) {
    return this.firestore.collection("usuarios").doc(uid).valueChanges();
  }

  updateUser(datosActualizados: any, uid: string) {
    return this.firestore.collection('usuarios').doc(uid).update(datosActualizados);
  }


  generatedCode!: string;

  getGeneratedCode(): string {
    return this.generatedCode;
  }

}
