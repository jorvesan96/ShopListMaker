import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Producto } from 'src/app/services/producto';
import { Usuario } from 'src/app/services/usuario';
import { from } from 'rxjs';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() producto: Producto;
  @Input() usuario: Usuario;
  @ViewChild('supermercadoImage', { static: true }) supermercadoImageRef!: ElementRef;

  public supermercadoImageUrl: string;
  constructor(private firestoreService: FirestoreService) {
    this.producto = {} as Producto;
    this.usuario = {} as Usuario;
    this.supermercadoImageUrl = '';
  }

  ngOnInit(): void {
    const supermercadoImageElement: HTMLImageElement = this.supermercadoImageRef.nativeElement;
    const supermercado = this.producto.supermercado;

    switch (supermercado) {
      case 'Mercadona':
        this.supermercadoImageUrl = 'assets/icons/mercadona.jpg';
        break;
      case 'Hiperdino':
        this.supermercadoImageUrl = 'assets/icons/hiperdino.jpg';
        break;
      case 'Carrefour':
        this.supermercadoImageUrl = 'assets/icons/carrefour.webp';
        break;
    }

    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      const db = firebase.firestore();
      const userRef = db.collection('usuarios').doc(userId);

      userRef.get().then((userDoc) => {
        if (userDoc.exists) {
          const favoritos = userDoc.get('favoritos') || [];
          const foundProducto = favoritos.find((p: Producto) => p.id === this.producto.id);

          if (foundProducto) {
            this.producto.favorito = true;
          }
        }
      });
    }


    const db = firebase.firestore();
    const productosRef = db.collection('productos').where('nombre', '==', this.producto.nombre);


    from(productosRef.get()).subscribe((snapshot) => {
      const productos = snapshot.docs.map((doc) => doc.data()) as Producto[];

      if (productos.length > 0) {
        let mejorProducto = productos[0];
        let mejorRelacion = mejorProducto.precio / mejorProducto.peso;

        for (let i = 1; i < productos.length; i++) {
          const relacion = productos[i].precio / productos[i].peso;
          if (relacion < mejorRelacion) {
            mejorProducto = productos[i];
            mejorRelacion = relacion;
          }
        }

        if (mejorProducto.id === this.producto.id) {
          this.producto.recomendado = true;
          const productoId = this.producto.id;

          const db = firebase.firestore();
          const productosCollectionRef = db.collection('productos');

          productosCollectionRef
            .where('id', '==', productoId)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const nombreDoc = doc.id;
                const productoDocRef = productosCollectionRef.doc(nombreDoc);

                productoDocRef
                  .update({
                    recomendado: true,
                  })
                  .then(() => {
                    console.log('Campo "recomendado" actualizado en Firestore.');
                  })
                  .catch((error) => {
                    console.error(
                      'Error al actualizar el campo "recomendado" en Firestore:',
                      error
                    );
                  });
              });
            })
            .catch((error) => {
              console.log('Error obteniendo el documento:', error);
            });
        }else{
          this.producto.recomendado = false;
          const productoId = this.producto.id;

          const db = firebase.firestore();
          const productosCollectionRef = db.collection('productos');

          productosCollectionRef
            .where('id', '==', productoId)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const nombreDoc = doc.id;
                const productoDocRef = productosCollectionRef.doc(nombreDoc);

                productoDocRef
                  .update({
                    recomendado: false,
                  })
                  .then(() => {
                    console.log('Campo "recomendado" actualizado en Firestore.');
                  })
                  .catch((error) => {
                    console.error(
                      'Error al actualizar el campo "recomendado" en Firestore:',
                      error
                    );
                  });
              });
            })
            .catch((error) => {
              console.log('Error obteniendo el documento:', error);
            });
        }

      }
    });


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
          favoritos.push(producto);
        } else {
          const index = favoritos.findIndex((p: Producto) => p.id === producto.id);
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

          const existingProduct = carrito.find((p: Producto) => p.id === producto.id);

          if (existingProduct) {
            existingProduct.cantidad++;
          } else {
            producto.cantidad = 1;
            carrito.push(producto);
          }

          transaction.update(userRef, { carrito });
        }
      });
    }
  }

}
