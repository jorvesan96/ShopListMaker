import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiltroService {
  private terminoBusqueda: string = '';
  private supermercado: string = '';

  getTerminoBusqueda(): string {
    return this.terminoBusqueda;
  }

  setTerminoBusqueda(termino: string) {
    this.terminoBusqueda = termino;
  }

  getSupermercado(): string {
    return this.supermercado;
  }

  setSupermercado(supermercado: string) {
    this.supermercado = supermercado;
  }
}
