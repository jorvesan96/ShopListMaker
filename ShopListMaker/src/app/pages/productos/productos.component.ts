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
}
