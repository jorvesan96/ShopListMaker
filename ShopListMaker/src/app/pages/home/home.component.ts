import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FiltroService } from 'src/app/services/filtro.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchTerm: string = '';

  constructor(private router: Router, private filtroService: FiltroService) {}

  navigateToAnotherPage() {
    this.filtroService.setTerminoBusqueda(this.searchTerm);
    this.router.navigate(['/productos']);
  }

}
