import { Component, OnInit } from '@angular/core';
import { FiltroService } from 'src/app/services/filtro.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  searchTerm: string = '';
  mostrarRecomendados: boolean = false;

  constructor(private filtroService: FiltroService) {}

  ngOnInit() {
    const firebaseConfig = {};

  const db = firebase.firestore();

  const collectionRef = db.collection('productos');
  collectionRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      this.productos.push(doc.data());
    });
    this.filtrarProductos();
  });

  if (this.mostrarRecomendados) {
    this.filtrarRecomendados();
  }
  }

  filtrarProductos() {
    this.searchTerm = this.filtroService.getTerminoBusqueda();
    if (this.searchTerm.trim() !== '') {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().startsWith(this.searchTerm.toLowerCase())
      );
    } else {
      this.productosFiltrados = this.productos;
    }
  }

  filtrarPorTipo(tipo: string) {
    this.productosFiltrados = this.productos.filter(producto => producto.tipo === tipo);
  }

  filtrarPorSuper(supermercado: string) {
    this.productosFiltrados = this.productos.filter(producto => producto.supermercado === supermercado);
  }

  filtrarRecomendados() {
    this.productosFiltrados = this.productos.filter(producto => producto.recomendado === true);
  }

  filtrarFavoritos() {
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;

      const db = firebase.firestore();
      const userRef = db.collection('usuarios').doc(userId);

      userRef.get().then((userDoc) => {
        if (userDoc.exists) {
          const favoritos = userDoc.get('favoritos') || [];
          this.productosFiltrados = this.productos.filter(producto =>
            favoritos.some((fav: any) => fav.id === producto.id)
          );
        }
      });
    }
  }
}
