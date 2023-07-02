import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Carrito } from 'src/app/services/carrito';


@Component({
  selector: 'app-lista-compra',
  templateUrl: './lista-compra.component.html',
  styleUrls: ['./lista-compra.component.css']
})
export class ListaCompraComponent implements OnInit {
  productos: Carrito[] = [];
  user = firebase.auth().currentUser;
  sumaCarrito = 0;

  constructor(
    private location: Location,
    private firestore: AngularFirestore,
  ) {}

  ngOnInit() {

    const db = firebase.firestore();
    if (this.user) {
      this.firestore
        .collection('usuarios')
        .doc(this.user.uid)
        .get()
        .subscribe((doc) => {
          if (doc.exists) {
            const data: any = doc.data();
            this.productos = data?.carrito;
            localStorage.setItem('carrito', JSON.stringify(this.productos));

            this.calcularSumaCarrito();
            localStorage.setItem('sumaCarrito', this.sumaCarrito.toString());
          }
        });
    } else {
      const storedProductos = localStorage.getItem('carrito');
      const storedSumaCarrito = localStorage.getItem('sumaCarrito');
      const storedSupermercado = localStorage.getItem('supermercado');
      if (storedProductos) {
        this.productos = JSON.parse(storedProductos);
      }
      if (storedSumaCarrito) {
        this.sumaCarrito = parseFloat(storedSumaCarrito); // Asignar el valor almacenado a la propiedad sumaCarrito
      }
      if (storedSupermercado) {
        localStorage.setItem('supermercado', storedSupermercado);
      }
    }
    this.ordenarProductosPorSupermercado();
  }

  calcularPrecioGastado(cantidad: number, precio: number): number {
    return cantidad * precio;
  }

  calcularSumaCarrito() {
    let suma = 0;
    this.productos.forEach((producto: any) => {
      suma += this.calcularPrecioGastado(producto.cantidad, producto.precio);
    });
    this.sumaCarrito = suma;
    localStorage.setItem('sumaCarrito', this.sumaCarrito.toString()); // Almacenar el nuevo valor en el localStorage
  }

  ordenarProductosPorSupermercado() {
    this.productos.sort((a, b) => {
      if (a.supermercado < b.supermercado) {
        return -1;
      }
      if (a.supermercado > b.supermercado) {
        return 1;
      }
      return 0;
    });
  }


  imprimir(): void {
    window.print();
  }

  goBack(): void {
    this.location.back();
  }

  eliminarProducto(producto: Carrito): void {

    producto.cantidad--;
    if(producto.cantidad < 1){
      this.productos = this.productos.filter((p) => p.id !== producto.id);

    }
    this.calcularSumaCarrito();
    localStorage.setItem('carrito', JSON.stringify(this.productos));
    localStorage.setItem('sumaCarrito', this.sumaCarrito.toString()); // Almacenar el nuevo valor en el localStorage
    this.firestore
      .collection('usuarios')
      .doc(this.user?.uid)
      .update({
        carrito: this.productos,
      })
      .then(() => {
        console.log('Actualizado');
      }
      );

  }

  limpiarCarrito(): void {
    const confirmed = confirm('¿Estás seguro de que deseas limpiar el carrito?');
    if (confirmed) {
      // Clear the local storage
      localStorage.removeItem('carrito');
      localStorage.removeItem('sumaCarrito');

      // Clear the products array
      this.productos = [];

      // Clear the Firestore "carrito" field for the current user
      const user = firebase.auth().currentUser;
      if (user) {
        const db = firebase.firestore();
        db.collection('usuarios').doc(user.uid).update({
          carrito: []
        }).then(() => {
          console.log('Carrito limpiado');
        }).catch((error) => {
          console.error('Error al limpiar el carrito:', error);
        });
      }
    }
  }


}
