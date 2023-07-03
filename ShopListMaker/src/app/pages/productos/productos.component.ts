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
  public filtroTipo: string | null = null;
  public filtroFavoritos: boolean = false;
  public filtroSupermercado: string | null = null;
  public filtroRecomendado: boolean = false;
  isUserAuthenticated: boolean = false;
  supermercadoSeleccionado: string = 'Supermercados';


  constructor(private filtroService: FiltroService) {}

  ngOnInit() {
    const firebaseConfig = {};
    const user = firebase.auth().currentUser;
    this.isUserAuthenticated = !!user;
    const db = firebase.firestore();

    const collectionRef = db.collection('productos');
    collectionRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.productos.push(doc.data());
      });
      this.filtrarProductos();
    });

      this.filtrarProductos();
  }

  filtrarPorTipo(tipo: string) {
    this.filtroTipo = tipo;
    this.filtroService.setTerminoBusqueda('');
    this.filtrarProductos();
  }

  filtrarFavoritos() {
    this.filtroFavoritos = true;
    this.filtroService.setTerminoBusqueda('');
    this.filtrarProductos();
  }

  filtrarPorSuper(supermercado: string) {
    this.filtroSupermercado = supermercado;
    this.filtroService.setTerminoBusqueda('');
    this.filtrarProductos();
  }

  filtrarPorRecomendados() {
    this.filtroRecomendado = true;
    this.filtroService.setTerminoBusqueda('');
    this.filtrarProductos();
  }

  filtrarProductos() {
    this.productosFiltrados = this.productos;

    if (this.filtroTipo) {
      this.productosFiltrados = this.productosFiltrados.filter(producto => producto.tipo === this.filtroTipo);
    }
    if (this.filtroService.getTerminoBusqueda()) {
      const terminoBusqueda = this.filtroService.getTerminoBusqueda();
      this.productosFiltrados = this.productosFiltrados.filter(producto =>
        producto.nombre.toLowerCase().startsWith(terminoBusqueda.toLowerCase())
      );
    }

    if (this.filtroFavoritos) {
      const user = firebase.auth().currentUser;
      if (user) {
        const userId = user.uid;

        const db = firebase.firestore();
        const userRef = db.collection('usuarios').doc(userId);

        userRef.get().then((userDoc) => {
          if (userDoc.exists) {
            const favoritos = userDoc.get('favoritos') || [];
            this.productosFiltrados = this.productosFiltrados.filter(producto =>
              favoritos.some((fav: any) => fav.id === producto.id)
            );
          }
        });
      }
    }

    if (this.filtroRecomendado) {
      this.productosFiltrados = this.productos.filter(producto => producto.recomendado === true);
    }

    if (this.filtroSupermercado) {
      this.productosFiltrados = this.productosFiltrados.filter(producto => producto.supermercado === this.filtroSupermercado);
    }
  }

  resetearFiltros() {
    this.filtroTipo = null;
    this.filtroFavoritos = false;
    this.filtroSupermercado = null;
    this.filtroRecomendado=false;
    this.filtroService.setTerminoBusqueda('');
    this.filtrarProductos();
  }

  seleccionarSupermercado(supermercado: string) {
    this.supermercadoSeleccionado = supermercado;
  }
}
