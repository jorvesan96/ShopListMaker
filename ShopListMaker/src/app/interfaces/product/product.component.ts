import { Component, Input, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit{
  @Input() producto: any;


  constructor(private firestoreService: FirestoreService) { }

  productos: any = [];
  productoSeleccionado: any;

  ngOnInit(): void {
    this.recorrerColeccion();
    console.log(this.producto.imagen);
  }
  // Eliminar posteriormente proque es para crear un producto en el firestore
  copyDocument() {
    const originalCollection = 'productos';
    const originalDocumentId = 'Zanahoria M';
    const newCollection = 'productos';
    const newDocumentId = 'Ginebra M';

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
    });
    this.productos= miArray;

  }

  // cambiarImagenCorazon() {
  //   var imagenCorazon = document.getElementById("lleno") as HTMLImageElement;
  //   var imagenProducto = document.getElementById("vacio") as HTMLImageElement;

  //   if (imagenCorazon && imagenProducto) {
  //     if (imagenCorazon.src.endsWith("lleno.png")) {
  //       imagenCorazon.src = "assets/icons/vacio.png";
  //     } else {
  //       imagenCorazon.src = "assets/icons/lleno.png";
  //     }
  //   }
  // }
  seleccionarProducto(producto: any) {
    this.productoSeleccionado = producto;
    console.log(this.productoSeleccionado, "producto seleccionado");
  }

}
