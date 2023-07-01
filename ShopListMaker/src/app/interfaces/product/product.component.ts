import { Component, Input, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Producto } from 'src/app/services/producto';
import { Usuario } from 'src/app/services/usuario';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit{

  @Input() producto: Producto;
  @Input() usuario: Usuario;

  constructor(private firestoreService: FirestoreService) {
    this.producto = {} as Producto;
    this.usuario = {} as Usuario;
  }




  ngOnInit(): void {


  }
  // Eliminar posteriormente proque es para crear un producto en el firestore
  copyDocument() {
    const originalCollection = 'productos';
    const originalDocumentId = 'Zanahoria M';
    const newCollection = 'productos';
    const newDocumentId = 'Ginebra M';

    this.firestoreService.copyDocument(originalCollection, originalDocumentId, newCollection, newDocumentId);
  }


  async toggleFavorite(producto: Producto) {
    producto.favorito = !producto.favorito;

    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;

      const db = firebase.firestore();
      const userRef = db.collection('usuarios').doc(userId);

      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);

        if (userDoc.exists) {
          const favoritos = userDoc.get('favoritos') || [];

          if (producto.favorito) {
            favoritos.push(producto.nombre);
          } else {
            const index = favoritos.indexOf(producto.nombre);
            if (index > -1) {
              favoritos.splice(index, 1);
            }
          }

          transaction.update(userRef, { favoritos });
        }
      });
    }
  }


  addToCart(producto: Producto) {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;

      const db = firebase.firestore();
      const userRef = db.collection('usuarios').doc(userId);

      db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);

        if (userDoc.exists) {
          const carrito = userDoc.get('carrito') || [];

          carrito.push(producto);

          transaction.update(userRef, { carrito });
        }
      });
    }
  }
}
