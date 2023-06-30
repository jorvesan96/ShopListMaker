import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lista-compra',
  templateUrl: './lista-compra.component.html',
  styleUrls: ['./lista-compra.component.css']
})
export class ListaCompraComponent {
  constructor( private location:Location) {}
  imprimir(): void {
    window.print();
  }

  goBack(): void {
    this.location.back();
  }
}
