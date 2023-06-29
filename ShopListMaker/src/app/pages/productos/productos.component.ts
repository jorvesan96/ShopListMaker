  import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit{

  productos: string[] = ['Producto 1', 'Producto 2', 'Producto 3', 'Producto 4', 'Producto 5', 'Producto 6'];

  ngOnInit() {
    this.renderProductos();
  }

  renderProductos() {
    const productGrid = document.getElementById('productGrid');
    for (let i: number = 0; i < this.productos.length; i++) {
      const appProduct: HTMLElement = document.createElement('app-product');
      productGrid?.appendChild(appProduct);
    }
  }

}
