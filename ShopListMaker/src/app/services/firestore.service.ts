import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore, private _auth: AngularFireAuth) { }

  copyDocument(originalCollection: string, originalDocumentId: string, newCollection: string, newDocumentId: string) {
    const originalDocRef = this.firestore.collection(originalCollection).doc(originalDocumentId);
    const newDocRef = this.firestore.collection(newCollection).doc(newDocumentId);

    originalDocRef.get().subscribe(doc => {
      if (doc.exists) {
        const data = doc.data();
        newDocRef.set(data);
      } else {
        console.log('El documento original no existe.');
      }
    }, error => {
      console.error('Error al copiar el documento:', error);
    });
  }

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
