import { Component, Input,OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent {
  @Input() nombre!: string;


  constructor(private firestoreService: FirestoreService) { }

  productos: any = [];
  productoSeleccionado: any;

  ngOnInit(): void {
    this.recorrerColeccion();
  }

  copyDocument() {
    const originalCollection = 'productos';
    const originalDocumentId = 'Jamon';
    const newCollection = 'productos';
    const newDocumentId = 'Peras';

    this.firestoreService.copyDocument(originalCollection, originalDocumentId, newCollection, newDocumentId);
  }

  async recorrerColeccion(){
    const db = firebase.firestore();
    const collectionRef = db.collection('productos');
    const miArray: firebase.firestore.DocumentData[] = [];
    const querySnapshot = await collectionRef.get();
    ( querySnapshot).forEach((doc) => {
      const data = doc.data();
      miArray.push(data);
      console.log(data);

    });
    this.productos= miArray;

  }

}
